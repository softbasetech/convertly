import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PricingCard } from "@/components/pricing-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<string>("monthly");
  
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
  
  // FAQ questions
  const faqItems = [
    {
      question: "What happens when I reach my daily conversion limit?",
      answer: "Free users are limited to 5 conversions per day. Once you reach this limit, you'll need to wait until the next day to perform more conversions, or upgrade to our Pro plan for unlimited conversions."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period. We don't offer refunds for partial subscription periods."
    },
    {
      question: "How do the API keys work?",
      answer: "Pro users can generate API keys from their dashboard. These keys allow you to access our conversion services programmatically, enabling integration with your own applications or workflows. Each key can be revoked or regenerated as needed."
    },
    {
      question: "Is my data secure?",
      answer: "We take data security seriously. Files are processed on our secure servers and automatically deleted after conversion. We don't store your uploaded files or converted results beyond the necessary processing time."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe. All payment information is encrypted and we never store your full credit card details."
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works for you. Start with our free tier and upgrade when you need more.
            </p>
            
            <div className="mt-8 flex justify-center">
              <Tabs
                defaultValue="monthly"
                value={billingCycle}
                onValueChange={setBillingCycle}
                className="w-full max-w-md"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <TabsContent value="monthly" className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PricingCard
                  title="Free"
                  price="$0"
                  description="Perfect for occasional use and small projects."
                  features={freeFeatures}
                  buttonText="Sign Up Free"
                  buttonLink="/auth"
                  buttonVariant="outline"
                />
                
                <PricingCard
                  title="Pro"
                  price="$9.99"
                  description="For professionals and teams with higher needs."
                  features={proFeatures}
                  buttonText="Get Started"
                  buttonLink="/auth?plan=pro"
                  popular={true}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="annual" className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PricingCard
                  title="Free"
                  price="$0"
                  description="Perfect for occasional use and small projects."
                  features={freeFeatures}
                  buttonText="Sign Up Free"
                  buttonLink="/auth"
                  buttonVariant="outline"
                />
                
                <PricingCard
                  title="Pro"
                  price="$7.99"
                  description="For professionals and teams with higher needs."
                  features={proFeatures}
                  buttonText="Get Started"
                  buttonLink="/auth?plan=pro-annual"
                  popular={true}
                />
              </div>
            </TabsContent>
          </div>
          
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 pr-4 font-medium">Feature</th>
                    <th className="py-4 px-4 text-center font-medium">Free</th>
                    <th className="py-4 pl-4 text-center font-medium">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 pr-4">Daily conversions</td>
                    <td className="py-4 px-4 text-center">5</td>
                    <td className="py-4 pl-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4">Max file size</td>
                    <td className="py-4 px-4 text-center">10MB</td>
                    <td className="py-4 pl-4 text-center">100MB</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4">PDF conversions</td>
                    <td className="py-4 px-4 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="py-4 pl-4 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4">Image conversions</td>
                    <td className="py-4 px-4 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="py-4 pl-4 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4">QR code generation</td>
                    <td className="py-4 px-4 text-center">Basic</td>
                    <td className="py-4 pl-4 text-center">Advanced</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4">API access</td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </td>
                    <td className="py-4 pl-4 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4">Conversion history</td>
                    <td className="py-4 px-4 text-center">7 days</td>
                    <td className="py-4 pl-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4">Priority support</td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </td>
                    <td className="py-4 pl-4 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-gray-600">
                Got questions? We've got answers.
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pl-7">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">Still have questions?</p>
              <Link href="/contact">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-24 max-w-5xl mx-auto bg-primary-50 rounded-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to streamline your workflow?</h2>
                <p className="mt-2 text-gray-600">Join thousands of users who trust ConvertHub for their conversion needs.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link href="/convert">
                  <Button variant="outline" size="lg">Try a Conversion</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
