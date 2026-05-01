import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (token) {
                localStorage.setItem('token', token);
                try {
                    const res = await fetch(`${VITE_API_URL}/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!res.ok) throw new Error('Profile fetch failed');
                    const user = await res.json();
                    toast.success('Google login successful!', {
                        position: 'top-center',
                        autoClose: 2000,
                    });
                    setTimeout(() => {
                        if (user.role === 'admin') {
                            navigate('/admin/manage-articles');
                        } else {
                            navigate('/');
                        }
                    }, 2000);
                } catch (err) {
                    console.error('Callback Error:', err);
                    toast.error('Authentication failed');
                    navigate('/login');
                }
            } else {
                toast.error('No token received');
                navigate('/login');
            }
        };
        handleCallback();
    }, [location, navigate]);

    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
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
                theme="dark"
                toastStyle={{
                    backgroundColor: "#1f2937",
                    color: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #374151",
                    padding: "8px",
                    minHeight: "40px",
                    width: "280px"
                }}
                style={{ width: "320px" }}
            />
            <div>Loading...</div>
        </div>
    );
}