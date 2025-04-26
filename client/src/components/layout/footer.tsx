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
                <Link href="/convert/pdf">
                  <a className="text-gray-300 hover:text-white">PDF Conversion</a>
                </Link>
              </li>
              <li>
                <Link href="/convert/image">
                  <a className="text-gray-300 hover:text-white">Image Conversion</a>
                </Link>
              </li>
              <li>
                <Link href="/convert/doc">
                  <a className="text-gray-300 hover:text-white">Document Conversion</a>
                </Link>
              </li>
              <li>
                <Link href="/qr-code">
                  <a className="text-gray-300 hover:text-white">QR Code Generator</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white">About</a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="text-gray-300 hover:text-white">Pricing</a>
                </Link>
              </li>
              <li>
                <Link href="/docs">
                  <a className="text-gray-300 hover:text-white">Documentation</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy-policy">
                  <a className="text-gray-300 hover:text-white">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service">
                  <a className="text-gray-300 hover:text-white">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy#cookies">
                  <a className="text-gray-300 hover:text-white">Cookie Policy</a>
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
