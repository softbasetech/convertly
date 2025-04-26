import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingCard } from "@/components/pricing-card";
import { formatDate } from "@/lib/file-utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe-client";
import { Loader2, CheckCircle, CreditCard, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Free plan features
const freeFeatures = [
  { title: "5 conversions per day", included: true },
  { title: "10MB file size limit", included: true },
  { title: "Standard conversion quality", included: true },
  { title: "Basic QR code generation", included: true },
  { title: "API access", included: false },
];

// Pro plan features
const proFeatures = [
  { title: "Unlimited conversions", included: true },
  { title: "100MB file size limit", included: true },
  { title: "Priority conversion quality", included: true },
  { title: "Advanced QR code customization", included: true },
  { title: "Full API access", included: true },
];

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    
    // Confirm payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard/subscription?success=true",
      },
      redirect: "if_required",
    });
    
    // Handle errors
    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for subscribing to Pro plan!",
      });
      onSuccess();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" className="w-full" disabled={!stripe || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Subscribe Now"
        )}
      </Button>
    </form>
  );
};

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<string>("monthly");
  
  // Check for success param in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    
    if (success === "true") {
      toast({
        title: "Subscription activated",
        description: "Your Pro subscription has been successfully activated!",
      });
      
      // Remove the query param from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    }
  }, [toast]);
  
  const { data: subscriptionData, isLoading: isSubscriptionLoading } = useQuery<{
    subscription: {
      id: string;
      status: string;
      currentPeriodEnd: string;
      cancelAtPeriodEnd: boolean;
    } | null;
  }>({
    queryKey: ["/api/users/me/subscription"],
    enabled: !!user,
  });
  
  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/create-subscription");
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else {
        toast({
          title: "Payment initialization failed",
          description: "Could not initialize payment",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/subscriptions/cancel");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/subscription"] });
      toast({
        title: "Subscription cancelled",
        description: "Your subscription will end at the end of the current billing period.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const resumeSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/subscriptions/resume");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/subscription"] });
      toast({
        title: "Subscription resumed",
        description: "Your subscription will continue at the end of the current billing period.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resume subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleUpgrade = () => {
    createSubscriptionMutation.mutate();
  };
  
  const handleSubscriptionSuccess = () => {
    setIsUpgrading(false);
    queryClient.invalidateQueries({ queryKey: ["/api/user"] });
  };
  
  const handleCancelSubscription = () => {
    if (confirm("Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your current billing period.")) {
      cancelSubscriptionMutation.mutate();
    }
  };
  
  const handleResumeSubscription = () => {
    resumeSubscriptionMutation.mutate();
  };
  
  if (isSubscriptionLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex pt-16">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-6 lg:pl-72">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Subscription Management</h1>
                <p className="text-muted-foreground">
                  Manage your subscription plan and billing information
                </p>
              </div>
            </div>
            
            {/* Current Subscription Status */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Your current subscription details and usage limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">
                        {user?.isPro ? "Pro Plan" : "Free Plan"}
                      </h3>
                      {user?.isPro && (
                        <Badge className="bg-primary text-white">Active</Badge>
                      )}
                      {subscriptionData?.subscription?.cancelAtPeriodEnd && (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50">
                          Cancels soon
                        </Badge>
                      )}
                    </div>
                    {user?.isPro ? (
                      <div className="space-y-3">
                        <p className="text-muted-foreground">
                          You have access to all premium features including:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            Unlimited file conversions
                          </li>
                          <li className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            100MB file size limit
                          </li>
                          <li className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            Priority conversion quality
                          </li>
                          <li className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            Advanced QR code customization
                          </li>
                          <li className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            Full API access
                          </li>
                        </ul>
                        
                        {subscriptionData?.subscription && (
                          <div className="pt-2 space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Amount: GHS 145.52/month
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              {subscriptionData.subscription.cancelAtPeriodEnd 
                                ? "Your subscription will end on "
                                : "Next billing date: "
                              }
                              {formatDate(new Date(subscriptionData.subscription.currentPeriodEnd))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Limited to 5 conversions per day, 10MB file size limit
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    {user?.isPro ? (
                      subscriptionData?.subscription?.cancelAtPeriodEnd ? (
                        <Button
                          onClick={handleResumeSubscription}
                          disabled={resumeSubscriptionMutation.isPending}
                        >
                          {resumeSubscriptionMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Resume Subscription"
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={handleCancelSubscription}
                          disabled={cancelSubscriptionMutation.isPending}
                        >
                          {cancelSubscriptionMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Cancel Subscription"
                          )}
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={handleUpgrade}
                        disabled={createSubscriptionMutation.isPending}
                      >
                        {createSubscriptionMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Upgrade to Pro"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Checkout Modal */}
            {isUpgrading && clientSecret && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Complete Your Subscription</CardTitle>
                  <CardDescription>
                    Enter your payment details to subscribe to the Pro plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm onSuccess={handleSubscriptionSuccess} />
                    </Elements>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Compare Plans */}
            {!isUpgrading && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold">Compare Plans</h2>
                <Tabs defaultValue="monthly" value={billingPeriod} onValueChange={setBillingPeriod} className="w-full max-w-md">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <PricingCard
                    title="Free"
                    price="$0"
                    description="Perfect for occasional use and small projects."
                    features={freeFeatures}
                    buttonText={user?.isPro ? "Current Plan" : "Free Plan"}
                    buttonLink="#"
                    buttonVariant="outline"
                  />
                  
                  <PricingCard
                    title="Pro"
                    price={billingPeriod === "monthly" ? "$9.99" : "$7.99"}
                    description="For professionals and teams with higher needs."
                    features={proFeatures}
                    buttonText={user?.isPro ? "Current Plan" : "Upgrade to Pro"}
                    buttonLink="#"
                    popular={true}
                  />
                </div>
                
                <Card className="mt-12">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Secure Payments</h3>
                        <p className="text-sm text-muted-foreground">
                          All payments are processed securely through Stripe. We never store your full credit card information on our servers.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Billing Policy</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                          <li>You can cancel your subscription at any time</li>
                          <li>When you cancel, you'll retain access until the end of your current billing period</li>
                          <li>We don't offer partial refunds for unused subscription time</li>
                          <li>Annual subscriptions are billed once per year at the discounted rate</li>
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Need Help?</h3>
                        <p className="text-sm text-muted-foreground">
                          If you have any questions about billing or your subscription, please contact our support team.
                        </p>
                        <Button variant="outline" className="mt-2">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
