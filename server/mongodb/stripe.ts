import Stripe from 'stripe';
import { updateUser } from './auth';
import { connectToDatabase } from './connect';

// Connect to database
connectToDatabase();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// Create or get a Stripe customer for a user
export async function createOrGetStripeCustomer(userId: string, email: string, name: string): Promise<string | null> {
  try {
    // Check if user already has a Stripe customer ID
    const user = await updateUser(userId, {});
    
    if (user?.stripeCustomerId) {
      return user.stripeCustomerId;
    }
    
    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId
      }
    });
    
    // Update the user with the new Stripe customer ID
    const updatedUser = await updateUser(userId, {
      stripeCustomerId: customer.id
    });
    
    return updatedUser?.stripeCustomerId || null;
  } catch (error) {
    console.error('Error creating or getting Stripe customer:', error);
    return null;
  }
}

// Create a checkout session for one-time payment
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string | null> {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl
    });
    
    return session.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}

// Create a subscription
export async function createSubscription(
  userId: string,
  customerId: string,
  priceId: string
): Promise<{ subscriptionId: string, clientSecret: string | null } | null> {
  try {
    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId
        }
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });
    
    // Update the user with the subscription ID
    await updateUser(userId, {
      stripeSubscriptionId: subscription.id
    });
    
    return {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret || null
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return null;
  }
}

// Create a payment intent
export async function createPaymentIntent(
  customerId: string,
  amount: number,
  currency: string = 'usd'
): Promise<string | null> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true
      }
    });
    
    return paymentIntent.client_secret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return null;
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string, userId: string): Promise<boolean> {
  try {
    await stripe.subscriptions.cancel(subscriptionId);
    
    // Update the user's subscription status
    await updateUser(userId, {
      isPro: false
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
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find the user with this Stripe customer ID by querying the database
        // This would be handled by the MongoDBStorage class
        
        // Update the user's subscription status
        const status = subscription.status;
        const isPro = status === 'active' || status === 'trialing';
        
        // We would need to update this in our MongoDB storage
        
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find the user with this Stripe customer ID by querying the database
        // This would be handled by the MongoDBStorage class
        
        // Update the user's subscription status
        // We would need to update this in our MongoDB storage
        
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // If this invoice is for a subscription, update the user's status
        if (invoice.subscription) {
          // Get the subscription
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          // Find the user with this subscription ID
          const customerId = subscription.customer as string;
          
          // Update the user's subscription status
          const status = subscription.status;
          const isPro = status === 'active' || status === 'trialing';
          
          // We would need to update this in our MongoDB storage
        }
        
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // If this invoice is for a subscription, update the user's status
        if (invoice.subscription) {
          // Get the subscription
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          // Find the user with this subscription ID
          const customerId = subscription.customer as string;
          
          // Update the user's subscription status
          // We would need to update this in our MongoDB storage
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