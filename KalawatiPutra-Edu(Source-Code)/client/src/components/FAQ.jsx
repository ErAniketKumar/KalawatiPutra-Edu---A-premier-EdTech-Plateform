import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is KalawatiPutra Edu about?',
      answer: 'KalawatiPutra Edu is a platform offering tutorials, articles, and courses on programming and technology. It includes community features like mentorship, resume screening, and an AI-powered chatbot for learning support.',
    },
    {
      question: 'How can I contribute content to KalawatiPutra Edu?',
      answer: 'You can sign up and use our content upload feature to share articles, tutorials, or images via Cloudinary. Ensure your content meets our guidelines before submission.',
    },
    {
      question: 'Is there a cost to use KalawatiPutra Edu?',
      answer: 'Basic access to tutorials and articles is free. Premium courses, resume screening services, or other advanced features may require a subscription.',
    },
    {
      question: 'How does the AI chatbot work?',
      answer: 'Our AI-powered chatbot provides instant answers to coding and tech-related questions. It’s integrated into KalawatiPutra Edu for seamless, 24/7 learning support.',
    },
    {
      question: 'Can I access KalawatiPutra Edu on mobile?',
      answer: 'Yes, our website is fully responsive and optimized for both desktop and mobile devices, ensuring a smooth experience on any screen size.',
    },
    {
      question: 'How do I report an issue?',
      answer: 'Contact our support team at support@kalawatiputra.com or use the feedback form available on the platform.',
    },
    {
      question: 'Does KalawatiPutra Edu offer resume screening services?',
      answer: 'Yes, KalawatiPutra Edu provides tools and services to help you build and screen resumes. You can upload your resume for feedback or use our templates to create a professional CV tailored for tech roles.',
    },
    {
      question: 'Do courses on KalawatiPutra Edu offer certifications?',
      answer: 'Many of our premium courses offer certificates upon completion, which you can showcase on your resume or LinkedIn profile. Check course details for certification information.',
    },
    {
      question: 'How can I participate in the KalawatiPutra Edu community?',
      answer: 'Join our mentorship programs, participate in forums, or engage with other learners through our community features. Sign up to connect with mentors and peers.',
    },
    {
      question: 'How do I manage my KalawatiPutra Edu account?',
      answer: 'You can update your profile, change your password, or delete your account through the account settings page. For assistance, contact support@kalawatiputra.com.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-white animate-fade-in">
          Frequently Asked Questions - <span className="text-red-600">KalawatiPutra Edu</span>
        </h1>
        <div className="bg-gray-800 rounded-xl shadow-2xl p-10 transition-all duration-300 hover:shadow-blue-500/20">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border-b border-gray-700">
              <button
                className="w-full text-left py-4 flex justify-between items-center focus:outline-none hover:bg-gray-700 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <h2 className="text-xl font-semibold text-white font-inter">{faq.question}</h2>
                <span className="text-2xl text-[#00bc7d] transition-transform duration-200">
                  {openIndex === index ? '-' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <p className="text-gray-300 pb-4 font-inter transition-all duration-300">{faq.answer}</p>
              )}
            </div>
          ))}
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
        <title>FAQ - KalawatiPutra Edu</title>
        <meta name="description" content="Find answers to common questions about KalawatiPutra Edu, including resume screening, programming tutorials, and course certifications." />
        <meta name="keywords" content="KalawatiPutra Edu, FAQ, resume screening, programming tutorials, online courses, Bihar education" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                ${faqs
                  .map(
                    (faq) => `
                  {
                    "@type": "Question",
                    "name": "${faq.question}",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "${faq.answer}"
                    }
                  }
                `
                  )
                  .join(',')}
              ],
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

export default FAQ;