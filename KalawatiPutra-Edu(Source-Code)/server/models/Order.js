const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	items: [
		{
			goodie: { type: mongoose.Schema.Types.ObjectId, ref: "Goodie" },
			quantity: { type: Number, required: true },
			price: { type: Number, required: true }, // Price at time of purchase
			coinPrice: { type: Number, required: true }, // Coin price at time of purchase
		},
	],
	totalPrice: { type: Number, required: true },
	totalCoinPrice: { type: Number, required: true },
	shippingAddress: {
		name: { type: String, required: true },
		mobile: { type: String, required: true },
		address: { type: String, required: true },
		pincode: { type: String, required: true },
	},
	paymentMethod: { type: String, enum: ["money", "coin"], required: true },
	orderId: { type: String, unique: true, required: true },
	status: {
		type: String,
		enum: ["pending", "processing", "shipped", "delivered"],
		default: "pending",
	},
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);