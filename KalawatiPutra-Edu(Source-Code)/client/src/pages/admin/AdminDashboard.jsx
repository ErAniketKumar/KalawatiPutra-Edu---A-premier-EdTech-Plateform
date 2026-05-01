import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api";
import RoadmapManager from "../../components/admin/RoadmapManager";
import CollegeManager from "../../components/admin/CollegeManager";
import CounselingManager from "../../components/admin/CounselingManager";
import DsapracticeManager from "../../components/admin/DsapracticeManager";
import InternshipManager from "../../components/admin/InternshipManager";
import MentorshipManager from "../../components/admin/MentorshipManager";
import AdmissionManager from "../../components/admin/AdmissionManager";
import ManageArticles from "./ManageArticles";
import EnhancedManageCourses from "./EnhancedManageCourses";
import ManageGoodies from "./ManageGoodies";
import ContactManage from "../../components/admin/ContactManage";
import ManageProblems from "./ManageProblems";
import WorkshopDashboard from "../../pages/admin/WorkshopDashboard";
import IsusesListManage from "../../components/admin/IssuesListManage";
import CounselingBookingsManager from "../../components/admin/CounselingBookingsManager";
import MentorshipBookingsManager from "../../components/admin/MentorshipBookingsManager";
import "./AdminDasboard.css"

