import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Navbar from "./components/Navbar";
import BlogsArticles from "./pages/articles_pages/BlogsArticles.jsx";
import CreateArticle from "./pages/articles_pages/CreateArticle.jsx";
import ArticleDetail from "./pages/articles_pages/ArticleDetail.jsx";
import Courses from "./pages/courses_pages/Courses.jsx";
import CreateCourse from "./pages/courses_pages/CreateCourse.jsx";
import Login from "./pages/authentication_pages/Login.jsx";
import Register from "./pages/authentication_pages/Register.jsx";
import UserDashboard from "./pages/UserDashboard";
import EditArticle from "./pages/articles_pages/EditArticle.jsx";
import EditCourse from "./pages/courses_pages/EditCourse.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Roadmap from "./pages/submenuPages/Roadmap";
import Dsapractice from "./pages/submenuPages/Dsapractice";
import AdmissionHelp from "./pages/submenuPages/AdmissionHelp";
import Counseling from "./pages/submenuPages/Counseling";
import Internship from "./pages/submenuPages/Internship";
import Mentorship from "./pages/submenuPages/Mentorship";
import Home from "./pages/Home";
import CourseDetail from "./pages/courses_pages/CourseDetail.jsx";
import Footer from "./components/Footer";
import ManageArticles from "./pages/admin/ManageArticles";
import ManageCourses from "./pages/admin/ManageCourses";
import EnhancedManageCourses from "./pages/admin/EnhancedManageCourses";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ResumeScreening from "./pages/ResumeScreening.jsx";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import ScrollTop from "./components/ScrollTop";
import TermsAndConditions from "./components/TermsAndConditions";
import FAQ from "./components/FAQ";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Certificate from "./pages/certificate/Certificate.jsx";
import VerifyCertificate from "./pages/certificate/VerifyCertificate.jsx";
import WorkshopCertificatePage from "./pages/certificate/WorkshopCertificatePage.jsx";
import WorkshopDashboard from "./pages/admin/WorkshopDashboard";
import ForgotPassword from "./pages/authentication_pages/ForgotPassword";
import ResetPassword from "./pages/authentication_pages/ResetPassword";
import VerifyEmail from "./pages/authentication_pages/VerifyEmail";

import UserProfile from "./pages/UserProfile";
import AuthCallback from "./pages/authentication_pages/AuthCallback.jsx";
import ReportProblemForm from "./components/ReportProblemForm";
import IssuesListManage from "./components/admin/IssuesListManage";
import ContactUs from "./pages/ContactUs";
import ContactManage from "./components/admin/ContactManage";

import WelcomeCertificateGenerator from "./components/certificate/WelcomeCertificateGenerator.jsx";

import NoticePage from "./pages/NoticePage";
// import NoticeGoodiesStore from "./pages/NoticeGoodiesStore";


import Store from './pages/store_pages/Store.jsx';
import Cart from './pages/store_pages/Cart.jsx';
import Orders from './pages/store_pages/Orders.jsx';
import ManageGoodies from './pages/admin/ManageGoodies';
import ProblemsList from './pages/Labs/ProblemsList';
import ProblemDetail from './pages/Labs/ProblemDetail';
import ManageProblems from './pages/admin/ManageProblems';
import ProblemForm from './pages/admin/ProblemForm';

import axios from "axios";
import { useEffect } from "react";

