import Stripe from 'stripe';
import { updateUser } from './auth';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest Stripe API version
});

// Create or get a Stripe customer
export async function createOrGetStripeCustomer(userId: string, email: string, name: string): Promise<string | null> {
  try {
    // First check if the user already has a Stripe customer ID
    const user = await updateUser(userId, {});
    if (user?.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // If not, create a new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    // Save the customer ID to the user record
    await updateUser(userId, { stripeCustomerId: customer.id });

    return customer.id;
  } catch (error) {
    console.error('Error creating or getting Stripe customer:', error);
    return null;
  }
}

// Create a checkout session for subscription
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  mode: 'subscription' | 'payment' = 'subscription'
): Promise<string | null> {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: `${baseUrl}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/subscription?canceled=true`,
      metadata: {
        userId,
      },
    });

    return session.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}

// Create a Stripe subscription for a customer
export async function createSubscription(
  customerId: string,
  priceId: string,
  userId: string
): Promise<{ subscriptionId: string; clientSecret: string | null } | null> {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId,
      },
    });

    // Update the user with the subscription ID
    await updateUser(userId, {
      stripeSubscriptionId: subscription.id,
      isPro: true,
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || null,
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return null;
  }
}

// Create a one-time payment intent
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  customerId?: string
): Promise<{ clientSecret: string } | null> {
  try {
    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
    };

    if (customerId) {
      paymentIntentData.customer = customerId;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    return { clientSecret: paymentIntent.client_secret! };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return null;
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string, userId: string): Promise<boolean> {
  try {
    await stripe.subscriptions.cancel(subscriptionId);
    
    // Update the user record
    await updateUser(userId, {
      isPro: false,
    });
    
    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

// Handle Stripe webhook events
export async function handleWebhookEvent(event: Stripe.Event): Promise<boolean> {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        
        if (userId) {
          if (session.mode === 'subscription') {
            // Set the user as a pro user
            await updateUser(userId, {
              isPro: true,
            });
          }
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          await updateUser(userId, {
            isPro: true,
          });
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          // Don't change pro status yet, as they might still pay
          console.log(`Payment failed for user ${userId}`);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          await updateUser(userId, {
            isPro: false,
          });
        }
        break;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return false;
  }
}