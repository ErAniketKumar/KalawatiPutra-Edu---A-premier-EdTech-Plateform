import React, { useState } from 'react';
import { submitAdmissionInquiry } from '../../api';
import { Helmet } from 'react-helmet-async';
import CollegeList from '../../components/admission_help_inquery/CollegeList.jsx';
import AdmissionFormDialog from '../../components/admission_help_inquery/AdmissionFormDialog.jsx';
import ConfirmationDialog from '../../components/admission_help_inquery/ConfirmationDialog.jsx';
import DialogBoxAds from '../../components/roadmap/DialogBoxAds.jsx';

const AdmissionHelp = () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [selectedCollegeId, setSelectedCollegeId] = useState(null);
    const [referenceId, setReferenceId] = useState('');
    const youtubeVideoUrlForDialogbox = "https://www.youtube.com/embed/dQw4w9WgXcQ"
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        fatherName: '',
        email: '',
        phone: '',
        address: '',
        courses: '',
    });

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleOpenFormDialog = (collegeId) => {
        setSelectedCollegeId(collegeId);
        setFormDialogOpen(true);
    };

    const handleCloseFormDialog = () => {
        setFormDialogOpen(false);
        setFormData({
            name: '',
            dob: '',
            fatherName: '',
            email: '',
            phone: '',
            address: '',
            courses: '',
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await submitAdmissionInquiry({
                ...formData,
                collegeId: selectedCollegeId,
            });
            setReferenceId(response.data.referenceId);
            setConfirmationDialogOpen(true);
            handleCloseFormDialog();
        } catch (err) {
            console.error('Error submitting application:', err);
            alert('Failed to submit application. Please try again.');
        }
    };

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialogOpen(false);
        setReferenceId('');
    };

    // Structured Data for Organization and WebPage
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "KalawatiPutra Edu",
        url: "https://kalawatiputra.com",
        logo: "https://res.cloudinary.com/dyv8xdud5/image/upload/v1730547995/kalawatiPutra/kalawatiputra-logo.png",
        description:
            "KalawatiPutra Edu provides expert college admission guidance, DSA roadmaps, and career counseling.",
        sameAs: [
            "https://www.linkedin.com/company/kalawatiputra-edu",
            "https://twitter.com/kalawatiputra",
        ],
    };

    const webpageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "College Admission Help",
        url: "https://kalawatiputra.com/admissionhelp",
        description:
            "Get expert college admission guidance at KalawatiPutra Edu. Explore top colleges, apply online, and secure your future with personalized support.",
        publisher: {
            "@type": "Organization",
            name: "KalawatiPutra Edu",
        },
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen py-8 px-4 overflow-x-hidden">
            <Helmet>
                <title>College Admission Help | KalawatiPutra Edu</title>
                <meta
                    name="description"
                    content="Get expert college admission guidance at KalawatiPutra Edu. Explore top colleges, apply online, and secure your future with personalized support."
                />
                <meta
                    name="keywords"
                    content="college admission, admission help, top colleges, apply to college, KalawatiPutra Edu, college application, university admission"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="KalawatiPutra Edu" />
                <link rel="canonical" href="https://kalawatiputra.com/admissionhelp" />
                <meta property="og:title" content="College Admission Help | KalawatiPutra Edu" />
                <meta
                    property="og:description"
                    content="Apply to top colleges with expert guidance from KalawatiPutra Edu. Find courses, compare colleges, and submit your application online."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://kalawatiputra.com/admissionhelp" />
                <meta
                    property="og:image"
                    content="https://res.cloudinary.com/dyv8xdud5/image/upload/v1730547995/kalawatiPutra/admission-help-og.jpg"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="College Admission Help | KalawatiPutra Edu" />
                <meta
                    name="twitter:description"
                    content="Apply to top colleges with expert guidance from KalawatiPutra Edu. Find courses, compare colleges, and submit your application online."
                />
                <meta
                    name="twitter:image"
                    content="https://res.cloudinary.com/dyv8xdud5/image/upload/v1730547995/kalawatiPutra/admission-help-og.jpg"
                />
                <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(webpageSchema)}</script>
            </Helmet>

            <div className="container mx-auto">
                <CollegeList onApplyClick={handleOpenFormDialog} />

                {/* Dialog Box for YouTube Video advertisement */}
                <DialogBoxAds youtubeVideoUrlForDialogbox={youtubeVideoUrlForDialogbox} />

                {/* Admission Form Dialog */}
                <AdmissionFormDialog
                    isOpen={formDialogOpen}
                    onClose={handleCloseFormDialog}
                    onSubmit={handleFormSubmit}
                    formData={formData}
                    setFormData={setFormData}
                />

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                    isOpen={confirmationDialogOpen}
                    onClose={handleCloseConfirmationDialog}
                    referenceId={referenceId}
                />
            </div>

            {/* CSS for animation and custom scrollbar */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fadeIn 1s ease-in;
                    }
                    .line-clamp-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                    .custom-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #4CAF50 #2A2A2A;
                    }
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #2A2A2A;
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: #4CAF50;
                        border-radius: 4px;
                        border: 2px solid #2A2A2A;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background-color: #388E3C;
                    }
                `}
            </style>
        </div>
    );
};

export default AdmissionHelp;