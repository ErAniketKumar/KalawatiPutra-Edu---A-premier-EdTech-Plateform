import React, { useState, useEffect } from "react";
import { getCart, removeFromCart, checkout, verifyPayment, updateCartItem } from "../../api";
import { useNavigate } from "react-router-dom";
import "../../App.css"
import {
	ShoppingBag,
	X,
	Zap,
	Gift,
	Star,
	CreditCard,
	Coins,
	ArrowLeft,
	Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		mobile: "",
		address: "",
		pincode: "",
		paymentMethod: "money",
	});
	const [completingCheckout, setCompletingCheckout] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCart = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await getCart();

				// Filter out any items with null goodie data
				const validItems = response.data.filter((item) => item.goodie !== null);
				setCartItems(validItems);
			} catch (error) {
				console.error("Error fetching cart:", error);
				setError("Failed to load cart items. Please try again.");
			} finally {
				setLoading(false);
			}
		};
		fetchCart();
	}, []);

	const removeItem = async (goodieId) => {
		try {
			await removeFromCart(goodieId);
			setCartItems(cartItems.filter((item) => item.goodie?._id !== goodieId));
		} catch (error) {
			console.error("Error removing item:", error);
			setError("Failed to remove item. Please try again.");
		}
	};

	const handleCheckout = async () => {
		if (
			!formData.name ||
			!formData.mobile ||
			!formData.address ||
			!formData.pincode
		) {
			toast.error("Please fill in all shipping details");
			return;
		}

		try {
			setCompletingCheckout(true);
			const response = await checkout({
				shippingAddress: formData,
				paymentMethod: formData.paymentMethod,
			});

			if (formData.paymentMethod === "money") {
				const { razorpayOrder, orderId } = response.data;
				const options = {
					key: import.meta.env.VITE_RAZORPAY_KEY,
					amount: razorpayOrder.amount,
					currency: "INR",
					order_id: razorpayOrder.id,
					name: "KalawatiPutra Edu",
					description: "Order Payment",
					handler: async function (response) {
						try {
							await verifyPayment({
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_order_id: response.razorpay_order_id,
								razorpay_signature: response.razorpay_signature,
								orderId,
							});
							toast.success("Order placed successfully!");
							setCartItems([]);
							navigate("/orders");
						} catch (verifyError) {
							console.error("Payment verification error:", verifyError);
							toast.error("Payment verification failed. Please contact support.");
						}
					},
					prefill: {
						name: formData.name,
						contact: formData.mobile,
					},
					theme: {
						color: "#10b981",
					},
				};
				const rzp = new window.Razorpay(options);
				rzp.on("payment.failed", function (response) {
					console.error("Razorpay payment failed:", response.error);
					toast.error("Payment failed. Please try again.");
				});
				rzp.open();
			} else {
				toast.success("Order placed successfully using coins!");
				setCartItems([]);
				navigate("/orders");
			}
		} catch (error) {
			const errorMsg = error.response?.data?.message || "Checkout failed. Please try again.";
			setError(errorMsg);
			toast.error(errorMsg);
			console.error("Checkout error:", error);
		} finally {
			setCompletingCheckout(false);
		}
	};

	const updateQuantity = async (goodieId, newQuantity) => {
		if (newQuantity < 1) return;
		try {
			await updateCartItem(goodieId, { quantity: newQuantity });
			setCartItems(
				cartItems.map((item) =>
					item.goodie._id === goodieId
						? { ...item, quantity: newQuantity }
						: item
				)
			);
		} catch (error) {
			console.error("Error updating quantity:", error);
		}
	};

	const calculateTotal = () => {
		return cartItems.reduce((total, item) => {
			return total + item.goodie.price * item.quantity;
		}, 0);
	};

	const calculateTotalCoins = () => {
		return cartItems.reduce((total, item) => {
			return total + item.goodie.coinPrice * item.quantity;
		}, 0);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
				<div className="text-center p-6 bg-gray-800/50 rounded-lg border border-red-500/50 max-w-md">
					<h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
					<p className="text-gray-300 mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 pb-20">
			<Toaster position="top-right" />
			{/* Animated Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
				<div
					className="absolute -right-20 top-40 w-72 h-72 bg-teal-600/20 rounded-full blur-3xl animate-pulse"
					style={{ animationDelay: "2s" }}
				></div>
				<div
					className="absolute -left-20 top-1/2 w-64 h-64 bg-purple-700/20 rounded-full blur-3xl animate-pulse"
					style={{ animationDelay: "4s" }}
				></div>
			</div>

			<div className="relative z-10">
				{/* Header */}
				<header className="backdrop-blur-md bg-black/40 border-b border-purple-800/50">
					<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-teal-900/50">
								<ShoppingBag className="w-6 h-6 text-white" />
							</div>
							<h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
								Your Cart
							</h1>
						</div>
						<button
							onClick={() => navigate("/store")}
							className="text-emerald-400 hover:text-teal-300 font-medium flex items-center"
						>
							<ArrowLeft className="w-4 h-4 mr-1" />
							Continue Shopping
						</button>
					</div>
				</header>

				{/* Main Content */}
				<main className="max-w-7xl mx-auto px-6 py-12">
					{cartItems.length === 0 ? (
						<div className="text-center py-20">
							<div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-emerald-700/20 to-teal-700/20 rounded-full mb-6 border border-purple-800/50">
								<ShoppingBag className="w-10 h-10 text-emerald-400" />
							</div>
							<h2 className="text-3xl font-bold text-white mb-4">
								Your Cart is Empty
							</h2>
							<p className="text-gray-400 mb-8 max-w-md mx-auto">
								Looks like you haven't added any goodies to your cart yet.
							</p>
							<button
								onClick={() => navigate("/store")}
								className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-teal-900/30"
							>
								Browse Goodies
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="lg:col-span-2">
								<div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl shadow-lg border border-purple-800/50 backdrop-blur-sm overflow-hidden">
									<div className="hidden md:grid grid-cols-12 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-4 border-b border-purple-800/50">
										<div className="col-span-6 font-medium text-emerald-400">
											Product
										</div>
										<div className="col-span-2 font-medium text-emerald-400 text-center">
											Price
										</div>
										<div className="col-span-2 font-medium text-emerald-400 text-center">
											Coins
										</div>
										<div className="col-span-2 font-medium text-emerald-400 text-center">
											Quantity
										</div>
									</div>

									{cartItems.map(
										(item) =>
											item.goodie && (
												<div
													key={item.goodie._id}
													className="p-4 border-b border-purple-800/30 last:border-b-0 group hover:bg-gradient-to-r hover:from-emerald-900/10 hover:to-teal-900/10 transition-colors"
												>
													<div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
														{/* Product Info */}
														<div className="md:col-span-6 flex items-center">
															{item.goodie.image && (
																<img
																	src={item.goodie.image}
																	alt={item.goodie.name || "Product image"}
																	className="w-16 h-16 object-cover rounded-lg mr-4 border border-purple-800/50"
																	onError={(e) => {
																		e.target.src =
																			"https://via.placeholder.com/64"; // Fallback image
																	}}
																/>
															)}
															<div>
																<h3 className="font-medium text-white">
																	{item.goodie.name || "Unnamed Product"}
																</h3>
															</div>
														</div>
														{/* Price */}
														<div className="md:col-span-2 text-center text-teal-300">
															₹{item.goodie.price * item.quantity}
														</div>
														{/* Coins */}
														<div className="md:col-span-2 text-center text-emerald-300">
															{item.goodie.coinPrice * item.quantity}
														</div>
														{/* Quantity & Remove Controls */}
														<div className="md:col-span-2 flex flex-col md:flex-row items-center justify-center gap-2">
															<div className="flex items-center gap-2">
																<button
																	onClick={() =>
																		updateQuantity(
																			item.goodie._id,
																			item.quantity - 1
																		)
																	}
																	className="px-2 py-1 bg-gray-800 rounded text-lg font-bold text-emerald-400 hover:bg-emerald-900/30"
																	aria-label="Decrease quantity"
																	disabled={item.quantity <= 1}
																>
																	−
																</button>
																<span className="mx-2">{item.quantity}</span>
																<button
																	onClick={() =>
																		updateQuantity(
																			item.goodie._id,
																			item.quantity + 1
																		)
																	}
																	className="px-2 py-1 bg-gray-800 rounded text-lg font-bold text-emerald-400 hover:bg-emerald-900/30"
																	aria-label="Increase quantity"
																>
																	+
																</button>
															</div>
															<button
																onClick={() => removeItem(item.goodie._id)}
																className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-900/30 ml-0 md:ml-4 mt-2 md:mt-0"
																aria-label="Remove item"
															>
																<X className="w-5 h-5" />
															</button>
														</div>
													</div>
												</div>
											)
									)}
								</div>
							</div>

							<div className="lg:col-span-1">
								<div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl shadow-lg border border-purple-800/50 backdrop-blur-sm p-6 sticky top-4">
									<h2 className="text-xl font-bold text-white mb-6 flex items-center">
										<Zap className="w-5 h-5 text-emerald-400 mr-2" />
										Order Summary
									</h2>

									<div className="space-y-3 mb-6">
										<div className="flex justify-between text-gray-300">
											<span>Subtotal</span>
											<span className="font-medium">₹{calculateTotal()}</span>
										</div>
										<div className="flex justify-between text-gray-300">
											<span>Total Coins</span>
											<span className="font-medium text-emerald-300">
												{calculateTotalCoins()}
											</span>
										</div>
										<div className="flex justify-between border-t border-purple-800/30 pt-3 text-gray-300">
											<span>Shipping</span>
											<span className="font-medium text-green-400">FREE</span>
										</div>
										<div className="flex justify-between border-t border-purple-800/30 pt-3 text-white">
											<span className="font-bold">Total</span>
											<span className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
												₹{calculateTotal()}
											</span>
										</div>
									</div>

									<button
										onClick={() => setShowCheckoutDialog(true)}
										className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-teal-900/30 flex items-center justify-center"
									>
										<CreditCard className="w-5 h-5 mr-2" />
										Proceed to Checkout
									</button>
								</div>
							</div>
						</div>
					)}
				</main>
			</div>

			{/* Checkout Dialog */}
			{showCheckoutDialog && (
				<div className="fixed custom-scrollbar inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl shadow-2xl border border-purple-800/50 max-w-md w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-white flex items-center">
									<Gift className="w-6 h-6 text-emerald-400 mr-2" />
									Checkout Details
								</h2>
								<button
									onClick={() => setShowCheckoutDialog(false)}
									className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50"
								>
									<X className="w-6 h-6" />
								</button>
							</div>

							<form className="space-y-5">
								<div>
									<label className="block text-sm font-medium text-gray-400 mb-2">
										Full Name
									</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										className="w-full px-4 py-3 bg-gray-800 border border-purple-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-2">
										Mobile Number
									</label>
									<input
										type="tel"
										value={formData.mobile}
										onChange={(e) =>
											setFormData({ ...formData, mobile: e.target.value })
										}
										className="w-full px-4 py-3 bg-gray-800 border border-purple-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-2">
										Shipping Address
									</label>
									<textarea
										value={formData.address}
										onChange={(e) =>
											setFormData({ ...formData, address: e.target.value })
										}
										rows={3}
										className="w-full px-4 py-3 bg-gray-800 border border-purple-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-2">
										Pincode
									</label>
									<input
										type="text"
										value={formData.pincode}
										onChange={(e) =>
											setFormData({ ...formData, pincode: e.target.value })
										}
										className="w-full px-4 py-3 bg-gray-800 border border-purple-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-2">
										Payment Method
									</label>
									<div className="space-y-3">
										<div
											className={`p-4 rounded-lg border ${formData.paymentMethod === "money"
												? "border-emerald-500 bg-emerald-900/20"
												: "border-purple-800/50 bg-gray-800"
												} cursor-pointer`}
											onClick={() =>
												setFormData({ ...formData, paymentMethod: "money" })
											}
										>
											<div className="flex items-center">
												<CreditCard className="w-5 h-5 text-emerald-400 mr-3" />
												<span className="font-medium text-white">
													Pay with Money (Razorpay)
												</span>
											</div>
										</div>
										<div
											className={`p-4 rounded-lg border ${formData.paymentMethod === "coin"
												? "border-emerald-500 bg-emerald-900/20"
												: "border-purple-800/50 bg-gray-800"
												} cursor-pointer`}
											onClick={() =>
												setFormData({ ...formData, paymentMethod: "coin" })
											}
										>
											<div className="flex items-center">
												<Coins className="w-5 h-5 text-emerald-400 mr-3" />
												<span className="font-medium text-white">
													Pay with Coins
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="pt-4 border-t border-purple-800/30">
									<button
										type="button"
										onClick={handleCheckout}
										disabled={completingCheckout}
										className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-teal-900/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{completingCheckout ? (
											<Loader2 className="w-5 h-5 mr-2 animate-spin" />
										) : (
											<Star className="w-5 h-5 mr-2" />
										)}
										{completingCheckout ? "Processing..." : "Place Order"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Cart;