function AdminDashboard() {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [data, setData] = useState({
		roadmaps: [],
		colleges: [],
		counselingPosts: [],
		dsapracticeQuestions: [],
		internships: [],
		mentorships: [],
		counselingBookings: [],
		mentorshipBookings: [],
		articles: [],
		courses: [],
	});
	const [loading, setLoading] = useState(true);

	// Fetch all items on mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [
					roadmapRes,
					collegeRes,
					counselingRes,
					dsapracticeRes,
					internshipRes,
					mentorshipRes,
					counselingBookingsRes,
					mentorshipBookingsRes,
					articlesRes,
					coursesRes,
				] = await Promise.all([
					api.getRoadmaps(),
					api.getColleges(),
					api.getCounselingPosts(),
					api.getDsaQuestions(),
					api.getInternships(),
					api.getMentorships(),
					api.getCounselingBookings(),
					api.getMentorshipBookings(),
					api.getAdminArticles(),
					api.getAdminCourses(),
				]);
				setData({
					roadmaps: roadmapRes.data,
					colleges: collegeRes.data,
					counselingPosts: counselingRes.data,
					dsapracticeQuestions: dsapracticeRes.data,
					internships: internshipRes.data,
					mentorships: mentorshipRes.data,
					counselingBookings: counselingBookingsRes.data.data || [],
					mentorshipBookings: mentorshipBookingsRes.data.data || [],
					articles: articlesRes.data.articles || articlesRes.data || [],
					courses: coursesRes.data.courses || coursesRes.data || [],
				});
			} catch (err) {
				console.error("Error fetching data:", err);
				const errorMsg = err.response?.data?.msg || err.response?.data?.message || err.message;
				alert(`Error fetching data: ${errorMsg}`);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Update data after create/edit/delete
	const updateData = (key, newData) => {
		setData((prev) => ({ ...prev, [key]: newData }));
	};

	const renderContent = () => {
		switch (activeTab) {
			case "roadmaps":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Manage Roadmaps
						</h2>
						<RoadmapManager
							roadmaps={data.roadmaps}
							setRoadmaps={(newData) => updateData("roadmaps", newData)}
						/>
					</div>
				);
			case "colleges":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Manage Colleges
						</h2>
						<CollegeManager
							colleges={data.colleges}
							setColleges={(newData) => updateData("colleges", newData)}
						/>
					</div>
				);
			case "counseling":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Manage Counseling
						</h2>
						<CounselingManager
							counselingPosts={data.counselingPosts}
							setCounselingPosts={(newData) =>
								updateData("counselingPosts", newData)
							}
						/>
					</div>
				);
			case "dsapractice":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<div className="flex items-center gap-3 mb-4">
							<h2 className="text-2xl font-semibold text-emerald-400">
								Manage DSA Practice
							</h2>
							{/* YouTube Icon */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-red-600 animate-pulse-slow"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
							</svg>
						</div>
						<DsapracticeManager
							dsapracticeQuestions={data.dsapracticeQuestions}
							setDsapracticeQuestions={(newData) =>
								updateData("dsapracticeQuestions", newData)
							}
						/>
					</div>
				);
			case "internships":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Manage Internships
						</h2>
						<InternshipManager
							internships={data.internships}
							setInternships={(newData) => updateData("internships", newData)}
						/>
					</div>
				);
			case "mentorships":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Manage Mentorships
						</h2>
						<MentorshipManager
							mentorships={data.mentorships}
							setMentorships={(newData) => updateData("mentorships", newData)}
						/>
					</div>
				);
			case "admissions":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Manage Admission Applications
						</h2>
						<AdmissionManager />
					</div>
				);
			case "workshop_certificate":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Manage Workshop Certificates
						</h2>
						<WorkshopDashboard />
					</div>
				);
			case "issues_list":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Issues List
						</h2>
						<IsusesListManage />
					</div>
				);
			case "contact_manage":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<ContactManage />
					</div>
				);
			case "manage_goodies":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<ManageGoodies />
					</div>
				);
			case "articles":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<ManageArticles />
					</div>
				);
			case "courses":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<EnhancedManageCourses />
					</div>
				);
			case "manage_problems":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<ManageProblems />
					</div>
				);
			case "counseling_bookings":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Counseling Bookings
						</h2>
						<CounselingBookingsManager
							bookings={data.counselingBookings}
							setBookings={(newData) => updateData("counselingBookings", newData)}
						/>
					</div>
				);
			case "mentorship_bookings":
				return (
					<div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
						<h2 className="text-2xl font-semibold mb-4 text-emerald-400">
							Mentorship Bookings
						</h2>
						<MentorshipBookingsManager
							bookings={data.mentorshipBookings}
							setBookings={(newData) => updateData("mentorshipBookings", newData)}
						/>
					</div>
				);
			default:
				return (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{ id: "roadmaps", name: "Roadmaps", count: data.roadmaps.length },
							{ id: "colleges", name: "Colleges", count: data.colleges.length },
							{
								id: "counseling",
								name: "Counseling Posts",
								count: data.counselingPosts.length,
							},
							{
								id: "counseling_bookings",
								name: "Counseling Bookings",
								count: data.counselingBookings.length,
								bgColor: "bg-blue-900 bg-opacity-20",
								textColor: "text-blue-400",
								hoverColor: "hover:bg-blue-900 hover:bg-opacity-30"
							},
							{
								id: "mentorship_bookings",
								name: "Mentorship Bookings",
								count: data.mentorshipBookings.length,
								bgColor: "bg-purple-900 bg-opacity-20",
								textColor: "text-purple-400",
								hoverColor: "hover:bg-purple-900 hover:bg-opacity-30"
							},
							{
								id: "dsapractice",
								name: "DSA Practice Questions",
								count: data.dsapracticeQuestions.length,
								icon: true,
							},
							{
								id: "internships",
								name: "Internships",
								count: data.internships.length,
							},
							{
								id: "mentorships",
								name: "Mentorships",
								count: data.mentorships.length,
							},
							{ id: "admissions", name: "Admission Applications" },
							{ id: "workshop_certificate", name: "Workshop Certificate" },
							{ id: "issues_list", name: "Issues List" },
							{ id: "contact_manage", name: "Contact Messages" },
							{ id: "manage_goodies", name: "Manage Goodies" },
							{ id: "contact_manage", name: "Contact Messages" },
							{ id: "manage_goodies", name: "Manage Goodies" },
							{ id: "manage_problems", name: "Manage Problems" },
							{ id: "articles", name: "Articles", count: data.articles.length },
							{ id: "courses", name: "Courses", count: data.courses.length },
						].map((item) => (
							<div
								key={item.id}
								className={`${item.bgColor || 'bg-black bg-opacity-70'} p-6 rounded-lg shadow-card backdrop-blur-sm ${item.hoverColor || 'hover:bg-emerald-900 hover:bg-opacity-20'} transform transition-all duration-300 hover:scale-[1.02] cursor-pointer relative group`}
								onClick={() => setActiveTab(item.id)}
							>
								<div className="flex items-center justify-between">
									<h3 className={`text-xl font-medium ${item.textColor || 'text-emerald-400'} group-hover:text-emerald-300`}>
										{item.name}
									</h3>
									{item.icon && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-red-600 animate-pulse-slow"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
										</svg>
									)}
								</div>
								{item.count !== undefined && (
									<p className="mt-2 text-emerald-200">{item.count} items</p>
								)}
								<div className="absolute inset-0 border border-emerald-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>
						))}
					</div>
				);
		}
	};

	return (
		<div className="bg-[#000] min-h-screen py-8 px-4 sm:px-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-10 relative">
					<h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500 inline-block pb-1">
						Admin Dashboard
					</h1>
					<div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded animate-shimmer"></div>
				</div>

				{/* Navigation Tabs */}
				<div className="mb-8 border-b border-gray-800">
					<nav className="flex space-x-4 overflow-x-auto pb-1">
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "dashboard"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("dashboard")}
						>
							Dashboard Overview
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "roadmaps"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("roadmaps")}
						>
							Roadmaps
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "colleges"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("colleges")}
						>
							Colleges
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "counseling"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("counseling")}
						>
							Counseling
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium flex items-center gap-2 ${activeTab === "dsapractice"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("dsapractice")}
						>
							DSA Practice
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 text-red-600 animate-pulse-slow"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
							</svg>
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "internships"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("internships")}
						>
							Internships
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "mentorships"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("mentorships")}
						>
							Mentorships
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "counseling_bookings"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("counseling_bookings")}
						>
							Counseling Bookings
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "mentorship_bookings"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("mentorship_bookings")}
						>
							Mentorship Bookings
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "admissions"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("admissions")}
						>
							Admissions
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "workshop_certificate"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("workshop_certificate")}
						>
							Workshop-Certificate
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "issues_list"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("issues_list")}
						>
							Issues List
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "contact_manage"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("contact_manage")}
						>
							Messages
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "manage_goodies"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("manage_goodies")}
						>
							Goodies
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "articles"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("articles")}
						>
							Articles
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "courses"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("courses")}
						>
							Courses
						</button>
						<button
							className={`emerald-nav-item px-3 py-2 text-sm font-medium ${activeTab === "manage_problems"
								? "text-emerald-400 active"
								: "text-gray-400"
								}`}
							onClick={() => setActiveTab("manage_problems")}
						>
							Problems
						</button>
					</nav>
				</div>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="relative w-16 h-16">
							<div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-400 border-opacity-20 rounded-full"></div>
							<div className="absolute top-0 left-0 w-full h-full border-4 border-t-emerald-500 rounded-full animate-spin"></div>
							<div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-400 border-opacity-0 rounded-full animate-ping"></div>
						</div>
					</div>
				) : (
					<div className="transition-all duration-500 transform">
						{renderContent()}
					</div>
				)}
			</div>
		</div>
	);
}

export default AdminDashboard;
