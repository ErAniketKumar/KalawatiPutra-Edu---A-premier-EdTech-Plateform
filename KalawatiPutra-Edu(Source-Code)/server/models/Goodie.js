const mongoose = require("mongoose");

const goodieSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true }, // Price in INR
	coinPrice: { type: Number, required: true }, // Price in coins
	image: { type: String, required: true }, // Cloudinary URL
	stock: { type: Number, required: true },
	category: { type: String, required: true }, // e.g., "T-Shirt", "Mug", etc.
	isPopular: { type: Boolean, default: false }, // For highlighting popular goodies
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Goodie", goodieSchema);