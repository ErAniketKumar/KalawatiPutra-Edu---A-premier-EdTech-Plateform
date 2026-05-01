import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

function getCurrentUserId() {
	// Example: userId stored in localStorage
	return localStorage.getItem("userId");
}

// Call this function after successful certificate generation
export function markCertificateGenerated() {
	const userId = getCurrentUserId();
	if (userId) {
		localStorage.setItem(`certificateGenerated_${userId}`, "true");
	}
}

function InfoBar() {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const userId = getCurrentUserId();

		if (token && userId) {
			// For logged-in user, check if certificate is generated
			const certGenerated = localStorage.getItem(
				`certificateGenerated_${userId}`
			);
			if (certGenerated === "true") {
				setIsVisible(false);
				return;
			}
		}

		// For guests or if not generated, check dismissal
		const bannerDismissed = localStorage.getItem("infoBarDismissed");
		if (bannerDismissed === "true") {
			setIsVisible(false);
		} else {
			setIsVisible(true);
		}
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		localStorage.setItem("infoBarDismissed", "true");
	};

	const token = localStorage.getItem("token");
	const userId = getCurrentUserId();

	return isVisible ? (
		<div className="bg-emerald-600 text-white py-2">
			<div className="container mx-auto px-6 flex justify-between items-center">
				<p className="text-sm font-medium font-outfit">
					{token
						? "Welcome to KalawatiPutra Edu! You are eligible to generate your welcome certificate."
						: "Join KalawatiPutra Edu to generate your welcome certificate!"}
				</p>
				<div className="flex items-center space-x-4">
					<Link
						to={token ? "/welcome-certificate" : "/register"}
						className="bg-white text-emerald-600 px-4 py-1 rounded-full text-sm font-medium font-outfit hover:bg-emerald-100 transition-colors duration-200 animate-pulse transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
					>
						{token ? "Generate Now" : "Sign Up"}
					</Link>
					<button
						onClick={handleDismiss}
						className="text-white hover:text-emerald-100 transition-colors duration-200"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	) : null;
}

