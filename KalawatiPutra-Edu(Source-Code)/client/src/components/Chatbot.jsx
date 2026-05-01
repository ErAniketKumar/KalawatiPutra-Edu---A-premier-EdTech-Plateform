import React, { useState, useEffect, useRef } from "react";
import { getChatbotResponse } from "../api";
import { Link } from "react-router-dom";

const Chatbot = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [chatHistory, setChatHistory] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const chatContainerRef = useRef(null);

	// Open chatbot popup after 30 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsOpen(true);
		}, 30000);
		return () => clearTimeout(timer);
	}, []);

	// Scroll to bottom of chat history
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [chatHistory]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(""); // Clear any existing error

		// Validate email/phone only for initial submission done
		if (!isSubmitted && (!email || !phone)) {
			setError("Please provide both email and phone number.");
			return;
		}

		try {
			const payload = isSubmitted ? { message } : { email, phone, message };
			const res = await getChatbotResponse(payload);

			setChatHistory((prev) => [
				...prev,
				{ role: "user", content: message || "Initial submission" },
				{ role: "bot", content: res.data.response },
			]);
			setMessage("");
			if (!isSubmitted) {
				setIsSubmitted(true);
				setEmail(""); // Clear email after submission
				setPhone(""); // Clear phone after submission
			}
		} catch (err) {
			setError(
				err.response?.data?.msg || "Failed to submit. Please try again."
			);
		}
	};

	const closeChatbot = () => {
		setIsOpen(false);
	};

	// Parse markdown links and render as <Link> for SPA navigation
	const renderMessage = (content) => {
		const linkRegex = /\[(.*?)\]\((\/(article|courses)\/([a-f\d]{24}))\)/g;
		let parts = [];
		let lastIndex = 0;
		let match;

		while ((match = linkRegex.exec(content)) !== null) {
			const [fullMatch, title, link, type, id] = match;
			parts.push(content.slice(lastIndex, match.index));
			parts.push(
				<Link
					key={match.index}
					to={link}
					className="text-emerald-500 underline"
					onClick={closeChatbot}
				>
					{title}
				</Link>
			);
			lastIndex = match.index + fullMatch.length;
		}
		parts.push(content.slice(lastIndex));
		return parts;
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{/* Chatbot Icon */}
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-transform transform hover:scale-105"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
						/>
					</svg>
				</button>
			)}

			{/* Chatbot Popup */}
			{isOpen && (
				<div className="bg-gray-800 rounded-lg shadow-xl w-80 p-6 relative">
					<button
						onClick={closeChatbot}
						className="absolute top-2 right-2 text-gray-300 hover:text-white"
					>
						<svg
							className="w-5 h-5"
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

					{!isSubmitted ? (
						<div>
							<h3 className="text-lg font-semibold mb-4 text-white">
								Welcome! Let's get started
							</h3>
							<p className="text-gray-300 mb-4">
								Please provide your email and phone number to receive
								personalized suggestions.
							</p>
							{error && <p className="text-red-400 mb-4">{error}</p>}
							<div className="space-y-4">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-500"
								/>
								<input
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="Enter your phone number"
									className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-500"
								/>
								<button
									onClick={handleSubmit}
									className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition-colors"
								>
									Submit
								</button>
							</div>
						</div>
					) : (
						<div>
							<h3 className="text-lg font-semibold mb-4 text-white">
								Chat with Us!
							</h3>
							<div
								ref={chatContainerRef}
								className="max-h-64 overflow-y-auto mb-4 custom-scrollbar"
							>
								{chatHistory.map((chat, index) => (
									<div
										key={index}
										className={`mb-2 ${chat.role === "user" ? "text-right" : "text-left"
											}`}
									>
										<p
											className={`inline-block p-2 rounded-lg ${chat.role === "user"
												? "bg-emerald-600 text-white"
												: "bg-gray-700 text-gray-200"
												}`}
										>
											{chat.role === "bot"
												? renderMessage(chat.content)
												: chat.content}
										</p>
									</div>
								))}
							</div>
							<form onSubmit={handleSubmit} className="flex space-x-2">
								<input
									type="text"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder="Ask about our content..."
									className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-500"
								/>
								<button
									type="submit"
									className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition-colors"
								>
									Send
								</button>
							</form>
							{error && <p className="text-red-400 mt-2">{error}</p>}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Chatbot;
