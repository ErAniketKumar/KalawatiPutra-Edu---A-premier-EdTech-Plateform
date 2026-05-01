const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String }, // Optional for OAuth users
	phoneNumber: { type: String, unique: true, sparse: true }, // Optional for OAuth users
	googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
	role: { type: String, enum: ["user", "admin"], default: "user" },
	profileImage: { type: String }, // Cloudinary URL
	college: { type: String },
	skills: [{ type: String }],
	socialLinks: {
		linkedin: { type: String },
		github: { type: String },
		twitter: { type: String },
	},
	about: { type: String },
	createdAt: { type: Date, default: Date.now },
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date },
	emailVerificationToken: { type: String }, // New field for verification token
	emailVerified: { type: Boolean, default: false }, // New field for verification status
	streaks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Streak",
		},
	],
	pinnedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
	// New fields for store functionality
	cart: [
		{
			goodie: { type: mongoose.Schema.Types.ObjectId, ref: "Goodie" },
			quantity: { type: Number, default: 1 },
		},
	],
	coins: { type: Number, default: 0 }, // Coins based on streaks
	orders: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
		},
	],
});

module.exports = mongoose.model("User", userSchema);
