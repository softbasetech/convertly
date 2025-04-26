import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { FileConverter } from "@/components/file-converter";
import { getPDFConversionOptions } from "@/lib/file-utils";
import { FileText, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PDFConvertPage() {
  const { user } = useAuth();
  const pdfConversionOptions = getPDFConversionOptions();
  
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
                <BreadcrumbLink href="/convert/pdf">PDF</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">PDF Conversion</h1>
                <p className="text-gray-600">Convert PDF files to different formats and vice versa</p>
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
            
            <div className="flex justify-center mt-8">
              <FileConverter
                title="PDF Converter"
                description="Convert between PDF and other document formats. Supports PDF, DOCX, and images."
                conversionOptions={pdfConversionOptions}
                allowedSourceTypes={['pdf', 'docx', 'jpg', 'jpeg', 'png']}
              />
            </div>
            
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About PDF Conversion</h2>
              <div className="prose max-w-none">
                <p>
                  Our PDF conversion tool allows you to convert PDF documents to editable formats like DOCX, 
                  as well as converting other formats to PDF. The conversion maintains the original layout, 
                  formatting, and quality as much as possible.
                </p>
                <h3>Supported Conversions:</h3>
                <ul>
                  <li><strong>PDF to DOCX</strong> - Convert PDF files to editable Word documents</li>
                  <li><strong>DOCX to PDF</strong> - Convert Word documents to PDF format</li>
                  <li><strong>PDF to Images</strong> - Extract pages from PDF as images</li>
                  <li><strong>Images to PDF</strong> - Combine images into a PDF document</li>
                </ul>
                <p>
                  <strong>Pro tip:</strong> For best results with PDF to DOCX conversion, 
                  ensure your PDF document contains selectable text rather than scanned images.
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
