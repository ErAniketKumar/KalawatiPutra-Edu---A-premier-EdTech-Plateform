import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-white animate-fade-in">
          Terms and Conditions - <span className="text-red-600">KalawatiPutra Edu</span>
        </h1>
        <div className="bg-gray-800 rounded-xl shadow-2xl p-10 transition-all duration-300 hover:shadow-blue-500/20">
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              By accessing or using <span className="text-red-600">KalawatiPutra Edu</span>, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our services.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">2. Use of Services</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              <span className="text-red-600">KalawatiPutra Edu</span> provides tutorials, articles, courses, and community features such as mentorship and chatbot support. You agree to use these services for lawful purposes only and not to engage in activities that may harm the platform or its users.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">3. User Content</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              You may upload content, such as articles or images, via our Cloudinary integration. You are solely responsible for ensuring your content complies with applicable laws and does not infringe on third-party rights.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">4. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              All content on <span className="text-red-600">KalawatiPutra Edu</span>, including text, graphics, and code, is owned by us or our licensors and is protected by copyright laws. Unauthorized reproduction or distribution is prohibited.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">5. Google Ads Policy</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              <span className="text-red-600">KalawatiPutra Edu</span> uses Google Ads to display advertisements. We guarantee that only text-based content from our website is used for ad purposes. We do not share user-generated content or personal data with advertisers unless explicitly authorized by you.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">6. Privacy and Data Protection</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              We are committed to protecting your privacy. Any personal information collected through <span className="text-red-600">KalawatiPutra Edu</span> is handled in accordance with our Privacy Policy, accessible on our website.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">7. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              <span className="text-red-600">KalawatiPutra Edu</span> is not liable for any damages arising from your use of our services, including data loss or service interruptions. Use our platform at your own risk.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">8. Termination</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              We reserve the right to suspend or terminate your access to our services at our discretion, particularly if you violate these terms or engage in harmful activities.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">9. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              These Terms and Conditions are governed by the laws of India, with jurisdiction in the state of Bihar, West Champaran. Any legal disputes will be resolved under the courts in West Champaran, Bihar, India.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">10. Dispute Resolution</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              Any disputes arising from these terms will be resolved through negotiation or mediation. If unresolved, disputes may proceed to binding arbitration under the Indian Arbitration and Conciliation Act, 1996.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">11. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              We may update these Terms and Conditions periodically. Continued use of <span className="text-red-600">KalawatiPutra Edu</span> after changes constitutes acceptance of the updated terms.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">12. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              For questions about these terms, contact us at{' '}
              <a href="mailto:support@kalawatiputraedu.com" className="text-blue-400 hover:underline">
                support@kalawatiputra.com
              </a>.
            </p>
          </section>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <head>
        <title>Terms and Conditions - KalawatiPutra Edu</title>
        <meta name="description" content="Read the Terms and Conditions for using KalawatiPutra Edu, a platform offering programming tutorials, articles, and courses in India." />
        <meta name="keywords" content="KalawatiPutra Edu, terms and conditions, programming tutorials, online courses, Bihar education" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Terms and Conditions - KalawatiPutra Edu",
              "description": "Terms and Conditions for using KalawatiPutra Edu, a platform for programming tutorials and courses.",
              "publisher": {
                "@type": "Organization",
                "name": "KalawatiPutra Edu",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://kalawatiputra.com/logo.png"
                }
              }
            }
          `}
        </script>
      </head>
    </div>
  );
};

export default TermsAndConditions;