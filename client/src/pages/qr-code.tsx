import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { QRGenerator } from "@/components/qr-generator";
import { QrCode, Home, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function QRCodePage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/qr-code">QR Code Generator</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
                <p className="text-gray-600">Create and customize QR codes for URLs, text, or email addresses</p>
              </div>
            </div>
            
            {!user && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Sign in to save your QR codes and access advanced customization options.</span>
                  <Link href="/auth">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-center mt-8">
              <QRGenerator />
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">QR Code Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                      <ExternalLink className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Website URLs</h3>
                    <p className="text-gray-600 text-sm">
                      Create QR codes that open your website or specific web pages when scanned.
                      Perfect for business cards, promotional materials, or product packaging.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Email Addresses</h3>
                    <p className="text-gray-600 text-sm">
                      Generate QR codes that open a new email draft when scanned.
                      Useful for contact information or customer feedback forms.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Plain Text</h3>
                    <p className="text-gray-600 text-sm">
                      Create QR codes that display text messages when scanned.
                      Great for event details, special offers, or quick information.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About QR Codes</h2>
              <div className="prose max-w-none">
                <p>
                  QR codes (Quick Response codes) are two-dimensional barcodes that can be scanned using 
                  smartphone cameras or dedicated QR code readers. They can store various types of data, 
                  such as URLs, text, contact information, and more.
                </p>
                <h3>Pro Features:</h3>
                <ul>
                  <li>Customize colors and styles to match your brand</li>
                  <li>Download in high-resolution formats</li>
                  <li>Track QR code scans and analytics</li>
                  <li>Create dynamic QR codes that can be updated later</li>
                  <li>Bulk generation for multiple QR codes</li>
                </ul>
                <p>
                  <strong>Pro tip:</strong> When printing QR codes, make sure they are at least 2x2 cm 
                  in size for optimal scanning. Also, maintain good contrast between the QR code and the 
                  background for better readability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
