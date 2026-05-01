import React from "react";
import {
	ShoppingBag,
	Sparkles,
	Code,
	Users,
	BookOpen,
	Briefcase,
	Bell,
	Zap,
} from "lucide-react";

const NoticePage = ({ setCurrentPage }) => (
	<div className="bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 min-h-screen pb-20">
		{/* Header */}
		<header className="backdrop-blur-md bg-black/40 border-b border-purple-700/50">
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-teal-900/50">
						<Bell className="w-6 h-6 text-white" />
					</div>
					<h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
						Notice Board
					</h1>
				</div>
			</div>
		</header>

		{/* Hero Section with Animated Gradient Background */}
		<div className="relative overflow-hidden py-20">
			<div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 opacity-90"></div>
			<div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] bg-center opacity-5"></div>

			{/* Animated Glow Elements */}
			<div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
			<div
				className="absolute -right-20 top-40 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl animate-pulse"
				style={{ animationDelay: "2s" }}
			></div>

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-4xl mx-auto text-center">
					<div className="inline-block mb-6">
						<div className="flex items-center bg-emerald-900/30 rounded-full px-4 py-2 border border-emerald-500/20">
							<Sparkles className="h-4 w-4 text-emerald-400 mr-2" />
							<span className="text-sm font-medium text-emerald-400">
								Transformative Learning Experience
							</span>
						</div>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
						We're Growing Every{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
							Day
						</span>
					</h1>
					<p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
						Our platform is constantly evolving to serve you better. Here's what
						we're working on and what's coming next.
					</p>
				</div>
			</div>
		</div>

		{/* Main Notice */}
		<div className="bg-gradient-to-r from-emerald-700/40 to-teal-700/40 border border-purple-700/60 rounded-2xl p-8 mb-12 backdrop-blur-sm shadow-lg shadow-purple-900/50">
			<div className="flex items-start space-x-4">
				<div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full animate-pulse shadow-sm shadow-teal-900/50">
					<Zap className="w-6 h-6 text-white" />
				</div>
				<div className="flex-1">
					<h2 className="text-2xl font-extrabold text-white mb-4">
						Daily Improvements in Progress
					</h2>
					<p className="text-gray-300 text-lg leading-relaxed">
						We are improving daily and working with our own courses, DSA
						solutions, and also work for hiring partner companies. Please visit
						frequently and stay connected with us for the latest updates and
						opportunities.
					</p>
				</div>
			</div>
		</div>

		{/* Feature Cards */}
		<div className="container mx-auto px-4 mt-16">
			<div className="grid md:grid-cols-2 gap-8 mb-12">
				<div className="group bg-gradient-to-br from-emerald-700/20 to-teal-700/20 border border-purple-700/50 rounded-2xl p-6 hover:border-purple-600/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-md shadow-purple-900/30">
					<div className="flex items-center space-x-3 mb-4">
						<div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-teal-900/50">
							<BookOpen className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-lg font-bold text-white">Custom Courses</h3>
					</div>
					<p className="text-gray-300">
						Developing comprehensive courses tailored to industry needs and
						current market demands.
					</p>
				</div>

				<div className="group bg-gradient-to-br from-teal-700/20 to-emerald-700/20 border border-purple-700/50 rounded-2xl p-6 hover:border-purple-600/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-md shadow-purple-900/30">
					<div className="flex items-center space-x-3 mb-4">
						<div className="p-2 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-teal-900/50">
							<Code className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-lg font-bold text-white">DSA Solutions</h3>
					</div>
					<p className="text-gray-300">
						Building a comprehensive library of Data Structures and Algorithms
						solutions with detailed explanations.
					</p>
				</div>

				<div className="group bg-gradient-to-br from-emerald-700/20 to-teal-700/20 border border-purple-700/50 rounded-2xl p-6 hover:border-purple-600/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-md shadow-purple-900/30">
					<div className="flex items-center space-x-3 mb-4">
						<div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-teal-900/50">
							<Briefcase className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-lg font-bold text-white">Hiring Partners</h3>
					</div>
					<p className="text-gray-300">
						Collaborating with leading companies to create direct pathways from
						learning to employment.
					</p>
				</div>

				<div className="group bg-gradient-to-br from-teal-700/20 to-emerald-700/20 border border-purple-700/50 rounded-2xl p-6 hover:border-purple-600/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-md shadow-purple-900/30">
					<div className="flex items-center space-x-3 mb-4">
						<div className="p-2 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-teal-900/50">
							<Users className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-lg font-bold text-white">Community Growth</h3>
					</div>
					<p className="text-gray-300">
						Expanding our community features and creating more opportunities for
						peer learning and networking.
					</p>
				</div>
			</div>

			{/* Stay Connected */}
			<div className="text-center bg-gradient-to-r from-emerald-700/20 to-teal-700/20 border border-purple-700/60 rounded-2xl p-8 backdrop-blur-sm shadow-lg shadow-purple-900/50">
				<h3 className="text-2xl font-extrabold text-white mb-4">
					Stay Connected
				</h3>
				<p className="text-gray-300 mb-6">
					Don't miss out on our latest updates, new course releases, and
					exclusive opportunities with our hiring partners.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="https://chat.whatsapp.com/CqgVBTvCRSmDj6O7iQLHes"
						target="_blank"
						rel="noopener noreferrer"
					>
						<button className="px-6 py-3 bg-transparent border border-purple-700 text-purple-300 hover:bg-purple-700 hover:text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
							Join Community
						</button>
					</a>
				</div>
			</div>
		</div>
	</div>
);

export default NoticePage;
