import React, { useState, useEffect, useRef } from "react";
import { getProfile, updateProfile } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Book, Link, Edit, Save, CameraIcon } from "lucide-react";
import StreakCalendar from "../components/StreakCalendar";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

export default function UserProfile() {
	const editProfileRef = useRef(null);
	const [user, setUser] = useState(null);
	const [formData, setFormData] = useState({
		college: "",
		skills: "",
		socialLinks: { linkedin: "", github: "", twitter: "" },
		about: "",
	});
	const [profileImage, setProfileImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	// Crop related state
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
	const [cropImageSrc, setCropImageSrc] = useState(null);
	const [showCropModal, setShowCropModal] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await getProfile();
				setUser(res.data);
				setFormData({
					college: res.data.college || "",
					skills: res.data.skills?.join(", ") || "",
					socialLinks: res.data.socialLinks || {
						linkedin: "",
						github: "",
						twitter: "",
					},
					about: res.data.about || "",
				});
			} catch (err) {
				console.error("Error fetching profile:", err);
				toast.error("Failed to load profile");
			}
		};
		fetchProfile();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name in formData.socialLinks) {
			setFormData({
				...formData,
				socialLinks: { ...formData.socialLinks, [name]: value },
			});
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const fileTypes = /jpeg|jpg|png/;
			const extname = fileTypes.test(file.name.toLowerCase());
			const mimetype = fileTypes.test(file.type);
			if (!extname || !mimetype) {
				toast.error("Only JPEG, JPG, or PNG images are allowed");
				return;
			}

			const reader = new FileReader();
			reader.addEventListener("load", () => {
				setCropImageSrc(reader.result);
				setShowCropModal(true);
			});
			reader.readAsDataURL(file);
			// Reset file input value to allow selecting same file again
			e.target.value = null;
		}
	};

	const onCropComplete = (croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	};

	const handleCropSave = async () => {
		setLoading(true);
		try {
			const croppedImage = await getCroppedImg(cropImageSrc, croppedAreaPixels);

			// Create FormData to upload immediately
			const data = new FormData();
			data.append("college", formData.college);
			data.append("skills", formData.skills);
			// Process social links to ensure they are full URLs before saving crop
			const processedSocialLinks = { ...formData.socialLinks };
			if (processedSocialLinks.linkedin && !processedSocialLinks.linkedin.startsWith('http')) {
				processedSocialLinks.linkedin = `https://www.linkedin.com/in/${processedSocialLinks.linkedin}`;
			}
			if (processedSocialLinks.github && !processedSocialLinks.github.startsWith('http')) {
				processedSocialLinks.github = `https://github.com/${processedSocialLinks.github}`;
			}
			if (processedSocialLinks.twitter && !processedSocialLinks.twitter.startsWith('http')) {
				processedSocialLinks.twitter = `https://twitter.com/${processedSocialLinks.twitter}`;
			}

			data.append("socialLinks", JSON.stringify(processedSocialLinks));
			data.append("about", formData.about);
			// Append the cropped image with a filename
			data.append("profileImage", croppedImage, "profile.jpg");

			const res = await updateProfile(data);
			setUser(res.data);

			// Clear local crop state and modal
			setProfileImage(null); // Clear local preview blob since we now have the server URL in 'user'
			setShowCropModal(false);

			toast.success("Profile image updated successfully!");
		} catch (e) {
			console.error("Error saving cropped image:", e);
			toast.error("Failed to save profile image");
		} finally {
			setLoading(false);
		}
	};

	const handleCropCancel = () => {
		setCropImageSrc(null);
		setShowCropModal(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const data = new FormData();
		data.append("college", formData.college);
		data.append("skills", formData.skills);
		// Process social links to ensure they are full URLs before saving
		const processedSocialLinks = { ...formData.socialLinks };
		if (processedSocialLinks.linkedin && !processedSocialLinks.linkedin.startsWith('http')) {
			processedSocialLinks.linkedin = `https://www.linkedin.com/in/${processedSocialLinks.linkedin}`;
		}
		if (processedSocialLinks.github && !processedSocialLinks.github.startsWith('http')) {
			processedSocialLinks.github = `https://github.com/${processedSocialLinks.github}`;
		}
		if (processedSocialLinks.twitter && !processedSocialLinks.twitter.startsWith('http')) {
			processedSocialLinks.twitter = `https://twitter.com/${processedSocialLinks.twitter}`;
		}

		data.append("socialLinks", JSON.stringify(processedSocialLinks));
		data.append("about", formData.about);
		if (profileImage) data.append("profileImage", profileImage);

		try {
			const res = await updateProfile(data);
			setUser(res.data);
			setIsEditing(false);
			toast.success("Profile updated successfully!");
		} catch (err) {
			console.error("Error updating profile:", err);
			toast.error("Failed to update profile");
		} finally {
			setLoading(false);
		}
	};



	if (!user)
		return (
			<div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);

	return (
		<div className="bg-gray-900 text-gray-100 min-h-screen">
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
					backgroundColor: '#1f2937',
					color: '#ffffff',
					borderRadius: '8px',
					border: '1px solid #374151',
					padding: '8px',
					minHeight: '40px',
					width: '280px',
				}}
				style={{ width: '320px' }}
			/>
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-center text-emerald-400 tracking-tight">
						Your Profile
					</h1>
					<div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-700 w-32 mx-auto mt-4 rounded-full" />
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column: Profile Image and Basic Info */}
					<div className="lg:col-span-1 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
						<div className="flex flex-col items-center">
							<div className="relative group mb-6 rounded-full border-4 border-emerald-600 overflow-hidden">
								<img
									src={
										profileImage
											? URL.createObjectURL(profileImage)
											: (user.profileImage || 'https://via.placeholder.com/150')
									}
									alt="Profile"
									className="w-32 h-32 object-cover"
								/>
								<input ref={editProfileRef} onChange={handleImageChange} type="file" accept="image/*" className="hidden" />
								<button onClick={() => editProfileRef.current.click()} className="grid place-content-center absolute bottom-0 h-10 w-full bg-emerald-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
									<CameraIcon className="text-white" />
								</button>
							</div>
							<h2 className="text-2xl font-semibold text-white mb-2">{user.name}</h2>
							<p className="text-gray-400 flex items-center gap-2">
								<Mail size={16} className="text-emerald-400" /> {user.email}
							</p>
						</div>
					</div>

					{/* Right Column: Profile Details or Edit Form */}
					<div className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
						{isEditing ? (
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											College
										</label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-4">
												<Book size={18} className="text-emerald-400" />
											</span>
											<input
												type="text"
												name="college"
												value={formData.college}
												onChange={handleInputChange}
												className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
												placeholder="Enter your college"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											Skills (comma-separated)
										</label>
										<input
											type="text"
											name="skills"
											value={formData.skills}
											onChange={handleInputChange}
											className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
											placeholder="e.g., JavaScript, Python, React"
										/>
									</div>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											LinkedIn
										</label>
										<div className="flex rounded-lg bg-gray-700 border border-gray-600 focus-within:ring-2 focus-within:ring-emerald-500 overflow-hidden transition-all">
											<div className="bg-gray-800 px-3 py-3 flex items-center border-r border-gray-600">
												<Link size={16} className="text-emerald-400 mr-2" />
												<span className="text-gray-400 text-sm whitespace-nowrap">linkedin.com/in/</span>
											</div>
											<input
												type="text"
												name="linkedin"
												value={formData.socialLinks.linkedin.replace('https://linkedin.com/in/', '').replace('https://www.linkedin.com/in/', '')}
												onChange={(e) => {
													const val = e.target.value;
													setFormData({
														...formData,
														socialLinks: { ...formData.socialLinks, linkedin: val }
													});
												}}
												className="w-full bg-gray-700 text-white px-3 py-3 focus:outline-none"
												placeholder="username"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											GitHub
										</label>
										<div className="flex rounded-lg bg-gray-700 border border-gray-600 focus-within:ring-2 focus-within:ring-emerald-500 overflow-hidden transition-all">
											<div className="bg-gray-800 px-3 py-3 flex items-center border-r border-gray-600">
												<Link size={16} className="text-emerald-400 mr-2" />
												<span className="text-gray-400 text-sm whitespace-nowrap">github.com/</span>
											</div>
											<input
												type="text"
												name="github"
												value={formData.socialLinks.github.replace('https://github.com/', '').replace('https://www.github.com/', '')}
												onChange={(e) => {
													const val = e.target.value;
													setFormData({
														...formData,
														socialLinks: { ...formData.socialLinks, github: val }
													});
												}}
												className="w-full bg-gray-700 text-white px-3 py-3 focus:outline-none"
												placeholder="username"
											/>
										</div>
									</div>
								</div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Twitter / X
								</label>
								<div className="flex rounded-lg bg-gray-700 border border-gray-600 focus-within:ring-2 focus-within:ring-emerald-500 overflow-hidden transition-all">
									<div className="bg-gray-800 px-3 py-3 flex items-center border-r border-gray-600">
										<Link size={16} className="text-emerald-400 mr-2" />
										<span className="text-gray-400 text-sm whitespace-nowrap">twitter.com/</span>
									</div>
									<input
										type="text"
										name="twitter"
										value={formData.socialLinks.twitter.replace('https://twitter.com/', '').replace('https://x.com/', '').replace('https://www.twitter.com/', '')}
										onChange={(e) => {
											const val = e.target.value;
											setFormData({
												...formData,
												socialLinks: { ...formData.socialLinks, twitter: val }
											});
										}}
										className="w-full bg-gray-700 text-white px-3 py-3 focus:outline-none"
										placeholder="username"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										About
									</label>
									<textarea
										name="about"
										value={formData.about}
										onChange={handleInputChange}
										className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
										placeholder="Tell us about yourself"
										rows={5}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Profile Image
									</label>
									<input
										type="file"
										accept="image/jpeg,image/jpg,image/png"
										onChange={handleImageChange}
										className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 file:bg-emerald-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:hover:bg-emerald-500 transition-all"
									/>
								</div>
								<div className="flex justify-between gap-4">
									<button
										type="button"
										onClick={() => setIsEditing(false)}
										className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-500 transition-all flex items-center justify-center gap-2"
									>
										Cancel
									</button>
									<button
										type="submit"
										className={`flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
										disabled={loading}
									>
										<Save size={18} />
										{loading ? 'Saving...' : 'Save Changes'}
									</button>
								</div>
							</form>
						) : (
							<div className="space-y-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex items-center gap-3">
										<Book size={18} className="text-emerald-400" />
										<div>
											<span className="text-gray-300 font-medium">College: </span>
											<span className="text-gray-100">{user.college || 'Not set'}</span>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<User size={18} className="text-emerald-400" />
										<div>
											<span className="text-gray-300 font-medium">Skills: </span>
											<span className="text-gray-100">
												{user.skills?.length > 0 ? user.skills.join(', ') : 'Not set'}
											</span>
										</div>
									</div>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex items-center gap-3">
										<Link size={18} className="text-emerald-400" />
										<div>
											<span className="text-gray-300 font-medium">LinkedIn: </span>
											{user.socialLinks?.linkedin ? (
												<a
													href={user.socialLinks.linkedin}
													className="text-emerald-400 hover:underline"
													target="_blank"
													rel="noopener noreferrer"
												>
													{user.socialLinks.linkedin}
												</a>
											) : (
												<span className="text-gray-100">Not set</span>
											)}
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Link size={18} className="text-emerald-400" />
										<div>
											<span className="text-gray-300 font-medium">GitHub: </span>
											{user.socialLinks?.github ? (
												<a
													href={user.socialLinks.github}
													className="text-emerald-400 hover:underline"
													target="_blank"
													rel="noopener noreferrer"
												>
													{user.socialLinks.github}
												</a>
											) : (
												<span className="text-gray-100">Not set</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Link size={18} className="text-emerald-400" />
									<div>
										<span className="text-gray-300 font-medium">Twitter: </span>
										{user.socialLinks?.twitter ? (
											<a
												href={user.socialLinks.twitter}
												className="text-emerald-400 hover:underline"
												target="_blank"
												rel="noopener noreferrer"
											>
												{user.socialLinks.twitter}
											</a>
										) : (
											<span className="text-gray-100">Not set</span>
										)}
									</div>
								</div>
								<div className="flex items-start gap-3">
									<User size={18} className="text-emerald-400" />
									<div>
										<span className="text-gray-300 font-medium">About: </span>
										<span className="text-gray-100">{user.about || 'Not set'}</span>
									</div>
								</div>
								<button
									onClick={() => setIsEditing(true)}
									className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
								>
									<Edit size={18} />
									Edit Profile
								</button>
							</div>
						)}
					</div>

					{/* Full-width Streak Calendar */}
					<div className="lg:col-span-3">
						<StreakCalendar streaks={user?.streaks || []} />
					</div>
				</div>
			</div>


			{/* Crop Modal */}
			{
				showCropModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
						<div className="bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden border border-gray-700 shadow-2xl">
							<div className="p-4 border-b border-gray-700 flex justify-between items-center">
								<h3 className="text-xl font-semibold text-white">Crop Profile Image</h3>
								<button onClick={handleCropCancel} className="text-gray-400 hover:text-white">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className="relative h-80 w-full bg-black">
								<Cropper
									image={cropImageSrc}
									crop={crop}
									zoom={zoom}
									aspect={1}
									onCropChange={setCrop}
									onCropComplete={onCropComplete}
									onZoomChange={setZoom}
								/>
							</div>
							<div className="p-4 bg-gray-800">
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-300 mb-2">Zoom</label>
									<input
										type="range"
										value={zoom}
										min={1}
										max={3}
										step={0.1}
										aria-labelledby="Zoom"
										onChange={(e) => setZoom(e.target.value)}
										className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
									/>
								</div>
								<div className="flex justify-end gap-3">
									<button
										onClick={handleCropCancel}
										className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition"
									>
										Cancel
									</button>
									<button
										onClick={handleCropSave}
										className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
									>
										Crop & Save
									</button>
								</div>
							</div>
						</div>
					</div>
				)
			}
		</div >
	);
}