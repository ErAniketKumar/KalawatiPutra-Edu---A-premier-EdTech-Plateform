const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { updateStreak } = require("./streakController");

const Enrollment = require("../models/Enrollment");
const Article = require("../models/Article");
const Certificate = require("../models/Certificate");

const Course = require('../models/Course');

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST || "smtp.hostinger.com",
	port: parseInt(process.env.EMAIL_PORT) || 465,
	secure: process.env.EMAIL_PORT === "465", // true for 465
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	pool: true,
	maxConnections: 5,
	debug: process.env.EMAIL_DEBUG === "true", // Enable debug logs
	logger: process.env.EMAIL_DEBUG === "true", // Log SMTP interactions
	tls: {
		rejectUnauthorized: false, // Relax TLS for Hostinger
		ciphers: "SSLv3", // Compatibility fallback
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.error("Email transporter configuration error:", error.message);
	} else {
		console.log("Email transporter is ready");
	}
});

// Register
exports.register = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) return res.status(400).json({ msg: "User already exists" });

		const emailVerificationToken = crypto.randomBytes(20).toString("hex");
		user = new User({
			name,
			email,
			password,
			role: "user",
			emailVerificationToken,
			emailVerified: false,
		});
		user.password = await bcrypt.hash(password, 10);
		await user.save();

		const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
		const verificationUrl = `${frontendUrl}/verify-email?token=${emailVerificationToken}`;
		const mailOptions = {
			from: `"KalawatiPutra Edu" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: "Verify Your Email - KalawatiPutra Edu",
			html: `Click <a href="${verificationUrl}">here</a> to verify your email. Link expires in 24 hours.`,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Registration email sent:", {
			messageId: info.messageId,
			accepted: info.accepted,
			rejected: info.rejected,
			response: info.response,
		});

		res.json({
			msg: "Registration successful. Please check your email to verify your account.",
		});
	} catch (err) {
		console.error("Register Error:", {
			message: err.message,
			code: err.code,
			command: err.command,
			stack: err.stack,
		});
		if (
			err.code === "ECONNREFUSED" ||
			err.code === "EAUTH" ||
			err.command === "CONN"
		) {
			return res
				.status(500)
				.json({
					msg: "Failed to send verification email. Please try again later.",
				});
		}
		res.status(500).json({ msg: "Server error" });
	}
};

// Login
exports.login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ msg: "Invalid credentials" });

		if (!user.googleId && !user.emailVerified) {
			return res
				.status(403)
				.json({ msg: "Please verify your email before logging in" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

		const payload = { userId: user._id, role: user.role };
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.json({ token });
		await updateStreak(user._id, "user_login");
	} catch (err) {
		console.error("Login Error:", err.message);
		res.status(500).json({ msg: "Server error" });
	}
};

// Verify Email
exports.verifyEmail = async (req, res) => {
	const { token } = req.query;
	try {
		const user = await User.findOne({ emailVerificationToken: token });
		if (!user) {
			return res
				.status(400)
				.json({ msg: "Invalid or expired verification token" });
		}

		user.emailVerified = true;
		user.emailVerificationToken = undefined;
		await user.save();

		const payload = { userId: user._id, role: user.role };
		const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({ msg: "Email verified successfully", token: jwtToken });
	} catch (err) {
		console.error("Verify Email Error:", err.message);
		res.status(500).json({ msg: "Server error" });
	}
};

// Get Profile
exports.getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId)
			.select("-password")
			.populate("streaks", "date activities");
		if (!user) return res.status(404).json({ msg: "User not found" });
		res.json(user);
	} catch (err) {
		console.error("Get Profile Error:", err.message);
		res.status(500).json({ msg: "Server error" });
	}
};

// Google Auth
exports.googleAuth = async (req, res) => {
	try {
		const { googleId, email, name } = req.user;
		let user = await User.findOne({ googleId });
		if (!user) {
			user = await User.findOne({ email });
			if (user) {
				user.googleId = googleId;
				await user.save();
			} else {
				user = new User({ name, email, googleId, role: "user" });
				await user.save();
				await updateStreak(user._id, "google_login");
			}
		}

		const payload = { userId: user._id, role: user.role };
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
		res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
	} catch (err) {
		console.error("Google Auth Error:", err.message);
		res.status(500).json({ msg: "Server error" });
	}
};

// Update Profile
exports.updateProfile = async (req, res) => {
	const { college, skills, socialLinks, about } = req.body;
	let profileImage;

	try {
		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				folder: `${process.env.CLOUDINARY_KEY_NAME}/profiles`,
				transformation: [{ width: 200, height: 200, crop: "fill" }],
			});
			profileImage = result.secure_url;
		}

		const updateData = {
			college,
			skills: skills ? skills.split(",").map((skill) => skill.trim()) : [],
			socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
			about,
			...(profileImage && { profileImage }),
		};

		const user = await User.findByIdAndUpdate(
			req.user.userId,
			{ $set: updateData },
			{ new: true }
		).select("-password");

		if (!user) return res.status(404).json({ msg: "User not found" });
		res.json(user);
	} catch (err) {
		console.error("Update Profile Error:", err.message);
		res.status(500).json({ msg: "Server error" });
	}
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ msg: "Email not registered" });
		}

		const token = crypto.randomBytes(20).toString("hex");
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		await user.save();

		const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
		const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
		const mailOptions = {
			from: `"KalawatiPutra Edu" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: "Password Reset - KalawatiPutra",
			html: `Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.`,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Password reset email sent:", {
			messageId: info.messageId,
			accepted: info.accepted,
			rejected: info.rejected,
			response: info.response,
		});

		res.json({ msg: "Password reset link sent to email" });
	} catch (err) {
		console.error("Forgot Password Error:", {
			message: err.message,
			code: err.code,
			command: err.command,
			stack: err.stack,
		});
		if (
			err.code === "ECONNREFUSED" ||
			err.code === "EAUTH" ||
			err.command === "CONN"
		) {
			return res
				.status(500)
				.json({
					msg: "Failed to send password reset email. Please try again later.",
				});
		}
		res.status(500).json({ msg: "Server error" });
	}
};

