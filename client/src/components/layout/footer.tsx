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
                <Link className="text-gray-300 hover:text-white" href="/convert/pdf">
                  PDF Conversion
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-white" href="/convert/image">
                  Image Conversion
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-white" href="/convert/doc">
                  Document Conversion
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-white" href="/qr-code">
                  QR Code Generator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link className="text-gray-300 hover:text-white" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-white" href="/pricing">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-white" href="/docs">
                  Documentation
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-white" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link className="text-gray-300 hover:text-white" href="/privacy-policy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-white" href="/terms-of-service">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-white" href="/privacy-policy#cookies">
                  Cookie Policy
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
