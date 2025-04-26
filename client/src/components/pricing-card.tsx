import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface PricingFeature {
  title: string;
  included: boolean;
}

interface PricingTierProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  buttonText: string;
  buttonLink: string;
  buttonVariant?: "default" | "outline";
}

export function PricingCard({
  title,
  price,
  description,
  features,
  popular = false,
  buttonText,
  buttonLink,
  buttonVariant = "default"
}: PricingTierProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  
  return (
    <Card className={`border ${popular ? 'border-primary-100 shadow-md' : ''} relative`}>
      {popular && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          <span className="bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full">POPULAR</span>
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900">{price}</span>
          {price !== "Free" && <span className="ml-1 text-gray-500">/month</span>}
        </div>
        <CardDescription className="mt-5">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="mt-6 space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              {feature.included ? (
                <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              )}
              <span className={feature.included ? "text-gray-600" : "text-gray-500"}>
                {feature.title}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href={buttonLink} className="w-full">
          <Button 
            variant={buttonVariant as any} 
            className="w-full py-3"
            disabled={
              // If user is already on Pro plan and this is the Pro plan
              user?.isPro && title === "Pro" && location.includes('pricing')
            }
          >
            {user?.isPro && title === "Pro" ? "Current Plan" : buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
