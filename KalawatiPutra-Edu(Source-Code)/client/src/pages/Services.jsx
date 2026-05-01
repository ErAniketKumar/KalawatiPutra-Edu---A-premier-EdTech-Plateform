import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Sparkles,
	ArrowRight,
	Play,
	ChevronDown,
	Send,
	MapPin,
	Phone,
	Mail,
	ExternalLink,
} from "lucide-react";
import { Toaster, toast } from "sonner"; // Import Sonner components

const Services = () => {
	const [category, setCategory] = useState("All");

	const [isVisible, setIsVisible] = useState({});

	// Services array with categories
	const services = [
		{
			title: "Startup Growth",
			path: "",
			description:
				"We empower startups with mentorship, marketing strategies, and resources to scale rapidly.",
			category: "Business",
			icon: "rocket",
		},
		{
			title: "Website & App Development",
			path: "",
			description:
				"We craft custom websites and mobile applications tailored to your business needs.",
			category: "Technology",
			icon: "code",
		},
		{
			title: "Admission Help",
			path: "/admissionhelp",
			description:
				"Find your perfect college with our search tools and expert guidance for admissions.",
			category: "Education",
			icon: "school",
		},
		{
			title: "Resume & Interview Prep",
			path: "/resume-interview-prep",
			description:
				"Build standout resumes and ace interviews with our personalized coaching.",
			category: "Career",
			icon: "file",
		},
		{
			title: "Online Courses",
			path: "/courses",
			description:
				"Learn in-demand skills with our engaging online courses designed for real-world impact.",
			category: "Education",
			icon: "book",
		},
		{
			title: "AI Chatbot",
			path: "",
			description:
				"Get instant answers and personalized support with our AI-powered chatbot available 24/7.",
			category: "Technology",
			icon: "message-circle",
		},
	];
	// Filter services based on selected category
	const filteredServices =
		category === "All"
			? services
			: services.filter((service) => service.category === category);

	// Categories for filter
	const categories = ["All", "Business", "Technology", "Education", "Career"];



	const showUnderDevelopmentToast = () => {
		toast.info(
			"This feature is currently in development and will be available soon. Stay tuned!",
			{
				position: "top-right",
				duration: 3000,
				className: "shadow-lg",
			}
		);
	};

	// Intersection Observer for animations
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible((prev) => ({
							...prev,
							[entry.target.id]: true,
						}));
					}
				});
			},
			{ threshold: 0.1 }
		);

		const sections = document.querySelectorAll(".animate-section");
		sections.forEach((section) => {
			observer.observe(section);
		});

		return () => {
			sections.forEach((section) => {
				observer.unobserve(section);
			});
		};
	}, []);

	// Get icon component based on name
	const getIcon = (iconName) => {
		const iconMap = {
			rocket: (
				<svg
					className="w-8 h-8"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
			),
			code: (
				<svg
					className="w-8 h-8"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			),
			school: (
				<svg
					className="w-8 h-8"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			),
			file: (
				<svg
					className="w-8 h-8"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			),
			book: (
				<svg
					className="w-8 h-8"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
			),
			"message-circle": (
				<svg
					className="w-8 h-8"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
					/>
				</svg>
			),
		};

		return iconMap[iconName] || null;
	};

	return (
		<div className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 min-h-screen overflow-hidden">
			{/* Add Toaster component for Sonner */}
			<Toaster richColors />

			{/* Background elements */}
			<div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

			{/* Floating particles */}
			{[...Array(30)].map((_, i) => (
				<div
					key={i}
					className="particle absolute rounded-full"
					style={{
						top: `${Math.random() * 100}%`,
						left: `${Math.random() * 100}%`,
						width: `${Math.random() * 6 + 2}px`,
						height: `${Math.random() * 6 + 2}px`,
						backgroundColor: `rgba(16, 185, 129, ${Math.random() * 0.3})`,
						animation: `float ${Math.random() * 10 + 10}s linear infinite`,
						animationDelay: `${Math.random() * 5}s`,
					}}
				></div>
			))}

			{/* Gradient orbs */}
			<div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px]"></div>
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-600/10 blur-[100px]"></div>
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-700/10 blur-[100px]"></div>

			<div className="container mx-auto max-w-7xl px-4 py-16 relative z-10">
				{/* Announcement banner */}
				<div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-md border border-emerald-500/20 rounded-full px-6 py-2 text-sm font-medium text-white flex items-center gap-2 shadow-glow-sm">
					<div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
					<span>Now offering special rates for startups</span>
				</div>

				{/* Hero Section */}
				<div id="hero-section" className="animate-section pt-20 pb-24">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
						<div
							className={`lg:col-span-7 space-y-8 transition-all duration-1000 ${
								isVisible["hero-section"]
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-10"
							}`}
						>
							<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-full border border-emerald-500/20 text-emerald-400 shadow-lg backdrop-blur-sm">
								<Sparkles className="h-4 w-4" />
								<span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
									Innovative Solutions for Growth
								</span>
							</div>

							<h1 className="text-5xl md:text-6xl font-bold leading-tight">
								<span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent block mb-2">
									Transformative
								</span>
								<span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent block">
									Services
								</span>
							</h1>

							<div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>

							<p className="text-gray-300 text-lg max-w-2xl">
								At KalawatiPutra Edu, we provide innovative solutions to help
								you grow, learn, and succeed in today's competitive landscape.
							</p>

							<div className="flex flex-wrap gap-4 pt-4">
								<button
									onClick={showUnderDevelopmentToast}
									className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg hover:shadow-emerald-500/20 transition duration-300"
								>
									<span>Explore Services</span>
									<ArrowRight className="h-5 w-5" />
								</button>

								<button
									onClick={showUnderDevelopmentToast}
									className="flex items-center gap-3 px-5 py-3 rounded-full font-medium text-gray-100 bg-gray-800/60 border border-gray-700 shadow-lg hover:bg-gray-700/60 hover:shadow-emerald-600/10 transition duration-300 group"
								>
									<div className="h-6 w-6 rounded-full flex items-center justify-center bg-emerald-600 group-hover:scale-105 transition-transform">
										<Play className="h-3 w-3 text-white ml-0.5" />
									</div>
									<span>Watch Demo</span>
								</button>
							</div>

							{/* Trust badges */}
							<div className="pt-12">
								<p className="text-gray-400 text-sm mb-4 font-medium tracking-wider">
									TRUSTED BY TOP COMPANIES
								</p>
								<div className="flex flex-wrap items-center gap-8">
									<div className="company-logo opacity-70 hover:opacity-100 transition-opacity">
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png"
											alt="Google"
											className="h-8"
										/>
									</div>
									<div className="company-logo opacity-70 hover:opacity-100 transition-opacity">
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"
											alt="Microsoft"
											className="h-8"
										/>
									</div>
									<div className="company-logo opacity-70 hover:opacity-100 transition-opacity">
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
											alt="Amazon"
											className="h-8"
										/>
									</div>
									<div className="company-logo opacity-70 hover:opacity-100 transition-opacity">
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png"
											alt="Meta"
											className="h-8"
										/>
									</div>
								</div>
							</div>
						</div>

						<div
							className={`lg:col-span-5 transition-all duration-1000 delay-300 ${
								isVisible["hero-section"]
									? "opacity-100 translate-x-0"
									: "opacity-0 translate-x-10"
							}`}
						>
							<div className="relative">
								<div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl blur-lg opacity-75 animate-pulse-slow"></div>
								<div className="relative bg-gray-900 p-1 rounded-2xl border border-gray-800">
									<div className="bg-gray-800 rounded-xl overflow-hidden">
										<img
											src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
											alt="Team collaboration"
											className="w-full h-auto object-cover rounded-xl"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Services Section */}
				<div id="services-section" className="animate-section py-20 relative">
					<div
						className={`text-center mb-16 transition-all duration-1000 ${
							isVisible["services-section"]
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-10"
						}`}
					>
						<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-full border border-emerald-500/20 text-emerald-400 shadow-lg backdrop-blur-sm mb-6">
							<Sparkles className="h-4 w-4" />
							<span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
								Tailored for Excellence
							</span>
						</div>

						<h2 className="text-4xl font-bold mb-4">
							<span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
								Professional Services
							</span>
						</h2>

						<p className="text-gray-400 max-w-2xl mx-auto">
							Tailored solutions to help you achieve your goals with efficiency
							and excellence
						</p>
					</div>

					{/* Category Filter */}
					<div
						className={`flex justify-center mb-12 transition-all duration-1000 delay-200 ${
							isVisible["services-section"]
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-10"
						}`}
					>
						<div className="inline-flex p-1 bg-gray-800/50 backdrop-blur-md rounded-full shadow-lg border border-gray-700/50">
							{categories.map((cat) => (
								<button
									key={cat}
									onClick={() => setCategory(cat)}
									className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
										category === cat
											? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg"
											: "text-gray-300 hover:text-white hover:bg-gray-700/50"
									}`}
								>
									{cat}
								</button>
							))}
						</div>
					</div>

					{/* Services Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative">
						{filteredServices.map((service, index) => (
							<div
								key={index}
								className={`transition-all duration-1000 delay-${index * 100} ${
									isVisible["services-section"]
										? "opacity-100 translate-y-0"
										: "opacity-0 translate-y-10"
								}`}
							>
								<div className="group relative">
									<div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
									<div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 group-hover:border-emerald-500/50 transition-all duration-300 h-full">
										<div className="p-6 h-full flex flex-col">
											<div className="flex items-center mb-4">
												<div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 transition-colors duration-300 text-emerald-400 group-hover:text-emerald-300">
													{getIcon(service.icon)}
												</div>
												<h3 className="ml-4 text-xl font-semibold text-white group-hover:text-emerald-100 transition-colors">
													{service.title}
												</h3>
											</div>
											<div className="flex-grow">
												<p className="text-gray-400 group-hover:text-gray-300 transition-colors">
													{service.description}
												</p>
											</div>
											<div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
												<span className="text-sm bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent font-medium">
													{service.category}
												</span>
												{service.path === "" ? (
													<button
														onClick={showUnderDevelopmentToast}
														className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center text-sm group"
													>
														Learn more
														<ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
													</button>
												) : (
													<Link
														to={service.path}
														className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center text-sm group"
													>
														Learn more
														<ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
													</Link>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* CTA Section */}
				<div
					id="cta-section"
					className="animate-section relative overflow-hidden rounded-2xl mb-12"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-700"></div>
					<div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

					{/* Decorative elements */}
					<div className="absolute -left-20 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
					<div className="absolute -right-20 bottom-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

					<div
						className={`relative px-6 py-16 sm:px-12 sm:py-20 lg:py-24 lg:px-20 text-center transition-all duration-1000 ${
							isVisible["cta-section"]
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-10"
						}`}
					>
						<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
							Ready to accelerate your growth?
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-emerald-100 mb-8">
							Join hundreds of satisfied clients who have transformed their
							businesses with our innovative solutions and expert guidance.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<button
								onClick={showUnderDevelopmentToast}
								className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300"
							>
								Get Started Today
								<ArrowRight className="w-4 h-4 ml-2" />
							</button>

							<button
								onClick={showUnderDevelopmentToast}
								className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-full shadow-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300"
							>
								Learn More
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Services;
