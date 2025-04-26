import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ConvertPage from "@/pages/convert";
import PDFConvertPage from "@/pages/convert/pdf";
import ImageConvertPage from "@/pages/convert/image";
import DocConvertPage from "@/pages/convert/doc";
import QRCodePage from "@/pages/qr-code";
import PricingPage from "@/pages/pricing";
import DocsPage from "@/pages/docs";
import DashboardPage from "@/pages/dashboard";
import ConversionsPage from "@/pages/dashboard/conversions";
import APIKeysPage from "@/pages/dashboard/api-keys";
import ProfilePage from "@/pages/dashboard/profile";
import SubscriptionPage from "@/pages/dashboard/subscription";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AboutPage from "@/pages/about"; // Added import
import ContactPage from "@/pages/contact";
import PrivacyPolicyPage from "@/pages/privacy-policy"; // Added import
import TermsOfServicePage from "@/pages/terms-of-service"; // Added import

function Router() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <Switch>
        {/* Public pages */}
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/convert" component={ConvertPage} />
        <Route path="/convert/pdf" component={PDFConvertPage} />
        <Route path="/convert/image" component={ImageConvertPage} />
        <Route path="/convert/doc" component={DocConvertPage} />
        <Route path="/qr-code" component={QRCodePage} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/docs" component={DocsPage} />

        {/* Protected dashboard routes */}
        <ProtectedRoute path="/dashboard" component={DashboardPage} />
        <ProtectedRoute
          path="/dashboard/conversions"
          component={ConversionsPage}
        />
        <ProtectedRoute path="/dashboard/api-keys" component={APIKeysPage} />
        <ProtectedRoute path="/dashboard/profile" component={ProfilePage} />
        <ProtectedRoute
          path="/dashboard/subscription"
          component={SubscriptionPage}
        />

        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/terms-of-service" component={TermsOfServicePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />

        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
