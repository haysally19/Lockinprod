import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-auto">
                <Logo showText={true} />
              </div>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-slate-600 mb-8">Last updated: January 15, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By accessing or using Lockin AI, you agree to be bound by these Terms of Service and all
              applicable laws and regulations. If you do not agree with any part of these terms, you may
              not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Description of Service</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Lockin AI is an AI-powered academic productivity platform that provides:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>AI tutoring and study assistance</li>
              <li>Essay grading and feedback</li>
              <li>Course organization and management</li>
              <li>Calendar and assignment tracking</li>
              <li>Note-taking and document management</li>
              <li>Study tools and resources</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              We reserve the right to modify, suspend, or discontinue any part of our service at any time
              with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Registration and Security</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Registration Requirements</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              To use Lockin AI, you must:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Be at least 13 years of age</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not share your account with others</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Account Responsibilities</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              You are responsible for all activities that occur under your account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Keep your password secure and confidential</li>
              <li>Update your account information to keep it accurate</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Acceptable Use Policy</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">You agree NOT to:</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Use the service to violate academic integrity policies or cheat on exams</li>
              <li>Submit content that violates copyright or intellectual property rights</li>
              <li>Attempt to reverse engineer or hack our platform</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Resell or redistribute our services without authorization</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Collect user data without consent</li>
              <li>Use the service for any illegal purpose</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Academic Integrity</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Lockin AI is designed to help you learn, not to facilitate academic dishonesty. You are
              responsible for understanding and complying with your institution's academic integrity
              policies. We encourage using our AI tutor as a learning aid, similar to working with a
              human tutor or study group.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Subscription and Payments</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Free and Paid Plans</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              We offer both free and paid subscription plans. Free plan features are subject to usage
              limits. Paid plans provide additional features and higher usage limits.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Billing</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Subscriptions are billed in advance on a monthly or annual basis</li>
              <li>Payment is due at the beginning of each billing cycle</li>
              <li>Prices are subject to change with 30 days notice</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>You can cancel your subscription at any time</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Cancellation</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              You may cancel your subscription at any time through your account settings. Upon cancellation:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>You will retain access until the end of your current billing period</li>
              <li>Your account will automatically downgrade to the free plan</li>
              <li>No refunds will be provided for partial billing periods</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Our Content</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              The Lockin AI platform, including all software, designs, text, graphics, and other content,
              is owned by us and protected by copyright, trademark, and other intellectual property laws.
              You may not copy, modify, distribute, or create derivative works without our permission.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Your Content</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              You retain ownership of all content you upload to Lockin AI. By uploading content, you grant us:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>A license to process, store, and display your content to provide our services</li>
              <li>Permission to use AI models to analyze your content and generate responses</li>
              <li>The right to create anonymized, aggregated data for service improvement</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              You represent that you own or have permission to upload all content you submit. We do not
              claim ownership of your academic work.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">AI-Generated Content</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our AI tutoring features use advanced language models to generate responses. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>AI responses may contain errors or inaccuracies</li>
              <li>AI grading is an estimate and may differ from human grading</li>
              <li>You should verify important information independently</li>
              <li>AI is a learning tool, not a substitute for studying</li>
              <li>We are not responsible for decisions you make based on AI responses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy and Data Protection</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your use of Lockin AI is also governed by our Privacy Policy. By using our service, you
              consent to our collection and use of your data as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Disclaimers and Limitations of Liability</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Service Disclaimer</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              LOCKIN AI IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, OR NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">No Guarantee of Results</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              We do not guarantee that using Lockin AI will improve your grades or academic performance.
              Educational outcomes depend on many factors beyond our control.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Limitation of Liability</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LOCKIN AI SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
              WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
              INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Your use or inability to use the service</li>
              <li>Any unauthorized access to or use of our servers and/or your data</li>
              <li>Any bugs, viruses, or harmful code transmitted through the service</li>
              <li>Any errors or omissions in content or AI responses</li>
              <li>Any conduct or content of third parties on the service</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS,
              OR $100, WHICHEVER IS GREATER.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Indemnification</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You agree to indemnify and hold harmless Lockin AI and its officers, directors, employees,
              and agents from any claims, damages, losses, liabilities, and expenses (including legal fees)
              arising from:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Your violation of these Terms of Service</li>
              <li>Your violation of any rights of another party</li>
              <li>Your use of the service</li>
              <li>Content you upload or submit</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Termination</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may suspend or terminate your account at any time for any reason, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abuse of the service or other users</li>
              <li>Non-payment of fees</li>
              <li>Extended inactivity</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              Upon termination, your right to use the service will immediately cease. We may delete your
              data in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Informal Resolution</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have a dispute with us, please contact us at support@lockinai.online to resolve
              it informally before pursuing legal action.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Arbitration</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Any dispute that cannot be resolved informally shall be resolved through binding arbitration
              in accordance with the rules of the American Arbitration Association. Arbitration will be
              conducted in San Francisco, California.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Class Action Waiver</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              You agree to resolve disputes with us on an individual basis and waive your right to
              participate in class actions or class arbitrations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Governing Law</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws of
              the State of California, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms of Service at any time. We will notify users of
              material changes by email or through a notice on our platform. Your continued use of Lockin AI
              after changes become effective constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Severability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If any provision of these Terms of Service is found to be unenforceable or invalid, that
              provision will be limited or eliminated to the minimum extent necessary, and the remaining
              provisions will remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Entire Agreement</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              These Terms of Service, together with our Privacy Policy, constitute the entire agreement
              between you and Lockin AI regarding the use of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <p className="text-slate-700 mb-2"><strong>Email:</strong> support@lockinai.online</p>
              <p className="text-slate-700 mb-2"><strong>Legal:</strong> legal@lockinai.online</p>
              <p className="text-slate-700 mb-2"><strong>Address:</strong> Lockin AI, Inc.</p>
              <p className="text-slate-700">123 Academic Way, Suite 100, San Francisco, CA 94105</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} Lockin AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
