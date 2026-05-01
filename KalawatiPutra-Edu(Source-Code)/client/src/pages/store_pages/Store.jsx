import React, { useState, useEffect } from "react";
import { getGoodies, getCart, addToCart as addToCartAPI } from "../../api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
	ShoppingBag,
	Plus,
	Loader,
	Star,
	Search,
	X,
	Check,
	Menu,
	Filter,
} from "lucide-react";

const Store = () => {
	const [goodies, setGoodies] = useState([]);
	const [filteredGoodies, setFilteredGoodies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [addingToCart, setAddingToCart] = useState(null);
	const [cartCount, setCartCount] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [sortBy, setSortBy] = useState("name");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [priceRange, setPriceRange] = useState(5000);
	const [categories, setCategories] = useState(["All", "Apparel", "Accessories", "Tech"]);
	const navigate = useNavigate();

	const sortOptions = [
		{ value: "name", label: "Name A-Z" },
		{ value: "price-low", label: "Price: Low to High" },
		{ value: "price-high", label: "Price: High to Low" },
		{ value: "popular", label: "Most Popular" },
	];

	// Fetch goodies and initial cart count
	useEffect(() => {
		const fetchGoodies = async () => {
			setLoading(true);
			try {
				const response = await getGoodies();
				const data = response.data;
				setGoodies(data);
				setFilteredGoodies(data);

				// Dynamically derive categories
				const uniqueCategories = ["All", ...new Set(data.map(g => g.category))];
				setCategories(uniqueCategories);
			} catch (error) {
				console.error("Error fetching goodies", error);
				toast.error("Failed to load products");
			} finally {
				setLoading(false);
			}
		};

		const fetchCartCount = async () => {
			const token = localStorage.getItem("token");
			if (!token) return;
			try {
				const response = await getCart();
				setCartCount(response.data.length);
			} catch (error) {
				console.error("Error fetching cart count", error);
			}
		};

		fetchGoodies();
		fetchCartCount();
	}, []);

	// Filter and sort goodies
	useEffect(() => {
		let filtered = goodies;

		// Filter by search term
		if (searchTerm) {
			filtered = filtered.filter(
				(goodie) =>
					goodie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					goodie.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filter by category
		if (selectedCategory !== "All") {
			filtered = filtered.filter(
				(goodie) => goodie.category === selectedCategory
			);
		}

		// Filter by price range
		filtered = filtered.filter((goodie) => goodie.price <= priceRange);

		// Sort
		switch (sortBy) {
			case "price-low":
				filtered = [...filtered].sort((a, b) => a.price - b.price);
				break;
			case "price-high":
				filtered = [...filtered].sort((a, b) => b.price - a.price);
				break;
			case "popular":
				filtered = [...filtered].sort(
					(a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
				);
				break;
			default:
				filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
		}

		setFilteredGoodies(filtered);
	}, [searchTerm, selectedCategory, sortBy, priceRange, goodies]);

	// Add to cart
	const addToCart = async (goodieId) => {
		try {
			setAddingToCart(goodieId);
			const response = await addToCartAPI({ goodieId, quantity: 1 });
			setCartCount((prev) => prev + 1);
			toast.success("Item added in cart!", {
				style: {
					background: "#1a202c",
					color: "#e2e8f0",
					border: "1px solid rgba(16, 185, 129, 0.3)",
				},
			});

			const button = document.querySelector(`[data-goodie-id="${goodieId}"]`);
			if (button) {
				button.style.transform = "scale(1.2)";
				setTimeout(() => {
					button.style.transform = "scale(1)";
				}, 200);
			}
		} catch (error) {
			console.error("Error adding to cart", error);
			toast.error("Please login to add items to cart", {
				style: {
					background: "#1a202c",
					color: "#e2e8f0",
					border: "1px solid rgba(239, 68, 68, 0.3)",
				},
			});
		} finally {
			setAddingToCart(null);
		}
	};

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedCategory("All");
		setSortBy("name");
		setPriceRange(5000);
	};

	const activeFiltersCount = () => {
		let count = 0;
		if (selectedCategory !== "All") count++;
		if (searchTerm) count++;
		if (priceRange !== 5000) count++;
		if (sortBy !== "name") count++;
		return count;
	};

	const getCoinEquivalent = (price) => {
		return Math.floor(price * 10); // Standard 1 INR = 10 Coins conversion if not specified
	};

	return (
		<div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
			<Toaster position="top-right" />
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 right-10 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl animate-pulse"></div>
				<div
					className="absolute right-20 top-1/3 w-24 h-24 bg-teal-600/10 rounded-full blur-2xl animate-pulse"
					style={{ animationDelay: "2s" }}
				></div>
				<div
					className="absolute left-10 top-1/4 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl animate-pulse"
					style={{ animationDelay: "4s" }}
				></div>
			</div>

			{/* Mobile Sidebar Overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				></div>
			)}

			<div className="container mx-auto px-4 py-6 lg:py-8">
				<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
					{/* Desktop Sidebar */}
					<aside className="hidden lg:block w-80 flex-shrink-0">
						<div className="sticky top-6 bg-gray-950/95 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 shadow-lg shadow-gray-900/20">
							{/* Cart Icon in Filter Section */}
							<div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/50">
								<h2 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
									Filters
								</h2>
								<button
									onClick={() => {
										navigate("/cart");
									}}
									className="relative group p-2.5 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 hover:from-emerald-800/60 hover:to-teal-800/60 border border-emerald-700/50 rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-emerald-600/20"
								>
									<ShoppingBag className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
									{cartCount > 0 && (
										<span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce shadow-sm">
											{cartCount}
										</span>
									)}
								</button>
							</div>

							{/* Search */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-300 mb-2">
									Search Products
								</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<input
										type="text"
										placeholder="Search..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-10 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm"
									/>
									{searchTerm && (
										<button
											onClick={() => setSearchTerm("")}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									)}
								</div>
							</div>

							{/* Categories */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-300 mb-2">
									Categories
								</label>
								<div className="space-y-1">
									{categories.map((category) => (
										<button
											key={category}
											onClick={() => setSelectedCategory(category)}
											className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === category
												? "bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-400 border border-emerald-500/30"
												: "text-gray-400 hover:bg-gray-800/30 hover:text-gray-200"
												}`}
										>
											<div className="flex items-center justify-between">
												<span>{category}</span>
												{selectedCategory === category && (
													<Check className="w-4 h-4 text-emerald-400" />
												)}
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Price Range */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-300 mb-2">
									Price Range
								</label>
								<div className="space-y-3">
									<input
										type="range"
										min="0"
										max="5000"
										value={priceRange}
										onChange={(e) => setPriceRange(parseInt(e.target.value))}
										className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
									/>
									<div className="flex justify-between text-sm text-gray-400">
										<span>₹0</span>
										<span className="text-emerald-400 font-semibold">
											₹{priceRange.toLocaleString()}
										</span>
									</div>
								</div>
							</div>

							{/* Sort By */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-300 mb-2">
									Sort By
								</label>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="w-full px-3 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm"
								>
									{sortOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
											className="bg-gray-900"
										>
											{option.label}
										</option>
									))}
								</select>
							</div>

							{/* Clear Filters */}
							{activeFiltersCount() > 0 && (
								<button
									onClick={clearFilters}
									className="w-full px-4 py-2.5 text-sm text-gray-400 hover:text-gray-200 border border-gray-700/50 rounded-xl hover:border-emerald-500/30 hover:bg-gray-800/30 transition-all duration-300"
								>
									Clear All Filters ({activeFiltersCount()})
								</button>
							)}
						</div>
					</aside>

					{/* Mobile Filter Header */}
					<div className="flex lg:hidden items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<button
								onClick={() => setSidebarOpen(true)}
								className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/50 border border-gray-800/50 rounded-xl hover:bg-gray-800/30 transition-all duration-300 shadow-sm"
							>
								<Filter className="w-4 h-4 text-gray-400" />
								<span className="text-sm font-medium text-gray-300">
									Filters
								</span>
								{activeFiltersCount() > 0 && (
									<span className="bg-emerald-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
										{activeFiltersCount()}
									</span>
								)}
							</button>
						</div>

						<button
							onClick={() => {
								navigate("/cart");
							}}
							className="relative group p-2.5 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 hover:from-emerald-800/60 hover:to-teal-800/60 border border-emerald-700/50 rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-emerald-600/20"
						>
							<ShoppingBag className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
							{cartCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce shadow-sm">
									{cartCount}
								</span>
							)}
						</button>
					</div>

					{/* Mobile Sidebar */}
					<aside
						className={`fixed left-0 top-0 h-full w-80 bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/50 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
							}`}
					>
						<div className="p-6 h-full overflow-y-auto">
							{/* Mobile Sidebar Header */}
							<div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/50">
								<h2 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
									Filters
								</h2>
								<button
									onClick={() => setSidebarOpen(false)}
									className="p-2 hover:bg-gray-800/50 rounded-xl transition-colors"
								>
									<X className="w-5 h-5 text-gray-400" />
								</button>
							</div>

							{/* Mobile Search */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-300 mb-2">
									Search Products
								</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<input
										type="text"
										placeholder="Search..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-10 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm"
									/>
									{searchTerm && (
										<button
											onClick={() => setSearchTerm("")}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									)}
								</div>
							</div>

							{/* Mobile Categories */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-300 mb-2">
									Categories
								</label>
								<div className="space-y-1">
									{categories.map((category) => (
										<button
											key={category}
											onClick={() => setSelectedCategory(category)}
											className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === category
												? "bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-400 border border-emerald-500/30"
												: "text-gray-400 hover:bg-gray-800/30 hover:text-gray-200"
												}`}
										>
											<div className="flex items-center justify-between">
												<span>{category}</span>
												{selectedCategory === category && (
													<Check className="w-4 h-4 text-emerald-400" />
												)}
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Mobile Price Range */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-300 mb-2">
									Price Range
								</label>
								<div className="space-y-3">
									<input
										type="range"
										min="0"
										max="5000"
										value={priceRange}
										onChange={(e) => setPriceRange(parseInt(e.target.value))}
										className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
									/>
									<div className="flex justify-between text-sm text-gray-400">
										<span>₹0</span>
										<span className="text-emerald-400 font-semibold">
											₹{priceRange.toLocaleString()}
										</span>
									</div>
								</div>
							</div>

							{/* Mobile Sort By */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-300 mb-2">
									Sort By
								</label>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="w-full px-3 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm"
								>
									{sortOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
											className="bg-gray-900"
										>
											{option.label}
										</option>
									))}
								</select>
							</div>

							{/* Mobile Clear Filters */}
							{activeFiltersCount() > 0 && (
								<button
									onClick={clearFilters}
									className="w-full px-4 py-2.5 text-sm text-gray-400 hover:text-gray-200 border border-gray-700/50 rounded-xl hover:border-emerald-500/30 hover:bg-gray-800/30 transition-all duration-300"
								>
									Clear All Filters ({activeFiltersCount()})
								</button>
							)}
						</div>
					</aside>

					{/* Main Content */}
					<main className="flex-1 min-w-0">
						{/* Results Header */}
						<div className="mb-6">
							<h1 className="text-2xl lg:text-3xl font-bold text-gray-100 mb-2">
								{searchTerm ? `Results for "${searchTerm}"` : "Our Products"}
							</h1>
							<p className="text-gray-400">
								{filteredGoodies.length}{" "}
								{filteredGoodies.length === 1 ? "product" : "products"} found
							</p>
						</div>

						{/* Products Grid */}
						{loading ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="bg-gray-900/40 rounded-2xl border border-gray-800/50 h-[380px] animate-pulse overflow-hidden">
										<div className="bg-gray-800 h-48 lg:h-56 w-full"></div>
										<div className="p-5 space-y-4">
											<div className="h-6 bg-gray-800 rounded w-3/4"></div>
											<div className="h-4 bg-gray-800 rounded w-1/4"></div>
											<div className="flex justify-between items-center pt-2">
												<div className="space-y-2">
													<div className="h-6 bg-gray-800 rounded w-20"></div>
													<div className="h-4 bg-gray-800 rounded w-16"></div>
												</div>
												<div className="h-10 w-10 bg-gray-800 rounded-xl"></div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
								{filteredGoodies.map((goodie, index) => (
									<div
										key={goodie._id}
										className="group bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-emerald-600/20 hover:border-emerald-500/30 hover:bg-gradient-to-br hover:from-emerald-600/20 hover:to-teal-600/20 backdrop-blur-sm hover:-translate-y-1"
										style={{ animationDelay: `${index * 50}ms` }}
									>
										<div className="relative overflow-hidden h-48 lg:h-56">
											<img
												src={goodie.image}
												alt={goodie.name}
												className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
												<div className="absolute bottom-4 left-4 right-4">
													<p className="text-gray-200 text-sm leading-relaxed">
														{goodie.description}
													</p>
												</div>
											</div>
											{goodie.isPopular && (
												<div className="absolute top-3 right-3">
													<div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 rounded-full backdrop-blur-sm shadow-sm">
														<Star className="w-3 h-3 text-white fill-current" />
														<span className="text-white text-xs font-bold">
															Popular
														</span>
													</div>
												</div>
											)}
										</div>

										<div className="p-5">
											<div className="flex justify-between items-start mb-4">
												<div className="flex-1">
													<h3 className="text-lg font-bold text-gray-100 mb-1 group-hover:text-emerald-400 transition-colors line-clamp-1">
														{goodie.name}
													</h3>
													<span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
														{goodie.category}
													</span>
												</div>
											</div>

											<div className="flex justify-between items-center">
												<div className="space-y-1">
													<p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
														₹{goodie.price.toLocaleString()}
													</p>
													<div className="flex items-center gap-1.5 text-xs text-emerald-400/80 font-medium">
														<Star className="w-3 h-3 fill-current" />
														<span>{goodie.coinPrice || getCoinEquivalent(goodie.price)} coins</span>
													</div>
												</div>

												<button
													data-goodie-id={goodie._id}
													onClick={() => addToCart(goodie._id)}
													disabled={addingToCart === goodie._id}
													className={`group/btn relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 transform hover:scale-110 ${addingToCart === goodie._id
														? "bg-emerald-800/50 cursor-not-allowed"
														: "bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25"
														}`}
												>
													{addingToCart === goodie._id ? (
														<Loader className="w-4 h-4 animate-spin text-emerald-400" />
													) : (
														<Plus className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
													)}
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Empty State */}
						{!loading && filteredGoodies.length === 0 && (
							<div className="text-center py-16">
								<div className="inline-flex items-center justify-center p-6 bg-gray-900/50 rounded-2xl mb-4 border border-gray-800/50">
									<Search className="w-10 h-10 text-gray-400" />
								</div>
								<h2 className="text-2xl font-bold text-gray-100 mb-3">
									No Products Found
								</h2>
								<p className="text-gray-400 mb-6 max-w-md mx-auto">
									{searchTerm
										? `No products match "${searchTerm}". Try adjusting your search or filters.`
										: "No products available at the moment. Please check back soon!"}
								</p>
								{activeFiltersCount() > 0 && (
									<button
										onClick={clearFilters}
										className="px-6 py-3 bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-semibold"
									>
										Clear All Filters
									</button>
								)}
							</div>
						)}
					</main>
				</div>
			</div>

			<style jsx>{`
				.slider::-webkit-slider-thumb {
					appearance: none;
					height: 18px;
					width: 18px;
					border-radius: 50%;
					background: linear-gradient(45deg, #10b981, #14b8a6);
					cursor: pointer;
					box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4),
						0 0 12px rgba(16, 185, 129, 0.2);
				}
				.slider::-moz-range-thumb {
					height: 18px;
					width: 18px;
					border-radius: 50%;
					background: linear-gradient(45deg, #10b981, #14b8a6);
					cursor: pointer;
					border: none;
					box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4),
						0 0 12px rgba(16, 185, 129, 0.2);
				}
				.line-clamp-1 {
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
		</div>
	);
};

export default Store;
