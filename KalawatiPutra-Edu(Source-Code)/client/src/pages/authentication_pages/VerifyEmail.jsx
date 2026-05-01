import React, { useEffect } from 'react';
import { verifyEmail } from '../../api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            verifyEmail(token)
                .then(response => {
                    localStorage.setItem('token', response.data.token);
                    toast.success(response.data.msg, {
                        position: "top-center",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        icon: false,
                        style: {
                            minHeight: "40px",
                            fontSize: "14px",
                            padding: "8px"
                        }
                    });
                    setTimeout(() => navigate('/'), 4000);
                })
                .catch(err => {
                    toast.error(err.response?.data?.msg || 'Verification failed', {
                        position: "top-center",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        icon: false,
                    });
                });
        } else {
            toast.error('No verification token provided', {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                icon: false,
            });
        }
    }, [searchParams, navigate]);

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center py-10 px-4">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                toastStyle={{
                    backgroundColor: "#F3F4F6",
                    color: "#333333",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    padding: "8px",
                    minHeight: "40px",
                    width: "280px"
                }}
                style={{ width: "320px" }}
            />
            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-100 mb-6">Email Verification</h1>
                    <p className="text-gray-400 text-center">Verifying your email...</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;