function Navbar() {
	const isAuthenticated = !!localStorage.getItem("token");
	const navigate = useNavigate();
	const location = useLocation();
	const [isLearnerOpen, setIsLearnerOpen] = useState(false);
	const [isExploreOpen, setIsExploreOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [userImage, setUserImage] = useState(null);
	const [username, setUsername] = useState("");
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isScrolled, setIsScrolled] = useState(false);
	const VITE_API_URL =
		import.meta.env.VITE_API_URL || "http://localhost:5000/api";

	useEffect(() => {
		if (isAuthenticated) {
			const fetchUserData = async () => {
				try {
					setLoading(true);
					const res = await axios.get(`${VITE_API_URL}/auth/profile`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});
					setUserRole(res.data.role);
					setUserImage(res.data.profileImage || null);
					setUsername(res.data.username || "");
				} catch (err) {
					console.error("Error fetching user data:", err);
					if (err.response?.status === 401) {
						localStorage.removeItem("token");
						setUserRole(null);
						setUsername("");
						setUserImage(null);
					}
				} finally {
					setLoading(false);
				}
			};
			fetchUserData();
		} else {
			setLoading(false);
		}

		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isAuthenticated]);

	// Effect to handle smooth scrolling when hash changes
	useEffect(() => {
		if (location.hash) {
			// Wait for DOM to be ready
			setTimeout(() => {
				const element = document.getElementById(location.hash.substring(1));
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
		} else {
			// Scroll to top when navigating to a new page without hash
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [location]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setUserRole(null);
		setUserImage(null);
		setUsername("");
		navigate("/login");
		setIsMobileMenuOpen(false);
		setIsUserDropdownOpen(false);
	};

	// Smooth scroll handler for navigation links
	const handleNavLinkClick = (e, targetId) => {
		if (targetId) {
			e.preventDefault();
			const element = document.getElementById(targetId);
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
				// Update URL without page refresh
				window.history.pushState(null, null, `#${targetId}`);
			}
		}
		setIsMobileMenuOpen(false);
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<InfoBar />
			<nav className="sticky top-0 z-50 font-dmsans transition-all duration-300 bg-gradient-to-b from-gray-950 to-gray-900 pt-4">
				<div
					className={`mx-auto px-6 py-3 flex justify-between items-center w-[90%] rounded-md ${isScrolled
						? "bg-transparent backdrop-blur-md shadow-md"
						: "bg-transparent backdrop-blur-md shadow-none"
						}`}
				>
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2">
						<img
							src="/Images/logo.png"
							alt="Logo"
							className="w-10 h-auto object-contain"
						/>
					</Link>
					{/* Mobile Menu Button */}
					<button
						className="lg:hidden p-2 rounded-md hover:bg-[#7C7C6F]/20 transition-colors duration-200 focus:outline-none"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						<svg
							className="w-5 h-5 text-[#7C7C6F]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d={
									isMobileMenuOpen
										? "M6 18L18 6M6 6l12 12"
										: "M4 6h16M4 12h16m-7 6h7"
								}
							/>
						</svg>
					</button>

					{/* Desktop Menu */}
					<div className="hidden lg:flex items-center space-x-1">
						<SmoothNavLink to="/">Home</SmoothNavLink>
						<SmoothNavLink to="/blogs-articles">Blogs & Articles</SmoothNavLink>
						<SmoothNavLink to="/courses">Courses</SmoothNavLink>
						<SmoothNavLink to="/contact">Contact Us</SmoothNavLink>

						{isAuthenticated && (
							<>
								<SmoothNavLink to="/resume-interview-prep">
									Resume Screening
								</SmoothNavLink>

								{/* Learner Dropdown */}
								<div
									className="relative"
									onMouseEnter={() => setIsLearnerOpen(true)}
									onMouseLeave={() => setIsLearnerOpen(false)}
								>
									<button className="flex items-center px-3 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200">
										Learner
										<svg
											className={`w-4 h-4 ml-1 transition-transform duration-200 ${isLearnerOpen ? "rotate-180" : ""
												}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>

									{isLearnerOpen && (
										<div className="text-white absolute left-0 top-full bg-gray-900 backdrop-blur-md rounded-md min-w-[180px] z-50 shadow-lg border border-[#7C7C6F]/20">
											<SmoothDropdownLink
												to="/roadmap"
												onClick={() => setIsLearnerOpen(false)}
											>
												Roadmap
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/dsapractice"
												onClick={() => setIsLearnerOpen(false)}
											>
												DSA Practice
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/admissionhelp"
												onClick={() => setIsLearnerOpen(false)}
											>
												Admission Help
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/counseling"
												onClick={() => setIsLearnerOpen(false)}
											>
												Counseling
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/internship"
												onClick={() => setIsLearnerOpen(false)}
											>
												Internship
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/mentorship"
												onClick={() => setIsLearnerOpen(false)}
											>
												Mentorship
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/certificate"
												onClick={() => setIsLearnerOpen(false)}
											>
												Certificate
											</SmoothDropdownLink>
										</div>
									)}
								</div>

								{/* Explore Dropdown */}
								<div
									className="relative"
									onMouseEnter={() => setIsExploreOpen(true)}
									onMouseLeave={() => setIsExploreOpen(false)}
								>
									<button className="flex items-center px-3 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200">
										Explore
										<svg
											className={`w-4 h-4 ml-1 transition-transform duration-200 ${isExploreOpen ? "rotate-180" : ""
												}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>

									{isExploreOpen && (
										<div className="absolute left-0 top-full bg-gray-900 backdrop-blur-md rounded-md min-w-[180px] z-50 shadow-lg border border-[#7C7C6F]/20">
											{/* <SmoothDropdownLink
												to="/create-course"
												onClick={() => setIsExploreOpen(false)}
											>
												Create Course
											</SmoothDropdownLink> */}
											<SmoothDropdownLink
												to="/create-article"
												onClick={() => setIsExploreOpen(false)}
											>
												Create Article
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/services"
												onClick={() => setIsExploreOpen(false)}
											>
												Services
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/store"
												onClick={() => setIsExploreOpen(false)}
											>
												Store
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/notice-page"
												onClick={() => setIsExploreOpen(false)}
											>
												Notice Board
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/labs"
												onClick={() => setIsExploreOpen(false)}
											>
												Labs
											</SmoothDropdownLink>
										</div>
									)}
								</div>

								{userRole === "admin" && (
									<SmoothNavLink to="/admin/dashboard">
										Admin Dashboard
									</SmoothNavLink>
								)}
								{/* User Dropdown */}
								<div
									className="relative"
									onMouseEnter={() => setIsUserDropdownOpen(true)}
									onMouseLeave={() => setIsUserDropdownOpen(false)}
								>
									<button className="flex items-center rounded-full focus:outline-none ml-2">
										{userImage ? (
											<img
												src={userImage}
												alt="User"
												className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
											/>
										) : (
											<div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
												{username ? username.charAt(0).toUpperCase() : "?"}
											</div>
										)}
									</button>
									{isUserDropdownOpen && (
										<div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 bg-gray-900 backdrop-blur-md rounded-md min-w-[180px] z-50 shadow-lg border border-[#7C7C6F]/20">
											<SmoothDropdownLink
												to="/profile"
												onClick={() => setIsUserDropdownOpen(false)}
											>
												Your Profile
											</SmoothDropdownLink>
											<SmoothDropdownLink
												to="/dashboard"
												onClick={() => setIsUserDropdownOpen(false)}
											>
												Dashboard
											</SmoothDropdownLink>

											<SmoothDropdownLink
												to="/report-problem"
												onClick={() => setIsUserDropdownOpen(false)}
											>
												Report Problem
											</SmoothDropdownLink>
											<button
												onClick={handleLogout}
												className="w-full text-left px-4 py-2 text-sm text-[#7C7C6F] hover:bg-[#7C7C6F]/20 hover:text-[white] transition-colors duration-200"
											>
												Logout
											</button>
										</div>
									)}
								</div>
							</>
						)}

						{!isAuthenticated && (
							<>
								<SmoothNavLink to="/services">Services</SmoothNavLink>
								<SmoothNavLink to="/login">Login</SmoothNavLink>
								<button
									onClick={() =>
										navigate("/register", { state: { smoothScroll: true } })
									}
									className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md transition-colors duration-200 ml-2"
								>
									Register
								</button>
							</>
						)}
					</div>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="lg:hidden bg-gray-900 backdrop-blur-md border-t border-[#7C7C6F]/20 animate-fadeIn w-[90%] mx-auto">
						<div className="px-4 py-2 space-y-1">
							<SmoothMobileNavLink
								to="/"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Home
							</SmoothMobileNavLink>
							<SmoothMobileNavLink
								to="/blogs-articles"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Blogs & Articles
							</SmoothMobileNavLink>
							<SmoothMobileNavLink
								to="/courses"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Courses
							</SmoothMobileNavLink>
							<SmoothMobileNavLink
								to="/services"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Services
							</SmoothMobileNavLink>
							<SmoothMobileNavLink
								to="/contact"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Contact Us
							</SmoothMobileNavLink>

							{isAuthenticated && (
								<>
									<SmoothMobileNavLink
										to="/resume-interview-prep"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Resume Screening
									</SmoothMobileNavLink>

									{/* Mobile Learner Dropdown */}
									<div className="py-1 text-white">
										<button
											className="flex w-full items-center py-2 text-sm font-medium text-white"
											onClick={() => setIsLearnerOpen(!isLearnerOpen)}
										>
											Learner
											<svg
												className={`w-4 h-4 ml-1 transition-transform duration-200 ${isLearnerOpen ? "rotate-180" : ""
													}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>

										{isLearnerOpen && (
											<div className="pl-4 mt-1 space-y-1">
												<SmoothMobileNavLink
													to="/roadmap"
													onClick={() => {
														setIsLearnerOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Roadmap
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/dsapractice"
													onClick={() => {
														setIsLearnerOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													DSA Practice
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/admissionhelp"
													onClick={() => {
														setIsLearnerOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Admission Help
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/counseling"
													onClick={() => {
														setIsLearnerOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Counseling
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/internship"
													onClick={() => {
														setIsLearnerOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Internship
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/mentorship"
													onClick={() => {
														setIsLearnerOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Mentorship
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/certificate"
													onClick={() => {
														setIsLearnerOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Certificate
												</SmoothMobileNavLink>
											</div>
										)}
									</div>

									{/* Mobile Explore Dropdown */}
									<div className="py-1">
										<button
											className="flex w-full items-center py-2 text-sm font-medium text-white"
											onClick={() => setIsExploreOpen(!isExploreOpen)}
										>
											Explore
											<svg
												className={`w-4 h-4 ml-1 transition-transform duration-200 ${isExploreOpen ? "rotate-180" : ""
													}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>

										{isExploreOpen && (
											<div className="pl-4 mt-1 space-y-1">
												<SmoothMobileNavLink
													to="/create-course"
													onClick={() => {
														setIsExploreOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Create Course
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/create-article"
													onClick={() => {
														setIsExploreOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Create Article
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/services"
													onClick={() => {
														setIsExploreOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Services
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/store"
													onClick={() => {
														setIsExploreOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Store
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/notice-page"
													onClick={() => {
														setIsExploreOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Notice Board
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/labs"
													onClick={() => {
														setIsExploreOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Labs
												</SmoothMobileNavLink>
											</div>
										)}
									</div>

									{userRole === "admin" && (
										<SmoothMobileNavLink
											to="/admin/dashboard"
											onClick={() => setIsMobileMenuOpen(false)}
										>
											Admin Dashboard
										</SmoothMobileNavLink>
									)}

									{/* Mobile User Dropdown */}
									<div className="py-1">
										<button
											className="flex items-center py-2 text-sm font-medium text-white"
											onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
										>
											{userImage ? (
												<img
													src={userImage}
													alt="User"
													className="w-6 h-6 rounded-full object-cover mr-2"
												/>
											) : (
												<div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium mr-2">
													{username ? username.charAt(0).toUpperCase() : "?"}
												</div>
											)}
											Account
											<svg
												className={`w-4 h-4 ml-1 transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""
													}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
										{isUserDropdownOpen && (
											<div className="pl-4 mt-1 space-y-1">
												<SmoothMobileNavLink
													to="/profile"
													onClick={() => {
														setIsUserDropdownOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Your Profile
												</SmoothMobileNavLink>
												<SmoothMobileNavLink
													to="/dashboard"
													onClick={() => {
														setIsUserDropdownOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													Dashboard
												</SmoothMobileNavLink>
												<button
													onClick={handleLogout}
													className="w-full text-left py-2 text-sm font-medium text-white hover:text-emerald-300 transition-colors duration-200"
												>
													Logout
												</button>
											</div>
										)}
									</div>
								</>
							)}

							{!isAuthenticated && (
								<div className="flex flex-col space-y-2 mt-2">
									<SmoothMobileNavLink
										to="/login"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Login
									</SmoothMobileNavLink>
									<button
										onClick={() => {
											navigate("/register", { state: { smoothScroll: true } });
											setIsMobileMenuOpen(false);
										}}
										className="py-2 px-3 text-sm font-medium text-white bg-emerald-500 rounded-md transition-colors duration-200"
									>
										Register
									</button>
								</div>
							)}
						</div>
					</div>
				)}
			</nav>
		</>
	);
}

// Helper Components for smooth scrolling navigation
const SmoothNavLink = ({ to, children }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const handleClick = (e) => {
		e.preventDefault();

		// Check if it's an anchor link
		const isAnchorLink = to.includes("#");

		if (isAnchorLink) {
			const targetId = to.split("#")[1];
			const element = document.getElementById(targetId);

			if (element) {
				// If on same page, smooth scroll
				element.scrollIntoView({ behavior: "smooth" });
				// Update URL without reloading
				window.history.pushState(null, null, to);
			} else {
				// Navigate to page first, then scroll to anchor
				navigate(to, { state: { scrollToId: targetId } });
			}
		} else {
			// Regular page navigation with smooth scroll to top
			navigate(to, { state: { smoothScroll: true } });
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<Link
			to={to}
			className="px-3 py-2 text-sm font-medium text-white hover:text-emerald-300 transition-colors duration-200"
			onClick={handleClick}
		>
			{children}
		</Link>
	);
};

const SmoothDropdownLink = ({ to, onClick, children }) => {
	const navigate = useNavigate();

	const handleClick = (e) => {
		e.preventDefault();

		// Handle dropdown close callback
		if (onClick) onClick();

		// Check if it's an anchor link
		const isAnchorLink = to.includes("#");

		if (isAnchorLink) {
			const targetId = to.split("#")[1];
			const element = document.getElementById(targetId);

			if (element) {
				// If on same page, smooth scroll
				element.scrollIntoView({ behavior: "smooth" });
				// Update URL without reloading
				window.history.pushState(null, null, to);
			} else {
				// Navigate to page first, then scroll to anchor
				navigate(to, { state: { scrollToId: targetId } });
			}
		} else {
			// Regular page navigation with smooth scroll to top
			navigate(to, { state: { smoothScroll: true } });
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<Link
			to={to}
			className="block px-4 py-2 text-sm text-[#7C7C6F] hover:bg-[#7C7C6F]/20 hover:text-[white] transition-colors duration-200"
			onClick={handleClick}
		>
			{children}
		</Link>
	);
};

const SmoothMobileNavLink = ({ to, onClick, children }) => {
	const navigate = useNavigate();

	const handleClick = (e) => {
		e.preventDefault();

		// Handle mobile menu close callback
		if (onClick) onClick();

		// Check if it's an anchor link
		const isAnchorLink = to.includes("#");

		if (isAnchorLink) {
			const targetId = to.split("#")[1];
			const element = document.getElementById(targetId);

			if (element) {
				// If on same page, smooth scroll
				element.scrollIntoView({ behavior: "smooth" });
				// Update URL without reloading
				window.history.pushState(null, null, to);
			} else {
				// Navigate to page first, then scroll to anchor
				navigate(to, { state: { scrollToId: targetId } });
			}
		} else {
			// Regular page navigation with smooth scroll to top
			navigate(to, { state: { smoothScroll: true } });
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<Link
			to={to}
			className="block py-2 text-sm font-medium text-[white] hover:text-emerald-300 transition-colors duration-200"
			onClick={handleClick}
		>
			{children}
		</Link>
	);
};

export default Navbar;
