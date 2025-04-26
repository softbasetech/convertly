import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Check, FileText, Image, RefreshCw, QrCode, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                  All-in-one conversion tools for your workflow
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-600">
                  Convert files between formats, generate QR codes, and more. All in one intuitive platform.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/convert">
                    <Button size="lg" className="px-6 py-6 text-base">Get Started Free</Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="px-6 py-6 text-base">View Pricing</Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm text-gray-600">No credit card required</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm text-gray-600">5 free conversions daily</span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1470&auto=format&fit=crop" 
                    alt="File conversion dashboard preview" 
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary rounded-lg shadow-lg flex items-center justify-center">
                  <RefreshCw className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Powerful Conversion Tools</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Transform your files with just a few clicks. Our platform offers a variety of conversion options to suit your needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* PDF Conversion Card */}
              <Card className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">PDF Conversion</h3>
                  <p className="mt-2 text-gray-600">Convert documents to and from PDF format. Supports DOCX, XLSX, and images.</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-success mr-2" />
                      PDF ⇄ DOCX conversion
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-success mr-2" />
                      Image ⇄ PDF conversion
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-success mr-2" />
                      Maintain formatting and quality
                    </li>
                  </ul>
                  <Link href="/convert/pdf">
                    <a className="mt-6 inline-flex items-center text-primary font-medium group-hover:underline">
                      Convert PDF files
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </Link>
                </CardContent>
              </Card>

              {/* Image Conversion Card */}
              <Card className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                    <Image className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Image Conversion</h3>
                  <p className="mt-2 text-gray-600">Convert images between formats. Supports PNG, JPG, WEBP, and more.</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-success mr-2" />
                      PNG ⇄ JPG ⇄ WEBP conversion
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-success mr-2" />
                      Resize and compress
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-success mr-2" />
                      Batch conversion available
                    </li>
                  </ul>
                  <Link href="/convert/image">
                    <a className="mt-6 inline-flex items-center text-primary font-medium group-hover:underline">
                      Convert image files
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </Link>
                </CardContent>
              </Card>

              {/* QR Code Card */}
              <Card className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">QR Code Generator</h3>
                  <p className="mt-2 text-gray-600">Generate QR codes for URLs, text, or contact information.</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-success mr-2" />
                      URL, text, email QR codes
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-success mr-2" />
                      Download as PNG or SVG
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-success mr-2" />
                      Save QR codes to dashboard
                    </li>
                  </ul>
                  <Link href="/qr-code">
                    <a className="mt-6 inline-flex items-center text-primary font-medium group-hover:underline">
                      Generate QR codes
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Choose the plan that works for you. Start with our free tier and upgrade when you need more.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900">Free</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">$0</span>
                    <span className="ml-1 text-gray-500">/month</span>
                  </div>
                  <p className="mt-5 text-gray-600">Perfect for occasional use and small projects.</p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                      <span className="text-gray-600">5 conversions per day</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                      <span className="text-gray-600">10MB file size limit</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                      <span className="text-gray-600">Standard conversion quality</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                      <span className="text-gray-600">Basic QR code generation</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-500">No API access</span>
                    </li>
                  </ul>
                  <Link href="/auth">
                    <Button variant="outline" className="mt-8 w-full py-3">Sign Up Free</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Pro Plan Card */}
              <Card className="border-primary-100 shadow-md relative">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full">POPULAR</span>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">$9.99</span>
                    <span className="ml-1 text-gray-500">/month</span>
                  </div>
                  <p className="mt-5 text-gray-600">For professionals and teams with higher needs.</p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                      <span className="text-gray-600"><strong>Unlimited</strong> conversions</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                      <span className="text-gray-600"><strong>100MB</strong> file size limit</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                      <span className="text-gray-600"><strong>Priority</strong> conversion quality</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                      <span className="text-gray-600"><strong>Advanced</strong> QR code customization</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                      <span className="text-gray-600"><strong>Full</strong> API access</span>
                    </li>
                  </ul>
                  <Link href="/auth">
                    <Button className="mt-8 w-full py-3">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">"ConvertHub has been a game changer for our team. The API access allows us to automate our document workflows and save hours each week."</p>
                  <div className="flex items-center">
                    <div className="font-medium text-gray-900">Sarah T.</div>
                    <span className="mx-2 text-gray-500">•</span>
                    <div className="text-gray-500">Marketing Director</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">"The QR code generator is so easy to use and the codes scan perfectly every time. I use it for all my restaurant menus and promotional materials."</p>
                  <div className="flex items-center">
                    <div className="font-medium text-gray-900">Michael R.</div>
                    <span className="mx-2 text-gray-500">•</span>
                    <div className="text-gray-500">Restaurant Owner</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">"I needed to convert a bunch of PDFs to Word docs for editing, and this tool made it so simple. The quality of the conversion was excellent too!"</p>
                  <div className="flex items-center">
                    <div className="font-medium text-gray-900">Jessica L.</div>
                    <span className="mx-2 text-gray-500">•</span>
                    <div className="text-gray-500">Legal Assistant</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900">Ready to streamline your workflow?</h2>
              <p className="mt-4 text-lg text-gray-600">Join thousands of users who trust ConvertHub for their conversion needs.</p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth">
                  <Button size="lg" className="px-8 py-6">Create Free Account</Button>
                </Link>
                <Link href="/convert">
                  <Button size="lg" variant="outline" className="px-8 py-6">Try a Conversion</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
