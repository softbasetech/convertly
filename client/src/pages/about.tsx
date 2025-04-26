
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About ConvertHub</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            ConvertHub is your all-in-one solution for file conversion and QR code generation needs.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
          <p className="mb-4">
            We aim to simplify file conversion and QR code generation, making it accessible to everyone 
            through an intuitive and efficient platform.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Fast and reliable file conversion services</li>
            <li>Professional QR code generation tools</li>
            <li>Secure file handling</li>
            <li>User-friendly interface</li>
            <li>Premium features for advanced needs</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Reliable Service</h3>
              <p>High-quality conversions with guaranteed accuracy.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Security First</h3>
              <p>Your files are handled with strict security measures.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
