const express = require("express");
const {
	register,
	login,
	getProfile,
	googleAuth,
	updateProfile,
	forgotPassword,
	resetPassword,
	verifyEmail,
	getUserProfileStats,
} = require("../controllers/auth");
const auth = require("../middleware/auth");
const passport = require("passport");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
	"/google/callback",
	passport.authenticate("google", {
		session: false,
		failureRedirect: `${process.env.FRONTEND_URL}/login` ||
            "http://localhost:5000/login",
	}),
	googleAuth
);
router.put("/profile", auth, upload.single("profileImage"), updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail); // New route for email verification

router.get('/profile-stats', auth, getUserProfileStats);
module.exports = router;
