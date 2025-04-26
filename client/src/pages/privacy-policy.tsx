
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information (name, email, password)</li>
            <li>Usage data and preferences</li>
            <li>Payment information (processed securely through our payment provider)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and maintain our services</li>
            <li>Process your payments and protect against fraudulent transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">3. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. Files are processed securely and automatically deleted after conversion.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
