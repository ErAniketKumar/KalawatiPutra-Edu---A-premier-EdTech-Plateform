import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

	const handleSubscribe = async (e) => {
		e.preventDefault();
		setMessage("");
		setError("");

		try {
			const response = await axios.post(`${VITE_API_URL}/subscribe`, {
				email,
			});
			setMessage(response.data.message);
			setEmail("");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to subscribe");
		}
	};

	return (
		<footer className="bg-gray-900 text-white py-16 w-full">
			{/* Main Footer Content */}
			<div className="container mx-auto px-6 max-w-7xl">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
					{/* Brand Section */}
					<div className="flex flex-col space-y-4">
						<Link
							to="/"
							className="inline-block"
						>
							<img
								src="/Images/logo.png"
								alt="KalawatiPutra Logo"
								className="w-36 h-auto object-contain"
							/>
						</Link>
						<p className="text-gray-400 text-sm leading-relaxed mt-2">
							Empowering lifelong learners with cutting-edge courses and
							resources that transform knowledge into impact.
						</p>
					</div>

					{/* Navigation Links */}
					<div className="flex flex-col space-y-4">
						<h4 className="text-lg font-bold text-white">Quick Links</h4>
						<ul className="space-y-3 text-gray-400">
							<li>
								<Link to="/" className="hover:text-emerald-400 transition-colors duration-300 flex items-center">
									<span className="bg-emerald-500/10 w-1.5 h-1.5 rounded-full mr-2"></span>
									Home
								</Link>
							</li>
							<li>
								<Link to="/courses" className="hover:text-emerald-400 transition-colors duration-300 flex items-center">
									<span className="bg-emerald-500/10 w-1.5 h-1.5 rounded-full mr-2"></span>
									Courses
								</Link>
							</li>
							<li>
								<Link to="/blogs-articles" className="hover:text-emerald-400 transition-colors duration-300 flex items-center">
									<span className="bg-emerald-500/10 w-1.5 h-1.5 rounded-full mr-2"></span>
									Articles
								</Link>
							</li>
							<li>
								<Link to="/services" className="hover:text-emerald-400 transition-colors duration-300 flex items-center">
									<span className="bg-emerald-500/10 w-1.5 h-1.5 rounded-full mr-2"></span>
									Services
								</Link>
							</li>
							<li>
								<Link to="/faq" className="hover:text-emerald-400 transition-colors duration-300 flex items-center">
									<span className="bg-emerald-500/10 w-1.5 h-1.5 rounded-full mr-2"></span>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter Signup */}
					<div className="flex flex-col space-y-4">
						<h4 className="text-lg font-bold text-white">Stay Connected</h4>
						<p className="text-gray-400 text-sm">
							Subscribe to our newsletter for exclusive updates and insights.
						</p>
						<div className="mt-2">
							<div className="flex flex-col space-y-2">
								<input
									type="email"
									placeholder="Your email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
								/>
								<button
									onClick={handleSubscribe}
									className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-colors duration-300 font-medium text-sm"
								>
									Subscribe Now
								</button>
							</div>
							{message && <p className="text-emerald-400 mt-2 text-xs">{message}</p>}
							{error && <p className="text-red-400 mt-2 text-xs">{error}</p>}
						</div>
					</div>

					{/* Social Media & Contact */}
					<div className="flex flex-col space-y-4">
						<h4 className="text-lg font-bold text-white">Get In Touch</h4>
						<p className="text-gray-400 text-sm">
							Follow us on social media and stay updated with our latest news.
						</p>
						<div className="flex space-x-4 mt-2">
							<a
								href="https://facebook.com/kalawati.putra"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-gray-800 p-2 rounded-full transition-colors duration-300"
							>
								<FaFacebook className="text-gray-400 hover:text-emerald-400 text-lg" />
							</a>
							<a
								href="https://x.com/kalawatiputra"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-gray-800 p-2 rounded-full transition-colors duration-300"
							>
								<FaTwitter className="text-gray-400 hover:text-emerald-400 text-lg" />
							</a>
							<a
								href="https://instagram.com/kalawati.putra"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-gray-800 p-2 rounded-full transition-colors duration-300"
							>
								<FaInstagram className="text-gray-400 hover:text-emerald-400 text-lg" />
							</a>
							<a
								href="https://www.linkedin.com/company/kalawatiputraedu"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-gray-800 p-2 rounded-full transition-colors duration-300"
							>
								<FaLinkedin className="text-gray-400 hover:text-emerald-400 text-lg" />
							</a>
						</div>
						<p className="text-gray-400 text-sm pt-2">
							Email:{" "}
							<a
								href="mailto:contact@kalawatiputra.com"
								className="hover:text-emerald-400 transition-colors duration-300"
							>
								contact@kalawatiputra.com
							</a>
						</p>
					</div>
				</div>

				{/* Divider */}
				<div className="border-t border-gray-700 my-8"></div>

				{/* Copyright */}
				<div className="flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-400 text-sm">
						© {new Date().getFullYear()} KalawatiPutra Edu. All rights reserved.
					</p>
					<div className="mt-4 md:mt-0">
						<ul className="flex space-x-6 text-xs text-gray-400">
							<li>
								<Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors duration-300">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link to="/terms-and-conditions" className="hover:text-emerald-400 transition-colors duration-300">
									Terms and Conditions
								</Link>
							</li>
							{/* <li>
								<Link to="/sitemap" className="hover:text-emerald-400 transition-colors duration-300">
									Sitemap
								</Link>
							</li> */}
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
