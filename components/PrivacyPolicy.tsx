import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';

const PrivacyPolicy: React.FC = () => {
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
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: January 15, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Welcome to Lockin AI. We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you use our
              AI-powered academic productivity platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Personal Information</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              When you create an account, we collect:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Email address</li>
              <li>Name</li>
              <li>Password (encrypted)</li>
              <li>Phone number (optional)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Academic Content</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              To provide our AI tutoring services, we collect and process:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Course syllabi and documents you upload</li>
              <li>Notes and study materials</li>
              <li>Essays and assignments for grading</li>
              <li>Chat conversations with our AI tutor</li>
              <li>Calendar events and assignment deadlines</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Usage Data</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              We automatically collect certain information about how you use our service:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Pages visited and features used</li>
              <li>Time spent on the platform</li>
              <li>Error logs and performance data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Provide AI tutoring, essay grading, and study assistance tailored to your courses</li>
              <li>Maintain and improve our service quality</li>
              <li>Send important updates about your account and service changes</li>
              <li>Process payments and manage subscriptions</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">AI and Data Processing</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use Google's Gemini AI to power our tutoring features. When you interact with our AI:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Your questions and course materials are processed by Gemini AI to generate responses</li>
              <li>Conversations are stored to maintain context and improve your experience</li>
              <li>We do not use your academic content to train third-party AI models</li>
              <li>Your data is processed in accordance with Google's data processing terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sharing and Disclosure</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li><strong>Service Providers:</strong> Companies that help us operate our platform (hosting, payment processing, analytics)</li>
              <li><strong>AI Service Providers:</strong> Google Gemini for AI processing as described above</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and password hashing</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and monitoring</li>
              <li>Secure cloud infrastructure with Supabase</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights and Choices</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to certain data processing activities</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              To exercise these rights, contact us at privacy@lockinai.online
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We retain your data for as long as your account is active or as needed to provide services.
              When you delete your account, we will delete or anonymize your personal data within 30 days,
              except where we must retain data for legal compliance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our service is intended for students aged 13 and older. We do not knowingly collect
              personal information from children under 13. If you believe we have collected information
              from a child under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">International Data Transfers</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your data may be processed in countries other than your own. We ensure appropriate
              safeguards are in place to protect your data in accordance with this privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies and Tracking</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze site traffic and usage</li>
              <li>Improve platform functionality</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may update this privacy policy from time to time. We will notify you of significant
              changes by email or through a notice on our platform. Your continued use of Lockin AI
              after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <p className="text-slate-700 mb-2"><strong>Email:</strong> privacy@lockinai.online</p>
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

export default PrivacyPolicy;
