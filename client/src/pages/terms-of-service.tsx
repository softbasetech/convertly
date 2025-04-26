
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using our services, you agree to be bound by these Terms of Service.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">2. Description of Service</h2>
          <p>We provide file conversion and QR code generation services with both free and premium features.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Accounts</h2>
          <p>You are responsible for maintaining the security of your account and any activities that occur under your account.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Payment Terms</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Pro subscriptions are billed monthly or annually</li>
            <li>Refunds are handled on a case-by-case basis</li>
            <li>You can cancel your subscription at any time</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">5. Acceptable Use</h2>
          <p>You agree not to misuse our services or help anyone else do so.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">6. Limitation of Liability</h2>
          <p>Our service is provided "as is" without any warranties.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
