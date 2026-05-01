import React from 'react';
import "../../App.css"

const CertificateDialog = ({ isOpen, onClose, title, solvedProblems, totalProblems, generatorComponent }) => {
    if (!isOpen) return null;

    const progressPercentage = solvedProblems && totalProblems ? Math.min((solvedProblems / totalProblems) * 100, 100) : null;

    return (
        <div className="fixed custom-scrollbar inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
            <div className="bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-3xl border border-gray-800 shadow-2xl p-6 md:p-8 w-full max-w-3xl mx-4 transform scale-95 animate-dialog-open">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-emerald-300">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Indicator (only for DSA or similar certificates) */}
                {solvedProblems !== undefined && totalProblems !== undefined && (
                    <div className="mb-10 flex flex-col md:flex-row items-center justify-between">
                        <div className="text-left mb-6 md:mb-0">
                            <h3 className="text-xl font-bold mb-2">Your Progress</h3>
                            <p className="text-gray-400 font-light">
                                {solvedProblems >= totalProblems
                                    ? "Congratulations! You've completed all problems!"
                                    : `Solve ${totalProblems - solvedProblems} more problems to unlock your certificate`}
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 bg-gray-800 rounded-full h-5">
                            <div
                                className="bg-gradient-to-r from-emerald-500 to-green-400 h-5 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                            <div className="text-right text-gray-400 mt-2 font-medium">
                                {solvedProblems}/{totalProblems} problems solved
                                {solvedProblems === totalProblems && (
                                    <span className="ml-2 text-emerald-400">✓</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Certificate Generator */}
                {generatorComponent && (
                    <div className="bg-gray-900 bg-opacity-70 rounded-2x border border-gray-800/40 shadow-lg max-h-[60vh] overflow-y-auto">
                        {/* <h3 className="text-xl font-bold mb-2 flex items-center text-emerald-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Generate Your Certificate
                        </h3> */}
                        <div className="relative w-full max-w-md mx-auto">
                            {generatorComponent}
                        </div>
                    </div>
                )}

                {!generatorComponent && (
                    <p className="text-gray-400 text-center">Certificate generation is not yet available.</p>
                )}
            </div>

            {/* Inline CSS for animation and grid pattern */}
            <style>{`
        @keyframes dialog-open {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-dialog-open {
          animation: dialog-open 0.3s ease-out;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        /* Override WorkshopCertificateGenerator styles to prevent overflow */
        .bg-gradient-to-br {
          min-height: auto !important;
          height: auto !important;
        }
        .min-h-screen {
          min-height: unset !important;
          height: auto !important;
        }
        .absolute.inset-0,
        .absolute.top-1\\/4,
        .absolute.bottom-1\\/4 {
          display: none !important;
        }
      `}</style>
        </div>
    );
};

export default CertificateDialog;
