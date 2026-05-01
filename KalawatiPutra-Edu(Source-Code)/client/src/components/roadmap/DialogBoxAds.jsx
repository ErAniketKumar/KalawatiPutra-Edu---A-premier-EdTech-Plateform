import React, { useEffect, useState } from "react";

function DialogBoxAds({ youtubeVideoUrlForDialogbox }) {
	const [dialogOpen, setDialogOpen] = useState(true); // Dialog opens by default
	const [isVideoInteracted, setIsVideoInteracted] = useState(false); // Track video interaction

	// On mount, check if dialog was manually closed within last 2 hours
	useEffect(() => {
		const closedUntil = localStorage.getItem("dialogClosedUntil");
		if (closedUntil && new Date().getTime() < Number(closedUntil)) {
			setDialogOpen(false);
		}
	}, []);

	// Auto-close dialog after 5 seconds if no video interaction
	useEffect(() => {
		let timer;
		if (dialogOpen && !isVideoInteracted) {
			timer = setTimeout(() => {
				setDialogOpen(false);
			}, 6000); // 6 seconds
		}

		// Cleanup timer on manual close, video interaction, or unmount
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [dialogOpen, isVideoInteracted]);

	// Handle video interaction (click or hover on video area)
	const handleVideoInteraction = () => {
		setIsVideoInteracted(true);
	};

	// Handle manual close: set localStorage to suppress dialog for 2 hours
	const handleManualClose = () => {
		const expireTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours in ms
		localStorage.setItem("dialogClosedUntil", expireTime);
		setDialogOpen(false);
	};
	return (
		<div>
			{/* Dialog Box for YouTube Video with enhanced styling */}
			{dialogOpen && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm mt-16">
					<div className="bg-gray-800/90 rounded-xl p-6 w-full max-w-xl relative shadow-2xl border border-gray-700">
						<button
							onClick={handleManualClose}
							className="absolute -top-4 -right-4 bg-gray-700 text-gray-300 hover:text-emerald-400 transition-colors w-10 h-10 rounded-full flex items-center justify-center border border-gray-600 hover:border-emerald-500"
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						<h3 className="text-2xl font-bold text-emerald-400 mb-4">
							Welcome to KalawatiPutra Edu
						</h3>
						<p className="text-gray-300 mb-4">
							Watch our introduction video to learn more about our platform and
							how we can help you succeed.
						</p>
						<div
							className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-700 shadow-lg"
							onClick={handleVideoInteraction}
							onMouseEnter={handleVideoInteraction}
						>
							<iframe
								className="w-full h-64 rounded-lg"
								src={youtubeVideoUrlForDialogbox}
								title="Admission Help Video"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						</div>
					</div>
				</div>
			)}
			{/* Other component content */}
		</div>
	);
}

export default DialogBoxAds;
