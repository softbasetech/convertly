
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Helmet } from "react-helmet";
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
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsOfServicePage from "@/pages/terms-of-service";

function Router() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <Helmet>
        <title>ConvertHub - File Conversion & QR Code Generator</title>
        <meta name="description" content="Convert files between formats, generate QR codes, and more. All in one intuitive platform." />
        <meta name="keywords" content="file conversion, PDF converter, image converter, QR code generator, document conversion" />
        <meta name="author" content="ConvertHub" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="ConvertHub - File Conversion & QR Code Generator" />
        <meta property="og:description" content="Convert files between formats, generate QR codes, and more. All in one intuitive platform." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/generated-icon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ConvertHub - File Conversion & QR Code Generator" />
        <meta name="twitter:description" content="Convert files between formats, generate QR codes, and more. All in one intuitive platform." />
        <link rel="canonical" href="https://converthub.com" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ConvertHub",
            "description": "All-in-one file conversion and QR code generation platform",
            "applicationCategory": "Utility",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "features": [
              "File conversion",
              "QR code generation",
              "PDF conversion",
              "Image conversion",
              "Document conversion"
            ]
          })}
        </script>
      </Helmet>

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
