import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { FileConverter } from "@/components/file-converter";
import { getPDFConversionOptions } from "@/lib/file-utils";
import { File, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function DocConvertPage() {
  const { user } = useAuth();
  const docConversionOptions = getPDFConversionOptions()
    .filter(option => option.sourceFormat === 'docx' || option.targetFormat === 'docx');
  
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
                <BreadcrumbLink href="/convert/doc">Document</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Document Conversion</h1>
                <p className="text-gray-600">Convert between DOCX and PDF formats</p>
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
                title="Document Converter"
                description="Convert between DOCX and PDF formats while preserving formatting."
                conversionOptions={docConversionOptions}
                allowedSourceTypes={['pdf', 'docx']}
              />
            </div>
            
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About Document Conversion</h2>
              <div className="prose max-w-none">
                <p>
                  Our document conversion tool allows you to convert between DOCX (Microsoft Word) and PDF formats.
                  The conversion process maintains your document's formatting, fonts, and layout as much as possible.
                </p>
                <h3>Supported Conversions:</h3>
                <ul>
                  <li><strong>DOCX to PDF</strong> - Convert Word documents to portable PDF files that look the same on any device</li>
                  <li><strong>PDF to DOCX</strong> - Convert PDF files to editable Word documents for easy editing</li>
                </ul>
                <h3>Common Use Cases:</h3>
                <ul>
                  <li>Creating PDF versions of documents for sharing and distribution</li>
                  <li>Converting PDF files to editable formats for content updates</li>
                  <li>Preparing documents for printing or archiving</li>
                  <li>Making documents accessible on devices without Microsoft Office</li>
                </ul>
                <p>
                  <strong>Pro tip:</strong> For DOCX to PDF conversion, make sure all fonts are either standard or embedded 
                  in the document to ensure proper rendering. For PDF to DOCX, conversion works best with text-based PDFs 
                  rather than scanned documents.
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
