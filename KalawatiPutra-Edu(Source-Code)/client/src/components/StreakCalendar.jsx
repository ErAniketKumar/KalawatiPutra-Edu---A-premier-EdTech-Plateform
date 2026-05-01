import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StreakCalendar = ({ streaks = [] }) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const currentYearNum = today.getFullYear();
	const [selectedYear, setSelectedYear] = useState(currentYearNum);

	// Calculate available years based on streaks history
	const years = useMemo(() => {
		const streakYears = streaks.map(s => new Date(s.date).getFullYear());
		const minYear = Math.min(currentYearNum, ...streakYears);
		const yearList = [];
		for (let y = currentYearNum; y >= minYear; y--) {
			yearList.push(y);
		}
		return yearList;
	}, [streaks, currentYearNum]);

	// Generate dates for selected year (January 1 to December 31)
	const generateYearDates = () => {
		const dates = [];
		const startDate = new Date(selectedYear, 0, 1); // January 1st of selected year
		const endDate = new Date(selectedYear, 11, 31); // December 31st of selected year

		const current = new Date(startDate);
		while (current <= endDate) {
			dates.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}

		return dates;
	};

	// Check if a date is actively in the future (to prevent rendering empty boxes as "missed" if they haven't happened yet)
	// Actually, current implementation just renders standard boxes.
	// We might want to dim future dates if selectedYear === currentYear.

	const dates = generateYearDates();

	const isActiveDay = (date) => {
		return streaks.some(
			(streak) => new Date(streak.date).toDateString() === date.toDateString()
		);
	};

	// Get activity details for a specific date
	const getActivityDetails = (date) => {
		const streak = streaks.find(
			(streak) => new Date(streak.date).toDateString() === date.toDateString()
		);
		return streak ? streak.activities : [];
	};

	// Group dates by week starting from the first week of January
	const getWeekData = () => {
		const weeks = [];
		let currentWeek = [];

		// Start with January 1st and find what day of week it is
		const firstDate = dates[0];
		const dayOfWeek = firstDate.getDay(); // 0 = Sunday

		// Add empty cells for days before January 1st
		for (let i = 0; i < dayOfWeek; i++) {
			currentWeek.push(null);
		}

		dates.forEach((date) => {
			currentWeek.push(date);

			if (currentWeek.length === 7) {
				weeks.push([...currentWeek]);
				currentWeek = [];
			}
		});

		// Fill the last week if needed
		if (currentWeek.length > 0) {
			while (currentWeek.length < 7) {
				currentWeek.push(null);
			}
			weeks.push(currentWeek);
		}

		return weeks;
	};

	const weekData = getWeekData();

	// Get month labels positioned correctly for the year view
	const getMonthLabels = () => {
		const labels = [];
		const months = [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];
		let seenMonths = new Set();

		weekData.forEach((week, weekIndex) => {
			const firstDate = week.find(date => date !== null);
			if (firstDate) {
				const month = firstDate.getMonth();
				if (!seenMonths.has(month)) {
					labels.push({
						index: weekIndex, // direct horizontal index for positioning
						label: months[month],
					});
					seenMonths.add(month);
				}
			}
		});

		return labels;
	};

	const monthLabels = getMonthLabels();
	const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

	// Calculate statistics - only count days that actually have streak data
	const totalActiveDays = dates.filter((date) => isActiveDay(date)).length;

	// Calculate current streak from today backwards
	const getCurrentStreak = () => {
		let streak = 0;
		const currentDate = new Date(today);

		// Start from today and go backwards
		while (currentDate >= dates[0]) {
			if (isActiveDay(currentDate)) {
				streak++;
				currentDate.setDate(currentDate.getDate() - 1);
			} else {
				break;
			}
		}

		return streak;
	};

	const currentStreak = getCurrentStreak();

	// Calculate longest streak in the selected year
	const getLongestStreak = () => {
		let longest = 0;
		let current = 0;

		dates.forEach(date => {
			if (isActiveDay(date)) {
				current++;
				longest = Math.max(longest, current);
			} else {
				current = 0;
			}
		});

		return longest;
	};

	const longestStreak = getLongestStreak();

	const handlePrevYear = () => {
		const currentIndex = years.indexOf(selectedYear);
		if (currentIndex < years.length - 1) {
			setSelectedYear(years[currentIndex + 1]);
		}
	};

	const handleNextYear = () => {
		const currentIndex = years.indexOf(selectedYear);
		if (currentIndex > 0) {
			setSelectedYear(years[currentIndex - 1]);
		}
	};

	// Calculate completion percentage
	const completionPercentage = ((totalActiveDays / dates.length) * 100).toFixed(1);

	// Get activity intensity for better visual representation
	const getActivityIntensity = (date) => {
		const activities = getActivityDetails(date);
		if (activities.length === 0) return 0;
		if (activities.length === 1) return 1;
		if (activities.length === 2) return 2;
		return 3; // 3+ activities
	};

	return (
		<div className="mt-8 relative">
			{/* Background decorative elements */}
			<div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-cyan-900/20 to-emerald-900/20 rounded-3xl blur-3xl"></div>
			<div className="absolute -inset-4 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 rounded-3xl blur-2xl animate-pulse"></div>

			<div className="relative bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-violet-500/20 p-8 overflow-x-auto">
				{/* Decorative corner elements */}
				<div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-violet-500/20 to-transparent rounded-br-full"></div>
				<div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-tl-full"></div>

				{/* Header Section */}
				<div className="relative z-10">
					<div className="flex items-center justify-between mb-8">
						<div className="space-y-2">
							<div className="flex items-center gap-4">
								<h2 className="text-4xl font-black bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
									{selectedYear} Activity Journey
								</h2>
								<div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
									<button
										onClick={handlePrevYear}
										disabled={selectedYear === years[years.length - 1]}
										className={`p-1 rounded-md transition-colors ${selectedYear === years[years.length - 1] ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
									>
										<ChevronLeft size={20} />
									</button>
									<button
										onClick={handleNextYear}
										disabled={selectedYear === years[0]}
										className={`p-1 rounded-md transition-colors ${selectedYear === years[0] ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
									>
										<ChevronRight size={20} />
									</button>
								</div>
							</div>
							<p className="text-gray-400 text-sm font-medium tracking-wide">
								Your year of dedication and growth
							</p>
						</div>

						{/* Floating stats cards */}
						<div className="flex gap-4">
							<div className="group relative">
								<div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
								<div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-violet-500/30">
									<div className="text-center">
										<div className="text-2xl font-bold text-violet-400 mb-1">
											{totalActiveDays}
										</div>
										<div className="text-gray-300 text-xs uppercase tracking-wider font-semibold">
											Active Days
										</div>
									</div>
								</div>
							</div>

							<div className="group relative">
								<div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
								<div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/30">
									<div className="text-center">
										<div className="text-2xl font-bold text-cyan-400 mb-1">
											{currentStreak}
										</div>
										<div className="text-gray-300 text-xs uppercase tracking-wider font-semibold">
											Current
										</div>
									</div>
								</div>
							</div>

							<div className="group relative">
								<div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
								<div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-emerald-500/30">
									<div className="text-center">
										<div className="text-2xl font-bold text-emerald-400 mb-1">
											{longestStreak}
										</div>
										<div className="text-gray-300 text-xs uppercase tracking-wider font-semibold">
											Best Streak
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Progress insight bar */}
					<div className="mb-8 p-6 bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-2xl border border-gray-600/30 backdrop-blur-sm">
						<div className="flex items-center justify-between mb-3">
							<span className="text-gray-300 font-semibold">Year Progress</span>
							<span className="text-violet-400 font-bold text-lg">{completionPercentage}%</span>
						</div>
						<div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full"></div>
							<div
								className="h-full bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
								style={{ width: `${completionPercentage}%` }}
							>
								<div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
							</div>
						</div>
						<div className="flex justify-between mt-2 text-xs text-gray-400">
							<span>Jan 1</span>
							<span>{selectedYear === currentYearNum ? `Today: ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : `Active Days: ${totalActiveDays}`}</span>
							<span>Dec 31</span>
						</div>
					</div>
				</div>

				{/* Calendar Section */}
				<div className="min-w-max relative z-10">
					{/* Month labels with enhanced styling */}
					<div className="relative h-6 mb-4 ml-8">
						{monthLabels.map((month, index) => {
							const leftPosition = month.index * 20;
							return (
								<div
									key={index}
									className="absolute text-sm text-gray-300 font-bold tracking-wider hover:text-violet-400 transition-colors duration-200"
									style={{ left: `${leftPosition}px` }}
								>
									{month.label}
								</div>
							);
						})}
					</div>

					<div className="flex gap-2">
						{/* Day labels with enhanced styling */}
						<div className="flex flex-col gap-1">
							{dayLabels.map((day, index) => (
								<div
									key={index}
									className="h-4 w-6 text-xs text-gray-400 flex items-center justify-end font-semibold"
								>
									{index % 2 === 1 ? day : ""}
								</div>
							))}
						</div>

						{/* Enhanced calendar grid */}
						<div className="flex gap-1">
							{weekData.map((week, weekIndex) => (
								<div key={weekIndex} className="flex flex-col gap-1">
									{week.map((date, dayIndex) => {
										const isToday = date && date.toDateString() === today.toDateString();
										const hasActivity = date && isActiveDay(date);
										const intensity = date ? getActivityIntensity(date) : 0;

										return (
											<div
												key={dayIndex}
												className={`w-4 h-4 rounded-lg transition-all duration-300 hover:scale-125 hover:rotate-12 border relative group ${date === null
														? "bg-transparent border-transparent"
														: hasActivity
															? intensity === 1
																? "bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border-emerald-400/40 shadow-lg shadow-emerald-500/25"
																: intensity === 2
																	? "bg-gradient-to-br from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 border-cyan-400/40 shadow-lg shadow-cyan-500/25"
																	: "bg-gradient-to-br from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 border-violet-400/40 shadow-lg shadow-violet-500/25"
															: isToday
																? "bg-gradient-to-br from-amber-500/40 to-orange-500/40 border-amber-400/60 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20"
																: "bg-gradient-to-br from-slate-700/60 to-slate-600/60 hover:from-slate-600/80 hover:to-slate-500/80 border-slate-500/40 shadow-inner"
													}`}
												title={
													date
														? `${date.toDateString()}${hasActivity
															? ` ✨ Active (${getActivityDetails(date).join(", ")})`
															: isToday
																? " 🌟 Today (No activity yet)"
																: " 💤 No activity"
														}`
														: ""
												}
											>
												{/* Subtle glow effect for active days */}
												{hasActivity && (
													<div className="absolute -inset-1 bg-gradient-to-br from-emerald-400/20 to-violet-400/20 rounded-lg blur-sm -z-10"></div>
												)}

												{/* Today indicator */}
												{isToday && (
													<div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
												)}
											</div>
										);
									})}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Enhanced Legend */}
				<div className="mt-8 flex items-center justify-between text-sm relative z-10">
					<div className="flex items-center text-gray-300 font-medium">
						<span className="mr-3">Activity Level:</span>
						<div className="inline-flex gap-2">
							<div className="flex flex-col items-center gap-1">
								<div className="w-3 h-3 bg-gradient-to-br from-slate-700/60 to-slate-600/60 rounded-lg border border-slate-500/40"></div>
								<span className="text-xs text-gray-500">None</span>
							</div>
							<div className="flex flex-col items-center gap-1">
								<div className="w-3 h-3 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg shadow-sm"></div>
								<span className="text-xs text-gray-400">Low</span>
							</div>
							<div className="flex flex-col items-center gap-1">
								<div className="w-3 h-3 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg shadow-sm"></div>
								<span className="text-xs text-gray-400">Med</span>
							</div>
							<div className="flex flex-col items-center gap-1">
								<div className="w-3 h-3 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg shadow-sm"></div>
								<span className="text-xs text-gray-400">High</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-6 text-gray-400">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg shadow-sm"></div>
							<span className="font-medium">Active Day</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-gradient-to-br from-amber-500/40 to-orange-500/40 border border-amber-400/60 rounded-lg relative">
								<div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
							</div>
							<span className="font-medium">Today</span>
						</div>
					</div>
				</div>

				{/* Motivational footer */}
				<div className="mt-6 p-4 bg-gradient-to-r from-violet-900/20 via-cyan-900/20 to-emerald-900/20 rounded-xl border border-violet-500/20">
					<div className="text-center">
						<p className="text-gray-300 text-sm font-medium">
							{currentStreak > 0
								? `🔥 You're on fire! Keep the momentum going with ${currentStreak} days strong!`
								: totalActiveDays > 0
									? `💪 You've got ${totalActiveDays} active days this year. Every day counts!`
									: "🌟 Start your journey today and build an amazing streak!"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StreakCalendar;