// Reset Password
exports.resetPassword = async (req, res) => {
	const { token, password } = req.body;
	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user) {
			return res.status(400).json({ msg: "Invalid or expired token" });
		}

		user.password = await bcrypt.hash(password, 10);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();
		res.json({ msg: "Password updated successfully" });
	} catch (err) {
		console.error("Reset Password Error:", err.message);
		res.status(500).json({ msg: "Server error" });
	}
};

exports.getUserProfileStats = async (req, res) => {
	try {

		const userId = req.user.userId; // From auth middleware
		// Fetch enrolled courses
		let enrollments = [];
		try {
			enrollments = await Enrollment.find({ user: userId }).populate("course");
		} catch (err) {
			console.error("Enrollment query error:", err.message);
		}
        
		const enrolledCourses = enrollments.map((enrollment) => ({
			title: enrollment.course?.title,
			enrolledAt: enrollment.enrolledAt || new Date(),
		}));
		const totalEnrolled = enrollments.length;

		// Fetch created articles
		let totalArticles = 0;
		try {
			totalArticles = await Article.countDocuments({ author: userId });
		} catch (err) {
			console.error("Article query error:", err.message);
		}

		// Fetch certificates
		let certificates = [];
		try {
			certificates = await Certificate.find({ userId });
			// console.log("Certificates found:", certificates.length);
		} catch (err) {
			console.error("Certificate query error:", err.message);
		}
		const totalCertificates = certificates.length;

		// Compute profile completeness
		let user = null;
		try {
			user = await User.findById(userId);
			// console.log("User data:", user ? "Found" : "Not found");
		} catch (err) {
			console.error("User query error:", err.message);
		}
		let completeness = 0;
		if (user) {
			if (user.name) completeness += 20;
			if (user.email && user.emailVerified) completeness += 20;
			if (user.phoneNumber) completeness += 10;
			if (user.profileImage) completeness += 10;
			if (user.college) completeness += 10;
			if (user.skills && user.skills.length > 0) completeness += 10;
			if (user.about) completeness += 10;
			if (
				user.socialLinks &&
				(user.socialLinks.linkedin ||
					user.socialLinks.github ||
					user.socialLinks.twitter)
			)
				completeness += 10;
		}
        
		res.json({
			enrolledCourses: { total: totalEnrolled, list: enrolledCourses },
			createdArticles: totalArticles,
			certificates: totalCertificates,
			profileCompleteness: completeness,
		});
	} catch (err) {
		console.error("Error in getUserProfileStats:", err.message, err.stack);
		res.status(500).json({ msg: "Server error" });
	}
};
