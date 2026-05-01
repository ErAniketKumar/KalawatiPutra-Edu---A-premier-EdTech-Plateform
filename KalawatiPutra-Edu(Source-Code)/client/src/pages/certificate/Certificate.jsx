import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DsaQuestionCertificateGenerator from '../../components/certificate/DsaQuestionCertificateGenerator.jsx';
import WorkshopCertificateGenerator from '../../components/certificate/WorkshopCertificateGenerator.jsx';
import CertificateDialog from '../../components/certificate/CertificateDialog.jsx';
import WelcomeCertificateGenerator from '../../components/certificate/WelcomeCertificateGenerator.jsx';

const Certificate = () => {
  // State for tracking solved problems (for DSA)
  const [solvedProblems, setSolvedProblems] = useState(0);
  const totalProblems = 100;

  // State for dialog
  const [dialogConfig, setDialogConfig] = useState({ isOpen: false, cardId: null });
  
  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState(null);

  // Calculate percentage for progress bar width (for DSA)
  const progressPercentage = Math.min((solvedProblems / totalProblems) * 100, 100);

  // Simulate solving new problems (for demo purposes, DSA-specific)
  useEffect(() => {
    let count = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('status-') && localStorage.getItem(key) === 'solved') {
        count++;
      }
    });
    setSolvedProblems(count);
  }, []);

  // Handle dialog open
  const handleOpenDialog = (cardId) => {
    setDialogConfig({ isOpen: true, cardId });
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogConfig({ isOpen: false, cardId: null });
  };
  
  // Toggle FAQ accordion
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Card data for certificates
  const certificateCards = [
    {
      id: 1,
      title: "DSA Question Certificate",
      description: "Earn a certificate by solving 100+ DSA problems on our platform.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      active: true,
      dialogProps: {
        title: "DSA Certificate Generator",
        solvedProblems,
        totalProblems,
        generatorComponent: <DsaQuestionCertificateGenerator />,
      },
    },
    {
      id: 2,
      title: "Welcome Certificate",
      description: "Get a certificate for joining the KalawatiPutra Edu community.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 9.143 15.714 12l2.286 6.857L12 15.714 6.286 18.571l2.286-6.857L3 9.143 8.714 6.286 11 0z" />
        </svg>
      ),
      active: true,
      dialogProps: {
        title: "Welcome Certificate Generator",
        generatorComponent: <WelcomeCertificateGenerator />,
      },
    },
    {
      id: 3,
      title: "Workshop/Event Certificate",
      description: "Receive a certificate for participating in our workshops or events.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      active: true,
      dialogProps: {
        title: "Workshop/Event Certificate Generator",
        generatorComponent: <WorkshopCertificateGenerator />,
      },
    },
    {
      id: 4,
      title: "Courses Certificate",
      description: "Earn a certificate upon completing our premium courses.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      active: false,
      dialogProps: {
        title: "Courses Certificate Generator",
        generatorComponent: null,
      },
    },
  ];

  // FAQ data
  const faqData = [
    {
      q: "How do I qualify for the DSA certificate?",
      a: "You need to solve at least 100 DSA problems on our platform to qualify for the certificate."
    },
    {
      q: "How do I get a workshop certificate?",
      a: "Participate in one of our workshops or events and use the Workshop/Event Certificate Generator to create your certificate."
    },
    {
      q: "Can I share my certificate on LinkedIn?",
      a: "Absolutely! The certificate comes with a shareable link that you can post on LinkedIn, GitHub, or your resume."
    }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen font-['Outfit',sans-serif] relative overflow-hidden">
      <Helmet>
        <title>Certificate | KalawatiPutra Edu</title>
        <meta
          name="description"
          content="Earn a certificate by solving 100+ DSA problems or participating in workshops at KalawatiPutra Edu."
        />
        <meta name="keywords" content="DSA certificate, workshop certificate, KalawatiPutra Edu, coding certificate" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://kalawatiputra.com/certificate" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-emerald-600 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-emerald-700 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9IiMxMDI5MjAiIHN0cm9rZS1vcGFjaXR5PSIuMiIgLz48cGF0aCBkPSJNMCAzMGgzMHYzMEgweiIgc3Ryb2tlPSIjMTAyOTIwIiBzdHJva2Utb3BhY2l0eT0iLjIiIC8+PHBhdGggZD0iTTMwIDBIMHYzMGgzMHoiIHN0cm9rZT0iIzEwMjkyMCIgc3Ryb2tlLW9wYWNpdHk9Ii4yIiAvPjxwYXRoIGQ9Ik0zMCAwaDMwdjMwSDMweiIgc3Ryb2tlPSIjMTAyOTIwIiBzdHJva2Utb3BhY2l0eT0iLjIiIC8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-6xl relative z-10">
        {/* Header Section with animated headline */}
        <div className="text-center mb-20">
          <div className="mb-4">
            <svg className="w-20 h-20 mx-auto text-emerald-500 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L8.5 10L15.5 10L12 15Z" fill="currentColor"/>
              <path d="M20 4L12 4C12 4 12.1254 7.45029 10.0627 9.51303C8 11.5758 4 12 4 12L4 20C4 20 8 19.5758 10.0627 17.513C12.1254 15.4503 12 12 12 12L20 12L20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 tracking-tight leading-tight">
              Achievement Certificates
            </h1>
          </div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed font-light mb-8">
            Showcase your skills and accomplishments with official certificates from KalawatiPutra Edu.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto rounded-full"></div>
        </div>

        {/* DSA Progress Bar - Only visible if user has started solving problems */}
        {solvedProblems > 0 && (
          <div className="max-w-3xl mx-auto mb-16 px-4">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-emerald-300">Your DSA Progress</h3>
                <span className="text-emerald-400 font-semibold">{solvedProblems}/{totalProblems}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-2 italic">
                {solvedProblems >= totalProblems 
                  ? "Congratulations! You've completed enough problems to earn your certificate." 
                  : `Solve ${totalProblems - solvedProblems} more problems to earn your DSA certificate.`}
              </p>
            </div>
          </div>
        )}

        {/* Certificate Cards with better hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {certificateCards.map((card) => (
            <div
              key={card.id}
              className={`relative group bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl overflow-hidden ${
                !card.active ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {/* Card border gradient effect */}
              <div className="absolute -z-10 inset-0 rounded-2xl p-0.5 bg-gradient-to-br from-emerald-500/40 via-transparent to-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Card inner content */}
              <div className="relative z-10 p-8 backdrop-blur-sm h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div
                      className={`p-4 rounded-2xl ${
                        card.active ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gray-700'
                      } shadow-lg`}
                    >
                      <div className="text-emerald-300">{card.icon}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2 text-emerald-300 group-hover:text-emerald-200 transition-colors">{card.title}</h3>
                  <p className="text-gray-400 text-center text-sm font-light mb-6 group-hover:text-gray-300 transition-colors">{card.description}</p>
                </div>
                
                <div className="text-center mt-auto">
                  {card.active ? (
                    <button
                      onClick={() => handleOpenDialog(card.id)}
                      className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-emerald-900/30 transform group-hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 w-full"
                    >
                      Generate Certificate
                    </button>
                  ) : (
                    <div className="text-center">
                      <span className="inline-block bg-gray-800 text-gray-400 px-5 py-2.5 rounded-full text-sm font-medium border border-gray-700">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dialog for Certificates */}
        {dialogConfig.isOpen && (
          <CertificateDialog
            isOpen={dialogConfig.isOpen}
            onClose={handleCloseDialog}
            {...certificateCards.find((card) => card.id === dialogConfig.cardId)?.dialogProps}
          />
        )}

        {/* FAQ Section with accordion */}
        <div className="my-24 relative">
          {/* Section header with underline */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-300 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to know about our certificates and how to earn them</p>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-400 mx-auto mt-6 rounded-full"></div>
          </div>
          
          {/* Accordion */}
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 shadow-lg transition-all duration-300 hover:border-emerald-900/40"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex justify-between items-center"
                >
                  <h3 className="text-lg font-medium text-emerald-200">{faq.q}</h3>
                  <div className={`text-emerald-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-60' : 'max-h-0'}`}
                >
                  <div className="p-6 pt-0 text-gray-300 font-light border-t border-gray-700/30">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials/Showcase Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-300 mb-4">Certificate Showcase</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Join thousands of students who have earned their certificates</p>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-400 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-700/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {/* Sample certificate images/mockups */}
              <div className="relative w-64 h-48 bg-gray-900/70 rounded-lg overflow-hidden border border-emerald-800/30 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-emerald-700/20"></div>
                <div className="relative h-full p-4 flex flex-col justify-center items-center text-center">
                  <div className="text-emerald-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-emerald-300 font-medium">DSA Expert</h4>
                  <p className="text-gray-400 text-sm mt-1">Ravi Kumar S.</p>
                </div>
              </div>
              
              <div className="relative w-64 h-48 bg-gray-900/70 rounded-lg overflow-hidden border border-emerald-800/30 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-emerald-700/20"></div>
                <div className="relative h-full p-4 flex flex-col justify-center items-center text-center">
                  <div className="text-emerald-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-emerald-300 font-medium">React Workshop</h4>
                  <p className="text-gray-400 text-sm mt-1">Priya Sharma</p>
                </div>
              </div>
              
              <div className="relative w-64 h-48 bg-gray-900/70 rounded-lg overflow-hidden border border-emerald-800/30 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-emerald-700/20"></div>
                <div className="relative h-full p-4 flex flex-col justify-center items-center text-center">
                  <div className="text-emerald-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="text-emerald-300 font-medium">Python Mastery</h4>
                  <p className="text-gray-400 text-sm mt-1">Arjun Mehta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
