
import { Link } from "wouter";
import { Edit3, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Edit3 className="h-8 w-8 text-white" />
              <span className="text-xl font-bold">ConvertHub</span>
            </div>
            <p className="mt-4 text-gray-400">Your all-in-one file conversion and QR code generation tool.</p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Features</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/convert/pdf" className="text-gray-300 hover:text-white">
                  PDF Conversion
                </Link>
              </li>
              <li>
                <Link href="/convert/image" className="text-gray-300 hover:text-white">
                  Image Conversion
                </Link>
              </li>
              <li>
                <Link href="/convert/doc" className="text-gray-300 hover:text-white">
                  Document Conversion
                </Link>
              </li>
              <li>
                <Link href="/qr-code" className="text-gray-300 hover:text-white">
                  QR Code Generator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-300 hover:text-white">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center">© {new Date().getFullYear()} ConvertHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
