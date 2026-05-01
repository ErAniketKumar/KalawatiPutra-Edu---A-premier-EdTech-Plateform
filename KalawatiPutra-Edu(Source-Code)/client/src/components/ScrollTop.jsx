import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			setIsVisible(window.scrollY > 300);
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div>
			<div
				className={`fixed bottom-20 right-4 z-50 transition-all duration-500 ${isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8 pointer-events-none"
					}`}
			>
				<button
					onClick={scrollToTop}
					className="bg-emerald-500 text-white rounded-full p-4 shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-110 hover:shadow-emerald-400/50 hover:shadow-xl"
					aria-label="Scroll to top"
				>
					<ArrowUp className="w-6 h-6 animate-bounce-slow" />
				</button>
			</div>
		</div>
	);
};

export default ScrollTop;
