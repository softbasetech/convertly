import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, File, ArrowRightLeft } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

import { Helmet } from "react-helmet";

export default function ConvertPage() {
  const { user, isLoading } = useAuth();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ConvertHub File Converter",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "description": "All-in-one file conversion platform. Convert documents, images, and generate QR codes with ease.",
    "featureList": [
      "PDF conversion",
      "Image format conversion",
      "Document conversion",
      "QR code generation"
    ]
  };
  
  // Optional: redirect to auth if not logged in
  // if (!isLoading && !user) {
  //   return <Redirect to="/auth" />;
  // }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Online File Converter - Convert PDF, Images & Documents | ConvertHub</title>
        <meta name="description" content="Convert files between multiple formats. Support for PDF, DOCX, images and more. Free online converter with high quality results." />
        <meta name="keywords" content="file converter, PDF converter, document converter, image converter, online converter" />
        <meta property="og:title" content="Online File Converter - ConvertHub" />
        <meta property="og:description" content="Convert files between multiple formats. PDF, DOCX, images and more supported." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://converthub.com/convert" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">File Conversion Tools</h1>
            <p className="text-lg text-gray-600 mb-8">
              Select the type of conversion you need. Convert between document formats, image types, and more.
            </p>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* PDF Conversions */}
                  <Link href="/convert/pdf">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">PDF Conversions</h3>
                        <p className="text-sm text-gray-500">Convert PDF to DOCX or images and vice versa</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {/* Image Conversions */}
                  <Link href="/convert/image">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <Image className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Image Conversions</h3>
                        <p className="text-sm text-gray-500">Convert between JPG, PNG, WebP and other formats</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {/* Document Conversions */}
                  <Link href="/convert/doc">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <File className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Document Conversions</h3>
                        <p className="text-sm text-gray-500">Convert DOCX to PDF and other document formats</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {/* QR Code Generator */}
                  <Link href="/qr-code">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <ArrowRightLeft className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">QR Code Generator</h3>
                        <p className="text-sm text-gray-500">Create customized QR codes for URLs, text or email</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="document" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* PDF to DOCX */}
                  <Link href="/convert/pdf">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">PDF to DOCX</h3>
                        <p className="text-sm text-gray-500">Convert PDF files to editable Word documents</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {/* DOCX to PDF */}
                  <Link href="/convert/doc">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <File className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">DOCX to PDF</h3>
                        <p className="text-sm text-gray-500">Convert Word documents to PDF format</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* PNG to JPG */}
                  <Link href="/convert/image">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <Image className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">PNG to JPG</h3>
                        <p className="text-sm text-gray-500">Convert PNG images to JPG format</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {/* JPG to PNG */}
                  <Link href="/convert/image">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <Image className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">JPG to PNG</h3>
                        <p className="text-sm text-gray-500">Convert JPG images to PNG format</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {/* WebP Conversions */}
                  <Link href="/convert/image">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <Image className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">WebP Conversions</h3>
                        <p className="text-sm text-gray-500">Convert to and from WebP format</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {/* Image to PDF */}
                  <Link href="/convert/image">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <Image className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Image to PDF</h3>
                        <p className="text-sm text-gray-500">Convert images to PDF documents</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="qr" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* QR Code Generator */}
                  <Link href="/qr-code">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                          <ArrowRightLeft className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">QR Code Generator</h3>
                        <p className="text-sm text-gray-500">Create customized QR codes for URLs, text or email</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
