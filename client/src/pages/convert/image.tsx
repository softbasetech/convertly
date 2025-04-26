import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { FileConverter } from "@/components/file-converter";
import { getImageConversionOptions } from "@/lib/file-utils";
import { Image, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImageConvertPage() {
  const { user } = useAuth();
  const imageConversionOptions = getImageConversionOptions();
  
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
                <BreadcrumbLink href="/convert">Convert</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/convert/image">Image</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Image Conversion</h1>
                <p className="text-gray-600">Convert images between different formats</p>
              </div>
            </div>
            
            {!user && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Sign in to track your conversion history and get more daily conversions.</span>
                  <Link href="/auth">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="converter" className="mt-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="converter">Converter</TabsTrigger>
                <TabsTrigger value="info">Format Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="converter" className="mt-6">
                <div className="flex justify-center">
                  <FileConverter
                    title="Image Converter"
                    description="Convert between JPG, PNG, WebP and other image formats."
                    conversionOptions={imageConversionOptions}
                    allowedSourceTypes={['jpg', 'jpeg', 'png', 'webp']}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="info" className="mt-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">About Image Formats</h2>
                  <div className="prose max-w-none">
                    <h3>JPEG/JPG</h3>
                    <p>
                      JPEG is best for photographs and complex images with gradients. It uses lossy compression, 
                      which means some image quality is sacrificed to reduce file size.
                    </p>
                    
                    <h3>PNG</h3>
                    <p>
                      PNG is ideal for images that need transparency or contain text/line art. It uses lossless 
                      compression, preserving image quality at the expense of larger file sizes.
                    </p>
                    
                    <h3>WebP</h3>
                    <p>
                      WebP is a modern format that provides both lossy and lossless compression. It typically 
                      produces smaller files than JPEG or PNG while maintaining similar quality. It's excellent 
                      for web use but has less universal support.
                    </p>
                    
                    <h3>Image to PDF</h3>
                    <p>
                      Converting images to PDF is useful for creating document presentations, distributing 
                      images in a standardized format, or combining multiple images into a single document.
                    </p>
                    
                    <h3>Which format should I choose?</h3>
                    <ul>
                      <li><strong>JPEG</strong> - For photographs, complex images, smaller file size priority</li>
                      <li><strong>PNG</strong> - For images with transparency, text, or when quality is critical</li>
                      <li><strong>WebP</strong> - For web usage, best balance of quality and file size</li>
                      <li><strong>PDF</strong> - For document distribution or printing</li>
                    </ul>
                  </div>
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