// Import DMSans via Helmet for global font loading
function App() {
	useEffect(() => {
		// Set up global axios interceptor for 401 errors
		const interceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response && error.response.status === 401) {
					// Token expired or invalid
					localStorage.removeItem("token");
					// Use window.location for a clean state reset on force logout
					if (window.location.pathname !== "/login") {
						window.location.href = "/login?expired=true";
					}
				}
				return Promise.reject(error);
			}
		);

		return () => axios.interceptors.response.eject(interceptor);
	}, []);

	return (
		<HelmetProvider>
			<Router>
				<div className="min-h-screen bg-gray-100 font-outfit">
					{/* Load DMSans from Google Fonts */}
					<Helmet>
						<link
							href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
							rel="stylesheet"
						/>
						<style>
							{`
      body {
        font-family: 'Outfit', sans-serif;
      }
    `}
						</style>
					</Helmet>
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/blogs-articles" element={<BlogsArticles />} />
						<Route path="/services" element={<Services />} />
						<Route path="/contact" element={<ContactUs />} />

						<Route
							path="/labs"
							element={
								<ProtectedRoute>
									<ProblemsList />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/labs/problem/:slug"
							element={
								<ProtectedRoute>
									<ProblemDetail />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/terms-and-conditions"
							element={<TermsAndConditions />}
						/>
						<Route path="/privacy-policy" element={<PrivacyPolicy />} />
						<Route path="/faq" element={<FAQ />} />
						<Route path="/forgot-password" element={<ForgotPassword />} />

						<Route path="/reset-password" element={<ResetPassword />} />
						<Route path="/verify-email" element={<VerifyEmail />} />

						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<UserProfile />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/workshop-certificate"
							element={
								<ProtectedRoute>
									<WorkshopCertificatePage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/welcome-certificate"
							element={
								<ProtectedRoute>
									<WelcomeCertificateGenerator />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/cart"
							element={
								<ProtectedRoute>
									<Cart />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/orders"
							element={
								<ProtectedRoute>
									<Orders />
								</ProtectedRoute>
							}
						/>


						<Route
							path="/create-article"
							element={
								<ProtectedRoute>
									<CreateArticle />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/article/:id"
							element={
								<ProtectedRoute>
									<ArticleDetail />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/courses/:id"
							element={<CourseDetail />}
						/>
						<Route path="/courses" element={<Courses />} />
						<Route
							path="/create-course"
							element={
								<ProtectedRoute>
									<CreateCourse />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/courses/create"
							element={
								<ProtectedRoute>
									<CreateCourse />
								</ProtectedRoute>
							}
						/>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/auth/callback" element={<AuthCallback />} />
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<UserDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/report-problem"
							element={
								<ProtectedRoute>
									<ReportProblemForm />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/edit-article/:id"
							element={
								<ProtectedRoute>
									<EditArticle />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/edit-course/:id"
							element={
								<ProtectedRoute>
									<EditCourse />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/courses/edit/:id"
							element={
								<ProtectedRoute>
									<EditCourse />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/roadmap"
							element={
								<ProtectedRoute>
									<Roadmap />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/dsapractice"
							element={
								<ProtectedRoute>
									<Dsapractice />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admissionhelp"
							element={
								<ProtectedRoute>
									<AdmissionHelp />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/counseling"
							element={
								<ProtectedRoute>
									<Counseling />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/internship"
							element={
								<ProtectedRoute>
									<Internship />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/mentorship"
							element={
								<ProtectedRoute>
									<Mentorship />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/certificate"
							element={
								<ProtectedRoute>
									<Certificate />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/verify-certificate"
							element={
								<ProtectedRoute>
									<VerifyCertificate />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/dashboard"
							element={
								<ProtectedRoute>
									<AdminDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/manage-articles"
							element={
								<ProtectedRoute>
									<ManageArticles />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/manage-courses"
							element={
								<ProtectedRoute>
									<EnhancedManageCourses />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/workshop"
							element={
								<ProtectedRoute>
									<WorkshopDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/manage-problems"
							element={
								<ProtectedRoute>
									<ManageProblems />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/problems/create"
							element={
								<ProtectedRoute>
									<ProblemForm />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/problems/edit/:slug"
							element={
								<ProtectedRoute>
									<ProblemForm />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/manage-articles"
							element={
								<ProtectedRoute>
									<ManageArticles />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/issue-management"
							element={
								<ProtectedRoute>
									<IssuesListManage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/contact-message-management"
							element={
								<ProtectedRoute>
									<ContactManage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/manage-goodies"
							element={
								<ProtectedRoute>
									<ManageGoodies />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/resume-interview-prep"
							element={
								<ProtectedRoute>
									<ResumeScreening />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/store"
							element={
								<ProtectedRoute>
									<Store />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/cart"
							element={
								<ProtectedRoute>
									<Cart />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/orders"
							element={
								<ProtectedRoute>
									<Orders />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/notice-page"
							element={
								<ProtectedRoute>
									<NoticePage />
								</ProtectedRoute>
							}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>
					<Footer />
				</div>
				{/* Back to Top Button  */}
				<ScrollTop />
			</Router>
		</HelmetProvider>
	);
}
export default App;
