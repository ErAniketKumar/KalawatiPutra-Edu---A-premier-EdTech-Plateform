import React from 'react';

const ConfirmationDialog = ({ isOpen, onClose, referenceId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#4CAF50] transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[#4CAF50]">Application Submitted</h2>
                <p className="text-gray-200 mb-4">
                    Your application has been submitted successfully. Our team will contact you soon.
                </p>
                <p className="text-gray-200 mb-4">
                    <strong>Reference ID: {referenceId}</strong>
                </p>
                <p className="text-gray-400 mb-6">
                    Please save this reference ID for future assistance.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-semibold py-3 rounded-lg transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ConfirmationDialog;