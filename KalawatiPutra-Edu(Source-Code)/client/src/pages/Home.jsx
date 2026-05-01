import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getArticles, getCourses } from "../api";
import { Helmet } from "react-helmet-async";
import {
	ChevronDown,
	Activity,
	Code,
	BookOpen,
	Zap,
	ArrowRight,
	Star,
	Linkedin as LinkedinIcon,
	ExternalLink,
	Sparkles,
	Quote,
	Play,
	Award,
	UserPlus,
	Shield,
	CheckCircle,
	BarChart,
	Lock,
	Cpu,
	MousePointer,
	Globe,
	Coffee,
	ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner"; // Import Sonner
import Chatbot from "../components/Chatbot";
import DialogBoxAds from "../components/roadmap/DialogBoxAds";
import { Disclosure } from "@headlessui/react";

const Home = () => {
	const [articles, setArticles] = useState([]);
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const heroRef = useRef(null);
	const testimonialRef = useRef(null);
	const sliderRef = useRef(null);
	const [isHovering, setIsHovering] = useState(false);
	const [position, setPosition] = useState(0);
	const statsRef = useRef(null);
	const youtubeVideoUrlForDialogbox =
		"https://www.youtube.com/embed/sete9ynXqkQ";
	const [activeHeroTab, setActiveHeroTab] = useState(0);
	const [countUpStarted, setCountUpStarted] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);

	// Reimagined hero section tabs
	const heroTabs = [
		{
			id: "roadmaps",
			title: "DSA Roadmaps",
			icon: <Code className="w-5 h-5" />,
			description:
				"Company-specific algorithm pathways to ace technical interviews",
			features: [
				"FAANG-focused problems",
				"Optimized learning paths",
				"Weekly challenges",
			],
			image: "/Images/dsa.png",
			color: "from-blue-600 to-indigo-800",
			link: "/roadmap",
		},
		{
			id: "mentorship",
			title: "Expert Mentorship",
			icon: <UserPlus className="w-5 h-5" />,
			description:
				"1:1 guidance from industry professionals to accelerate your growth",
			features: ["Personalized feedback", "Career planning", "Mock interviews"],
			image: "/Images/mentoring.jpg",
			color: "from-emerald-600 to-teal-800",
			link: "/mentorship",
		},
		{
			id: "courses",
			title: "AI-Driven Courses",
			icon: <Cpu className="w-5 h-5" />,
			description: "Adaptive learning experiences tailored to your skill level",
			features: [
				"Performance analytics",
				"Personalized pace",
				"Interactive projects",
			],
			image: "/Images/aitech.jpg",
			color: "from-violet-600 to-purple-800",
			link: "/courses",
		},
	];

	// Testimonials
	const testimonials = [
		{
			name: "Sai Charan L",
			text: "KalawatiPutra Edu is a solid platform for software development prep. The team's dedication to student growth is truly inspiring. Happy to see its growing impact.",
			photo: "/Images/Testimonial_img/charanpic.jpeg",
			position: "Founder ElevateBox",
			linkedinId: "https://www.linkedin.com/in/charann06/",
		},
		{
			name: "Aarushi Sharma",
			text: "The company-wise DSA problem roadmap at KalawatiPutra Edu is very well structured. It helped me stay focused and improved my problem-solving consistency tremendously.",
			photo: "/Images/Testimonial_img/aarushiimage.jpeg",
			position: "SDE Intern - Helpshift",
			linkedinId: "https://www.linkedin.com/in/aarushii-sharma/",
		},
		{
			name: "Haruday",
			text: "Even after my placement, I found the content from KalawatiPutra Edu super helpful and insightful. Grateful to have access to such quality learning.",
			photo: "/Images/Testimonial_img/harudayimg.jpeg",
			position: "SDE Intern - FICO",
			linkedinId: "https://www.linkedin.com/in/haruday/",
		},
		{
			name: "Aryan Sharma",
			text: "Such a good platform for anyone serious about placements. The learning path is clear and the resources are curated to match real interview expectations.",
			photo: "/Images/Testimonial_img/aryanimage.jpeg",
			position: "SWE Intern - Nielsen",
			linkedinId: "https://www.linkedin.com/in/aryansharma07/",
		},
	];

	// Stats for the counter section
	const stats = [
		{
			value: 1000,
			label: "Students",
			icon: <BookOpen className="w-6 h-6 text-white" />,
			color: "bg-gradient-to-r from-blue-500 to-blue-700",
		},
		{
			value: 20,
			label: "Courses",
			icon: <Code className="w-6 h-6 text-white" />,
			color: "bg-gradient-to-r from-emerald-500 to-emerald-700",
		},
		{
			value: 200,
			label: "Placements",
			icon: <Activity className="w-6 h-6 text-white" />,
			color: "bg-gradient-to-r from-rose-500 to-rose-700",
		},
		{
			value: 95,
			label: "Success Rate",
			suffix: "",
			icon: <Zap className="w-6 h-6 text-white" />,
			color: "bg-gradient-to-r from-amber-500 to-amber-700",
		},
	];

	// Modern services with more details and specific links
	const services = [
		{
			icon: <Code className="h-6 w-6" />,
			title: "DSA Roadmaps",
			description:
				"Company-specific problem-solving paths that prepare you for technical interviews at your dream companies.",
			features: [
				"Custom learning path",
				"600+ curated problems",
				"Company-specific tracks",
			],
			color: "from-blue-500/20 to-indigo-500/20",
			borderColor: "border-blue-500/30",
			textColor: "text-blue-400",
			hoverBg: "group-hover:bg-blue-500/10",
			link: "/roadmap", // Specific link
		},
		{
			icon: <Activity className="h-6 w-6" />,
			title: "Interview Mastery",
			description:
				"Comprehensive preparation with mock interviews, feedback, and personalized improvement plans.",
			features: ["Mock interviews", "Expert feedback", "Performance analytics"],
			color: "from-violet-500/20 to-purple-500/20",
			borderColor: "border-violet-500/30",
			textColor: "text-violet-400",
			hoverBg: "group-hover:bg-violet-500/10",
			link: "/dsapractice", // Specific link
		},
		{
			icon: <BookOpen className="h-6 w-6" />,
			title: "Expert Courses",
			description:
				"Deep-dive into critical concepts with courses taught by industry professionals.",
			features: [
				"Hands-on projects",
				"Expert instruction",
				"Industry-relevant skills",
			],
			color: "from-emerald-500/20 to-teal-500/20",
			borderColor: "border-emerald-500/30",
			textColor: "text-emerald-400",
			hoverBg: "group-hover:bg-emerald-500/10",
			link: "/courses", // Specific link
		},
		{
			icon: <Sparkles className="h-6 w-6" />,
			title: "AI Resume Analysis",
			description:
				"Get AI-powered feedback on your resume to stand out to recruiters and hiring managers.",
			features: [
				"ATS compatibility",
				"Keyword optimization",
				"Industry benchmarking",
			],
			color: "from-amber-500/20 to-yellow-500/20",
			borderColor: "border-amber-500/30",
			textColor: "text-amber-400",
			hoverBg: "group-hover:bg-amber-500/10",
			link: "/resume-interview-prep", // Specific link
		},
		{
			icon: <Zap className="h-6 w-6" />,
			title: "Career Counseling",
			description:
				"One-on-one sessions with industry mentors to guide your tech career journey.",
			features: ["Career roadmapping", "Industry insights", "Growth strategy"],
			color: "from-rose-500/20 to-pink-500/20",
			borderColor: "border-rose-500/30",
			textColor: "text-rose-400",
			hoverBg: "group-hover:bg-rose-500/10",
			link: "/counseling", // Specific link
		},
		{
			icon: <Star className="h-6 w-6" />,
			title: "Tech Community",
			description:
				"Join a thriving community of learners, professionals, and mentors for networking and support.",
			features: ["Peer learning", "Networking events", "Knowledge sharing"],
			color: "from-cyan-500/20 to-sky-500/20",
			borderColor: "border-cyan-500/30",
			textColor: "text-cyan-400",
			hoverBg: "group-hover:bg-cyan-500/10",
			link: "https://chat.whatsapp.com/CqgVBTvCRSmDj6O7iQLHes", // Updated link
		},
	];

	// Auto-advance hero tabs
	useEffect(() => {
		const interval = setInterval(() => {
			setActiveHeroTab((prev) => (prev + 1) % heroTabs.length);
		}, 5000);
		return () => clearInterval(interval);
	}, [heroTabs.length]);

	// Auto-advance testimonials
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % testimonials.length);
		}, 4000);
		return () => clearInterval(interval);
	}, [testimonials.length]);

	// Intersection Observer for stats counter animation
	useEffect(() => {
		const options = {
			threshold: 0.5,
			rootMargin: "0px",
		};

		const handleIntersection = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && !countUpStarted) {
					setCountUpStarted(true);
					const counters = document.querySelectorAll(".stat-counter");
					counters.forEach((counter, index) => {
						const targetValue = stats[index].value;
						let startValue = 0;
						const duration = 2000;
						const increment = Math.ceil(targetValue / (duration / 16));

						const updateCounter = () => {
							startValue += increment;
							if (startValue > targetValue) {
								counter.textContent = targetValue + (stats[index].suffix || "");
							} else {
								counter.textContent = startValue + (stats[index].suffix || "");
								requestAnimationFrame(updateCounter);
							}
						};

						updateCounter();
					});
				}
			});
		};

		const observer = new IntersectionObserver(handleIntersection, options);

		if (statsRef.current) {
			observer.observe(statsRef.current);
		}

		return () => {
			if (statsRef.current) {
				observer.unobserve(statsRef.current);
			}
		};
	}, [countUpStarted, stats]);

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const res = await getArticles({ page: 1, limit: 5 });
				setArticles(Array.isArray(res.data.articles) ? res.data.articles : []);
			} catch (err) {
				console.error("Failed to fetch articles:", err);
				setError("Failed to fetch articles");
				setArticles([]);
			} finally {
				setLoading(false);
			}
		};
		fetchArticles();
	}, []);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const res = await getCourses();
				console.log('Home - API Response:', res.data);

				// Handle enhanced API response format
				let coursesArray = [];
				if (res.data.success && res.data.data) {
					// Enhanced API format: {success: true, data: courses}
					coursesArray = Array.isArray(res.data.data) ? res.data.data : [];
				} else if (Array.isArray(res.data)) {
					// Legacy API format: direct array
					coursesArray = res.data;
				} else {
					console.warn('Home - Unexpected response format:', res.data);
					coursesArray = [];
				}

				setCourses(coursesArray.slice(0, 3));
			} catch (err) {
				console.error("Failed to fetch courses:", err);
				setError("Failed to fetch courses");
				setCourses([]);
			}
		};
		fetchCourses();
	}, []);

	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "KalawatiPutra Edu",
		url: "https://kalawatiputra.com",
		logo: "https://kalawatiputra.com/images/kalawatiputra-logo.png",
		description:
			"KalawatiPutra Edu is a premier EdTech platform offering Data Structures and Algorithms roadmaps, MNC interview preparation, AI-powered resume analysis, career counseling, and custom software solutions.",
		sameAs: [
			"https://www.linkedin.com/company/kalawatiputra-edu",
			"https://twitter.com/kalawatiputra",
		],
	};

	const courseSchema = courses.map((course) => ({
		"@context": "https://schema.org",
		"@type": "Course",
		name: course.title,
		description: course.description,
		provider: {
			"@type": "Organization",
			name: "KalawatiPutra Edu",
			sameAs: "https://kalawatiputra.com",
		},
		url: `https://kalawatiputra.com/courses/${course._id}`,
		image:
			course.image || "https://kalawatiputra.com/images/placeholder-course.jpg",
	}));

	const articleSchema = articles.map((article) => ({
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		description: article.content?.replace(/<[^>]+>/g, "").substring(0, 200),
		author: {
			"@type": "Person",
			name: article.author?.name || "KalawatiPutra Edu",
		},
		publisher: {
			"@type": "Organization",
			name: "KalawatiPutra Edu",
			logo: {
				"@type": "ImageObject",
				url: "https://kalawatiputra.com/images/kalawatiputra-logo.png",
			},
		},
		datePublished: article.createdAt,
		image:
			article.images?.[0] ||
			"https://kalawatiputra.com/images/placeholder-article.jpg",
		url: `https://kalawatiputra.com/article/${article._id}`,
	}));

	const handleStart = () => {
		const el = document.getElementById("services");
		el?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const handleWatchDemo = () => {
		// toast.info("Demo video is coming soon!", {
		// 	position: "top-right",
		// 	duration: 3000,
		// 	icon: <Play className="h-4 w-4" />,
		// });
		window.open(youtubeVideoUrlForDialogbox, "_blank");
	};

	// Function to trigger Sonner notification
	const handleStartLearning = () => {
		toast.info("This feature is under development!", {
			position: "top-right",
			duration: 3000,
		});
	};

	const handleBookDemo = () => {
		toast.warning("This feature is under development!", {
			position: "top-right",
			duration: 3000,
		});
	};

	useEffect(() => {
		const calculateTotalWidth = () => {
			if (!sliderRef.current) return 0;

			const slides = Array.from(sliderRef.current.children);
			return slides.reduce((total, slide) => total + slide.offsetWidth, 0);
		};

		let animationFrameId;
		let speed = 1.5;

		const animate = () => {
			if (!sliderRef.current) return;

			const totalWidth = calculateTotalWidth();
			const containerWidth = sliderRef.current.parentElement.offsetWidth;

			// Apply slower speed on hover
			const currentSpeed = isHovering ? speed * 0.2 : speed;

			let newPosition = position + currentSpeed;

			// Reset position for seamless loop
			if (newPosition > totalWidth / 2) {
				newPosition = 0;
			}

			setPosition(newPosition);
			sliderRef.current.style.transform = `translateX(-${newPosition}px)`;

			animationFrameId = requestAnimationFrame(animate);
		};

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [position, isHovering]);

	// Clone testimonials to create seamless loop effect
	const extendedTestimonials = [...testimonials, ...testimonials];

	return (
		<div className="bg-gray-950 text-white min-h-screen w-full overflow-hidden">
			{/* Add Toaster component for Sonner notifications */}
			<Toaster richColors position="top-right" />

			<Helmet>
				<title>KalawatiPutra Edu - Premier EdTech Platform</title>
				<meta
					name="description"
					content="KalawatiPutra Edu offers expert-led courses, DSA roadmaps, MNC interview preparation, AI-powered resume analysis, and career counseling for students and startups."
				/>
				<meta
					name="keywords"
					content="KalawatiPutra Edu, DSA roadmap, MNC interview preparation, coding interview questions, AI resume analysis, career counseling, software engineering courses, startup mentorship, EdTech platform"
				/>
				<meta name="robots" content="index, follow" />
				<meta name="author" content="KalawatiPutra Edu" />
				<link rel="canonical" href="https://kalawatiputra.com" />
				<meta
					property="og:title"
					content="KalawatiPutra Edu - Learn, Grow, Succeed"
				/>
				<meta
					property="og:description"
					content="Master coding, ace interviews, and build your career with KalawatiPutra Edu's expert-led courses, DSA roadmaps, and AI-powered tools."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://kalawatiputra.com" />
				<meta
					property="og:image"
					content="https://kalawatiputra.com/images/kalawatiputra-og.jpg"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="KalawatiPutra Edu - Learn, Grow, Succeed"
				/>
				<meta
					name="twitter:description"
					content="Master coding, ace interviews, and build your career with KalawatiPutra Edu's expert-led courses, DSA roadmaps, and AI-powered tools."
				/>
				<meta
					name="twitter:image"
					content="https://kalawatiputra.com/images/kalawatiputra-og.jpg"
				/>
				<script type="application/ld+json">
					{JSON.stringify(organizationSchema)}
				</script>
				{courseSchema.map((schema, index) => (
					<script key={`course-${index}`} type="application/ld+json">
						{JSON.stringify(schema)}
					</script>
				))}
				{articleSchema.map((schema, index) => (
					<script key={`article-${index}`} type="application/ld+json">
						{JSON.stringify(schema)}
					</script>
				))}
			</Helmet>

			{/* ===== HERO SECTION ===== */}
			<section
				ref={heroRef}
				className="relative w-full min-h-screen overflow-hidden pt-16 pb-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
			>
				<div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
				<div className="absolute inset-0">
					{[...Array(20)].map((_, i) => (
						<div
							key={i}
							className="particle absolute rounded-full"
							style={{
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
								width: `${Math.random() * 6 + 2}px`,
								height: `${Math.random() * 6 + 2}px`,
								backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255
									}, ${Math.random() * 255}, 0.3)`,
								animation: `float ${Math.random() * 10 + 10}s linear infinite`,
								animationDelay: `${Math.random() * 5}s`,
							}}
						></div>
					))}
				</div>

				<div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px]"></div>
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px]"></div>

				<div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-purple-500/20 rounded-full px-6 py-2 text-sm font-medium text-white flex items-center gap-2 shadow-glow-sm animate-pulse-slow">
					<div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
					<span>Now Enrolling for 2026 Cohort</span>
				</div>

				<div className="container mx-auto px-4 relative z-10 pt-16 max-w-7xl">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
						<motion.div
							className="lg:col-span-5 space-y-8"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-full border border-blue-500/20 text-blue-400 shadow-glow-sm backdrop-blur-sm">
								<Sparkles className="h-4 w-4" />
								<span className="text-gradient-blue-purple">
									AI-powered learning platform
								</span>
							</div>

							<motion.h1
								initial="hidden"
								animate="visible"
								variants={{
									hidden: {},
									visible: {
										transition: {
											staggerChildren: 0.4,
										},
									},
								}}
								className="text-5xl md:text-6xl font-bold leading-tight text-left"
							>
								<motion.span
									variants={{
										hidden: { opacity: 0, y: 40 },
										visible: { opacity: 1, y: 0 },
									}}
									transition={{ duration: 0.8, ease: "easeOut" }}
									className="bg-gradient-to-r from-sky-400 to-indigo-600 bg-clip-text text-transparent block"
								>
									Master Coding.
								</motion.span>
								<motion.span
									variants={{
										hidden: { opacity: 0, y: 40 },
										visible: { opacity: 1, y: 0 },
									}}
									transition={{ duration: 0.8, ease: "easeOut" }}
									className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent block"
								>
									Land Top Jobs.
								</motion.span>
							</motion.h1>

							<div className="relative h-12 overflow-hidden">
								<motion.div
									className="absolute inset-0 flex items-center"
									initial={{ y: 50, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.2, duration: 0.5 }}
								>
									<span className="text-2xl font-medium text-gradient-primary">
										Trusted by 1000+ students across 50+ universities
									</span>
								</motion.div>
							</div>

							<p className="text-gray-300 text-lg max-w-xl">
								Personalized learning paths, expert-led courses, and AI-powered
								tools to guide your journey from coding bootcamp to FAANG
								interviews.
							</p>

							<div className="flex flex-wrap gap-4 pt-4">
								{/* Start Journey Button */}
								<button
									onClick={handleStart}
									className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-emerald-100 bg-emerald-800/40 border border-emerald-700 shadow-inner shadow-emerald-900/10 hover:bg-emerald-700/60 hover:shadow-emerald-600/20 transition duration-300"
								>
									<span>Start Your Journey</span>
									<ArrowRight className="h-5 w-5" />
								</button>

								{/* Watch Demo Button */}
								<button
									onClick={handleWatchDemo}
									className="flex items-center gap-3 px-5 py-3 rounded-full font-medium text-gray-100 bg-gray-800/60 border border-gray-700 shadow-inner shadow-emerald-900/10 hover:bg-gray-700/60 hover:shadow-emerald-600/10 transition duration-300 group"
								>
									<div className="h-6 w-6 rounded-full flex items-center justify-center bg-emerald-600 group-hover:scale-105 transition-transform">
										<Play className="h-3 w-3 text-white ml-0.5" />
									</div>
									<span>Introduction Video</span>
								</button>
							</div>

							{/* Trust badges */}
							<div className="pt-12">
								<p className="text-gray-400 text-sm mb-4 font-medium tracking-wider">
									TRUSTED BY TOP COMPANIES
								</p>
								<div className="flex flex-wrap items-center gap-8">
									<div className="company-logo">
										<img
											src="https://th.bing.com/th/id/R.2edf43b2747343d772177dff4de67ca1?rik=N4WLUOfpf92Q9A&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fGoogle-Logo-PNG-Free-Image.png&ehk=Jlh0o0mll7YsNeyVsDTaKxQ%2bIc8e4BKw4%2bXfbX73tPY%3d&risl=&pid=ImgRaw&r=0"
											alt="Google"
											className="h-8"
										/>
									</div>
									<div className="company-logo">
										<img
											src="https://www.pngarts.com/files/9/Windows-Microsoft-Logo-PNG-Image-Transparent-Background.png"
											alt="Microsoft"
											className="h-8"
										/>
									</div>
									<div className="company-logo">
										<img
											src="https://www.pngplay.com/wp-content/uploads/3/Amazon-Logo-Transparent-PNG-279x279.png"
											alt="Amazon"
											className="h-8"
										/>
									</div>
									<div className="company-logo">
										<img
											src="https://freepnglogo.com/images/all_img/1723808808meta-logo-transparent-PNG.png"
											alt="Meta"
											className="h-8"
										/>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Right content - Interactive Tabs */}
						<motion.div
							className="lg:col-span-7 relative"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.7, delay: 0.2 }}
						>
							<div className="relative z-10 bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 rounded-3xl shadow-glow-lg overflow-hidden">
								{/* Tab Navigation */}
								<div className="flex space-x-4 mb-8">
									{heroTabs.map((tab, index) => (
										<button
											key={tab.id}
											className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeHeroTab === index
												? "bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-white"
												: "text-gray-400 hover:text-white"
												}`}
											onClick={() => setActiveHeroTab(index)}
										>
											{tab.icon}
											<span>{tab.title}</span>
											{activeHeroTab === index && (
												<motion.div
													className="absolute inset-0 rounded-full border border-blue-500/30"
													layoutId="activeTab"
												/>
											)}
										</button>
									))}
								</div>

								{/* Tab Content */}
								<div className="relative min-h-[24rem]">
									{heroTabs.map((tab, index) => (
										<motion.div
											key={tab.id}
											className={`${activeHeroTab === index ? "block" : "hidden"
												} grid grid-cols-1 md:grid-cols-2 gap-6 items-center`}
											initial={{ opacity: 0, y: 20 }}
											animate={{
												opacity: activeHeroTab === index ? 1 : 0,
												y: activeHeroTab === index ? 0 : 20,
											}}
											transition={{ duration: 0.5 }}
										>
											<div className="space-y-6">
												<h3 className="text-xl font-semibold flex items-center gap-2 text-white">
													{tab.icon}
													{tab.title}
												</h3>
												<p className="text-gray-300">{tab.description}</p>
												<ul className="space-y-2">
													{tab.features.map((feature, i) => (
														<li
															key={i}
															className="flex items-center gap-2 text-sm text-gray-300"
														>
															<CheckCircle className="h-4 w-4 text-blue-400" />
															{feature}
														</li>
													))}
												</ul>
												<Link
													to={tab.link}
													className={`inline-flex px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${tab.color} text-white shadow-glow-sm items-center gap-2 hover:opacity-90 transition-opacity`}
												>
													<span>Explore {tab.title}</span>
													<ArrowRight className="h-4 w-4" />
												</Link>
											</div>
											<div className="relative">
												<div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-800 shadow-glow-md">
													<img
														src={tab.image || "/Images/heroslider1.png"}
														alt={tab.title}
														className="w-full h-full object-cover"
													/>
												</div>

												{/* Decorative elements */}
												<div className="absolute -top-4 -right-4 h-20 w-20 border border-gray-700 rounded-full opacity-30 animate-spin-slow"></div>
												<div className="absolute -bottom-6 -left-6 h-16 w-16 border border-gray-700 rounded-md opacity-20 animate-float rotate-12"></div>
											</div>
										</motion.div>
									))}
								</div>

								{/* Progress dots */}
								<div className="flex justify-center mt-8 gap-2">
									{heroTabs.map((_, index) => (
										<button
											key={index}
											className={`h-2 rounded-full transition-all ${activeHeroTab === index
												? "w-8 bg-blue-500"
												: "w-2 bg-gray-700"
												}`}
											onClick={() => setActiveHeroTab(index)}
										></button>
									))}
								</div>
							</div>

							{/* Floating code snippet */}
							<motion.div
								className="absolute -bottom-8 -left-8 w-64 p-4 bg-gray-900/80 border border-gray-800 rounded-xl backdrop-blur-lg shadow-glow-md transform rotate-3 z-20"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.7 }}
							>
								<div className="flex items-center mb-2 px-1">
									<div className="flex gap-1.5">
										<div className="w-3 h-3 rounded-full bg-red-500"></div>
										<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
										<div className="w-3 h-3 rounded-full bg-green-500"></div>
									</div>
									<div className="ml-auto text-xs text-gray-500">
										learning.js
									</div>
								</div>
								<pre className="text-xs text-gray-300 font-mono overflow-x-auto scrollbar-thin">
									<code>
										<span className="text-pink-400">const</span>{" "}
										<span className="text-blue-400">success</span> ={" "}
										<span className="text-pink-400">await</span>{" "}
										<span className="text-emerald-400">KalawatiPutra</span>.
										<span className="text-yellow-400">learn</span>({"\n"}
										&nbsp;&nbsp;<span className="text-blue-400">
											student
										</span>: <span className="text-orange-400">you</span>,{"\n"}
										&nbsp;&nbsp;<span className="text-blue-400">
											goal
										</span>: <span className="text-green-400">'FAANG'</span>,
										{"\n"}
										&nbsp;&nbsp;<span className="text-blue-400">
											mode
										</span>:{" "}
										<span className="text-green-400">'accelerated'</span>
										{"\n"});
									</code>
								</pre>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ===== STATS SECTION ===== */}
			<section
				ref={statsRef}
				className="py-20 bg-gray-950 relative overflow-hidden"
			>
				<div className="container mx-auto px-4 max-w-7xl">
					<div className="max-w-4xl mx-auto text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-primary">
							Transforming Education with Real Results
						</h2>
						<p className="text-gray-300 text-lg max-w-2xl mx-auto">
							Our students consistently outperform in technical interviews and
							land their dream roles at top tech companies worldwide.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<motion.div
								key={index}
								className={`${stat.color} rounded-2xl p-6 text-center relative overflow-hidden shadow-glow-md`}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10"></div>
								<div className="relative z-10">
									<div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
										{stat.icon}
									</div>
									<h3 className="text-4xl font-bold mb-2">
										<span className="stat-counter">0</span>
										{stat.suffix}
									</h3>
									<p className="text-white">{stat.label}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ===== SERVICES SECTION ===== */}
			<section
				className="py-24 bg-gradient-to-b from-gray-950 to-gray-900 relative overflow-hidden"
				id="services"
			>
				<div className="container mx-auto px-4 max-w-7xl">
					<div className="max-w-4xl mx-auto text-center mb-16">
						<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-full border border-blue-500/20 text-blue-400 shadow-glow-sm backdrop-blur-sm mb-4">
							<Shield className="h-4 w-4" />
							<span>Our Core Services</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-cool">
							Everything You Need to Succeed
						</h2>
						<p className="text-gray-300 text-lg max-w-2xl mx-auto">
							From beginner to expert, we provide all the tools and resources
							you need to master programming concepts and ace technical
							interviews.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{services.map((service, index) => (
							<motion.div
								key={index}
								className={`group relative bg-gradient-to-br ${service.color} border ${service.borderColor} rounded-2xl p-8 shadow-glow-sm transition-all duration-300 hover:shadow-glow-md`}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<div
									className={`w-12 h-12 rounded-xl ${service.textColor} mb-6 flex items-center justify-center ${service.hoverBg} transition-colors duration-300`}
								>
									{service.icon}
								</div>
								<h3 className="text-xl font-semibold mb-3">{service.title}</h3>
								<p className="text-gray-300 mb-6">{service.description}</p>
								<ul className="space-y-2 mb-8">
									{service.features.map((feature, i) => (
										<li
											key={i}
											className="flex items-center gap-2 text-sm text-gray-400"
										>
											<CheckCircle className="h-4 w-4 text-blue-400" />
											{feature}
										</li>
									))}
								</ul>
								<Link
									to={service.link}
									className={`inline-flex items-center text-sm font-medium ${service.textColor} hover:underline`}
								>
									<span>Learn more</span>
									<ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ===== TESTIMONIALS SECTION ===== */}
			<section
				ref={testimonialRef}
				className="py-24 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden"
			>
				<div className="container mx-auto px-4 max-w-7xl">
					<div className="max-w-4xl mx-auto text-center mb-12">
						<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full border border-amber-500/20 text-amber-400 shadow-glow-sm backdrop-blur-sm mb-4">
							<Quote className="h-4 w-4" />
							<span>Success Stories</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-warm">
							Feedback That Speaks Volumes
						</h2>
						<p className="text-gray-300 text-lg max-w-2xl mx-auto">
							Join the community of students who've transformed their careers
							with our guidance and mentorship.
						</p>
					</div>

					<div
						className="relative overflow-hidden"
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}
					>
						{/* Testimonial Cards */}
						<div className="overflow-hidden">
							<div
								ref={sliderRef}
								className="flex transition-all"
								style={{ willChange: "transform" }}
							>
								{extendedTestimonials.map((testimonial, index) => (
									<div
										key={index}
										className="min-w-[100%] md:min-w-[50%] lg:min-w-[33.333%] p-4"
									>
										<div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 shadow-glow-md h-full">
											<div className="flex items-start mb-6">
												<div className="relative">
													<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500">
														<img
															src={
																testimonial.photo ||
																"/Images/placeholder-avatar.jpg"
															}
															alt={testimonial.name}
															className="w-full h-full object-cover"
														/>
													</div>
													<div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
														<Star className="w-3 h-3 text-gray-900" />
													</div>
												</div>
												<div className="ml-4">
													<h4 className="font-semibold text-lg">
														{testimonial.name}
													</h4>
													<p className="text-gray-400 text-sm">
														{testimonial.position}
													</p>
												</div>
												<a
													href={testimonial.linkedinId}
													target="_blank"
													rel="noopener noreferrer"
													className="ml-auto text-blue-400 hover:text-blue-300 transition-colors"
												>
													<LinkedinIcon className="w-5 h-5" />
												</a>
											</div>
											<p className="text-gray-300">{testimonial.text}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ===== FEATURED COURSES SECTION ===== */}
			<section className="py-24 bg-gradient-to-b from-gray-950 to-gray-900 relative overflow-hidden">
				<div className="container mx-auto px-4 max-w-7xl">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
						<div className="max-w-2xl">
							<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full border border-emerald-500/20 text-emerald-400 shadow-glow-sm backdrop-blur-sm mb-4">
								<BookOpen className="h-4 w-4" />
								<span>Featured Courses</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-cool">
								Expert-Led Learning Experiences
							</h2>
							<p className="text-gray-300 text-lg max-w-2xl">
								Comprehensive courses designed by industry professionals to
								build your skills from the ground up.
							</p>
						</div>
						<Link
							to="/courses"
							className="mt-4 inline-flex items-center group text-emerald-500 hover:text-emerald-600 transition-colors duration-300"
						>
							<span className="flex items-center gap-1">
								View All Courses
								<ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
							</span>
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{courses.length > 0 ? (
							courses.map((course, index) => (
								<motion.div
									key={course._id || index}
									className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-800 shadow-glow-md transition-transform hover:scale-[1.02]"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
								>
									<div className="relative aspect-video overflow-hidden">
										<img
											src={course.image || "/Images/placeholder-course.jpg"}
											alt={course.title}
											className="w-full h-full object-cover"
										/>
										<div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
											{course.level || "All Levels"}
										</div>
									</div>
									<div className="p-6">
										<div className="flex items-center gap-2 mb-2">
											<Shield className="w-4 h-4 text-emerald-400" />
											<span className="text-sm text-emerald-400 font-medium">
												{course.category || "Programming"}
											</span>
										</div>
										<h3 className="text-xl font-semibold mb-2 line-clamp-2">
											{course.title}
										</h3>
										<p className="text-gray-400 mb-4 line-clamp-2">
											{course.description}
										</p>
										<div className="flex items-center justify-between pt-4 border-t border-gray-700">
											<div className="flex items-center gap-1">
												<Star className="w-4 h-4 text-amber-400" />
												<span className="text-white font-medium">
													{course.rating || "4.8"}
												</span>
												<span className="text-gray-400 text-sm">
													({course.reviews || "120"} reviews)
												</span>
											</div>
											<span className="text-white font-bold">
												{course.price ? `₹${course.price}` : "Free"}
											</span>
											<span className="bg-cyan-500 text-white py-2 px-4 rounded-md">
												<Link to={`/courses/${course._id}`}>Enrol Now</Link>
											</span>
										</div>
									</div>
								</motion.div>
							))
						) : (
							<div className="col-span-3 text-center py-12">
								<div className="mx-auto w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
									<BookOpen className="h-8 w-8 text-gray-400" />
								</div>
								<h3 className="text-xl font-medium text-gray-300">
									Loading courses...
								</h3>
								<p className="text-gray-400 mt-2">
									Our expert courses will appear here shortly.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* ===== LATEST ARTICLES SECTION ===== */}
			<section className="py-24 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
				<div className="container mx-auto px-4 max-w-7xl">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
						<div className="max-w-2xl">
							<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full border border-violet-500/20 text-violet-400 shadow-glow-sm backdrop-blur-sm mb-4">
								<BookOpen className="h-4 w-4" />
								<span>Latest Articles</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-purple">
								Learn from Industry Experts
							</h2>
							<p className="text-gray-300 text-lg max-w-2xl">
								Deep dives into technical concepts, interview strategies, and
								industry insights.
							</p>
						</div>
						<Link
							to="/blogs-articles"
							className="mt-4 inline-flex items-center group text-purple-500 hover:text-purple-600 transition-colors duration-300"
						>
							<span className="flex items-center gap-1">
								Read All Articles
								<ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
							</span>
						</Link>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						{articles.length > 0 ? (
							<>
								{/* Featured Article */}
								<motion.div
									className="lg:col-span-7 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-800 shadow-glow-md"
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5 }}
									viewport={{ once: true }}
								>
									<div className="aspect-[16/9] overflow-hidden">
										<img
											src={
												articles[0]?.images?.[0] ||
												"/Images/placeholder-article.jpg"
											}
											alt={articles[0]?.title}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="p-8">
										<div className="flex items-center gap-2 mb-4">
											<div className="bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full text-sm font-medium">
												{articles[0]?.category || "Programming"}
											</div>
											<span className="text-gray-400 text-sm">
												{new Date(
													articles[0]?.createdAt
												).toLocaleDateString() || "May 10, 2025"}
											</span>
										</div>
										<h3 className="text-2xl font-semibold mb-4">
											{articles[0]?.title || "Loading article..."}
										</h3>
										<p className="text-gray-300 mb-6 line-clamp-3">
											{articles[0]?.content
												?.replace(/<[^>]+>/g, "")
												.substring(0, 200) || "Article content loading..."}
										</p>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full overflow-hidden">
													<img
														src={
															articles[0]?.author?.avatar ||
															"/Images/placeholder-avatar.jpg"
														}
														alt={articles[0]?.author?.name}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="text-sm">
													<p className="text-gray-200 font-medium">
														{articles[0]?.author?.name || "KalawatiPutra Team"}
													</p>
													<p className="text-gray-400">
														{articles[0]?.author?.role || "Instructor"}
													</p>
												</div>
											</div>
											<Link
												to={`/article/${articles[0]?._id}`}
												className="text-violet-400 font-medium flex items-center gap-1 hover:underline"
											>
												<span>Read More</span>
												<ArrowRight className="h-4 w-4" />
											</Link>
										</div>
									</div>
								</motion.div>

								{/* Article List */}
								<div className="lg:col-span-5 space-y-6">
									{articles.slice(1, 4).map((article, index) => (
										<motion.div
											key={article._id || index}
											className="flex gap-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-800 shadow-glow-sm"
											initial={{ opacity: 0, x: 30 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.5, delay: index * 0.1 }}
											viewport={{ once: true }}
										>
											<div className="w-24 h-24 md:w-36 md:h-36 overflow-hidden flex-shrink-0">
												<img
													src={
														article?.images?.[0] ||
														"/Images/placeholder-article.jpg"
													}
													alt={article?.title}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="p-4 flex flex-col flex-grow overflow-hidden">
												<div className="flex items-center gap-2 mb-2">
													<div className="bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full text-xs font-medium">
														{article?.category || "Programming"}
													</div>
													<span className="text-gray-400 text-xs">
														{new Date(
															article?.createdAt
														).toLocaleDateString() || "May 10, 2025"}
													</span>
												</div>
												<h3 className="text-base md:text-lg font-semibold mb-1 line-clamp-1">
													{article?.title || "Loading article..."}
												</h3>
												<p className="text-gray-400 text-sm mb-2 line-clamp-2">
													{article?.content
														?.replace(/<[^>]+>/g, "")
														.substring(0, 100) || "Article content loading..."}
												</p>
												<Link
													to={`/article/${article?._id}`}
													className="text-violet-400 text-sm font-medium mt-auto flex items-center gap-1 hover:underline"
												>
													<span>Read More</span>
													<ArrowRight className="h-3 w-3" />
												</Link>
											</div>
										</motion.div>
									))}
								</div>
							</>
						) : (
							<div className="col-span-12 text-center py-12">
								<div className="mx-auto w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
									<BookOpen className="h-8 w-8 text-gray-400" />
								</div>
								<h3 className="text-xl font-medium text-gray-300">
									Loading articles...
								</h3>
								<p className="text-gray-400 mt-2">
									Our latest articles will appear here shortly.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* ===== CTA SECTION ===== */}
			{/* ===== CTA SECTION ===== */}
			<section className="py-24 bg-gradient-to-b from-gray-950 to-gray-900 relative overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="relative max-w-5xl mx-auto">
						{/* Decorative elements */}
						<div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
						<div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px]"></div>

						<motion.div
							className="relative z-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 border border-gray-800 shadow-glow-lg overflow-hidden"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7 }}
							viewport={{ once: true }}
						>
							{/* Background grid pattern */}
							<div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

							<div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
								<div className="flex-1 text-center md:text-left">
									<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-primary">
										Ready to Transform Your Career?
									</h2>
									<p className="text-gray-300 text-lg max-w-xl mb-8">
										Join thousands of successful students who've advanced their
										careers with our proven learning methods and mentorship.
									</p>

									<div className="flex flex-wrap gap-4 justify-center md:justify-start">
										<button
											onClick={handleStartLearning}
											className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 px-6 py-3 text-white font-semibold shadow-lg shadow-emerald-800/40 transition-all duration-300 hover:shadow-emerald-400/50 hover:scale-105"
										>
											<span>Start Learning Now</span>
											<ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
										</button>

										<button
											onClick={handleBookDemo} // Updated to use new handler
											className="inline-flex items-center justify-center rounded-2xl border border-emerald-500 px-6 py-3 text-emerald-400 font-semibold transition-all duration-300 hover:bg-emerald-500 hover:text-black hover:shadow-md hover:shadow-emerald-400/50"
										>
											<span>Book a Free Demo</span>
										</button>
									</div>
								</div>

								<div className="w-full md:w-auto flex-shrink-0">
									<div className="relative w-64 h-64 mx-auto">
										<div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 animate-pulse-slow"></div>
										<img
											src="/Images/learn.webp"
											alt="Start learning"
											className="relative z-10 w-full h-full"
										/>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ===== FAQ SECTION ===== */}
			<section className="py-24 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center mb-16">
						<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full border border-amber-500/20 text-amber-400 shadow-glow-sm backdrop-blur-sm mb-4">
							<Coffee className="h-4 w-4" />
							<span>Common Questions</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-warm">
							Frequently Asked Questions
						</h2>
						<p className="text-gray-300 text-lg max-w-2xl mx-auto">
							Find answers to common questions about our platform, courses, and
							learning experience.
						</p>
					</div>

					<div className="max-w-3xl mx-auto space-y-4">
						{faqList.map((faq, index) => (
							<Disclosure key={index}>
								{({ open }) => (
									<div className="rounded-xl border border-gray-700 bg-gray-800 transition hover:shadow-amber-500/10 shadow-sm overflow-hidden">
										<Disclosure.Button className="flex w-full justify-between items-center px-6 py-4 text-left text-amber-400 font-medium text-lg hover:bg-gray-700 transition duration-300">
											{faq.question}
											<ChevronUp
												className={`h-5 w-5 text-amber-400 transform transition-transform duration-300 ${open ? "rotate-180" : ""
													}`}
											/>
										</Disclosure.Button>
										<Disclosure.Panel className="px-6 pb-6 text-gray-300">
											{faq.answer}
										</Disclosure.Panel>
									</div>
								)}
							</Disclosure>
						))}
					</div>

					<div className="mt-20">
						<DialogBoxAds
							youtubeVideoUrlForDialogbox={youtubeVideoUrlForDialogbox}
						/>
					</div>

					<div className="mt-12">
						<Chatbot />
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;

const faqList = [
	{
		question: "What is the duration of each course?",
		answer:
			"Each course is self-paced and typically ranges from 4 to 12 weeks. You can learn at your own speed with lifetime access.",
	},
	{
		question: "Do I get a certificate after completion?",
		answer:
			"Yes! Upon successfully completing a course, you’ll receive a blockchain-verifiable certificate to showcase your skills.",
	},
	{
		question: "Is there any free demo or trial available?",
		answer:
			"Absolutely! You can book a free live demo with our mentors or explore the first few modules of every course for free.",
	},
	{
		question: "Can I get personalized mentorship?",
		answer:
			"Yes, we offer 1-on-1 mentorship sessions, career guidance, and doubt-clearing support throughout your learning journey.",
	},
	{
		question: "Are the courses beginner-friendly?",
		answer:
			"Definitely. Our platform is designed for all levels — whether you're just starting out or advancing your tech career.",
	},
];
