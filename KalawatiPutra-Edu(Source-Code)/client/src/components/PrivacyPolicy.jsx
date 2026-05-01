import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-white animate-fade-in">
          Privacy Policy - <span className="text-red-600">KalawatiPutra Edu</span>
        </h1>
        <div className="bg-gray-800 rounded-xl shadow-2xl p-10 transition-all duration-300 hover:shadow-blue-500/20">
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              At <span className="text-red-600">KalawatiPutra Edu</span>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information in compliance with the Information Technology Act, 2000, and other applicable laws in India.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">2. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              We may collect the following types of information:
              <ul className="list-disc pl-5 mt-2">
                <li>Personal Information: Name, email address, and other details provided during registration or content uploads.</li>
                <li>Usage Data: Information about how you interact with our platform, such as pages visited and features used.</li>
                <li>Content Data: Articles, images, or other materials you upload via Cloudinary integration.</li>
                <li>Cookies: Small data files stored on your device to enhance user experience and track usage.</li>
              </ul>
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">3. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              We use your information to:
              <ul className="list-disc pl-5 mt-2">
                <li>Provide and improve our services, including tutorials, courses, and chatbot support.</li>
                <li>Personalize your experience on <span className="text-red-600">KalawatiPutra Edu</span>.</li>
                <li>Communicate with you, including responding to inquiries and sending updates.</li>
                <li>Analyze usage trends to enhance platform performance.</li>
              </ul>
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">4. Google Ads and Cookies</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              <span className="text-red-600">KalawatiPutra Edu</span> uses Google Ads to display advertisements. We guarantee that only text-based content from our website is used for ad purposes. Cookies may be used to serve personalized ads, but you can manage cookie preferences through your browser settings or our cookie consent tool.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">5. Data Sharing</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              We do not sell or share your personal information with third parties, except:
              <ul className="list-disc pl-5 mt-2">
                <li>With your explicit consent.</li>
                <li>To comply with legal obligations under Indian law.</li>
                <li>With trusted service providers (e.g., Cloudinary) who assist in operating our platform, bound by confidentiality agreements.</li>
              </ul>
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">6. Data Security</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              We implement reasonable security measures to protect your data, including encryption and secure servers. However, no system is completely secure, and you use our platform at your own risk.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">7. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              You have the right to:
              <ul className="list-disc pl-5 mt-2">
                <li>Access, correct, or delete your personal information.</li>
                <li>Opt out of promotional communications.</li>
                <li>Request information about how your data is used.</li>
              </ul>
              To exercise these rights, contact us at <a href="mailto:support@kalawatiputra.com" className="text-blue-400 hover:underline">support@kalawatiputra.com</a>.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">8. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              We may update this Privacy Policy periodically. Continued use of <span className="text-red-600">KalawatiPutra Edu</span> after changes constitutes acceptance of the updated policy.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">9. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed font-inter">
              For questions about this Privacy Policy, contact us at{' '}
              <a href="mailto:support@kalawatiputra.com" className="text-blue-400 hover:underline">
                support@kalawatiputra.com
              </a>.
            </p>
          </section>
        </div>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <head>
        <title>Privacy Policy - KalawatiPutra Edu</title>
        <meta name="description" content="Learn how KalawatiPutra Edu collects, uses, and protects your personal information in compliance with Indian privacy laws." />
        <meta name="keywords" content="KalawatiPutra Edu, privacy policy, data protection, programming tutorials, Bihar education" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Privacy Policy - KalawatiPutra Edu",
              "description": "Privacy Policy for KalawatiPutra Edu, detailing data collection and protection practices.",
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

export default PrivacyPolicy;