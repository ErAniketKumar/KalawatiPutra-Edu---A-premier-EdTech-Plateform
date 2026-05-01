const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const passport = require("passport");

const Goodie = require("./models/Goodie");
const Order = require("./models/Order");
const Razorpay = require("razorpay");

dotenv.config();
const app = express();

require("./config/passport");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

// Middleware
// app.use(cors());
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://kalawatiputra.vercel.app",
			"https://kalawatiputra.com",
		],
	})
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateOrderId = () => {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let orderId = "";
	for (let i = 0; i < 6; i++) {
		orderId += letters.charAt(Math.floor(Math.random() * letters.length));
	}
	for (let i = 0; i < 4; i++) {
		orderId += Math.floor(Math.random() * 10);
	}
	return orderId;
};

exports.checkout = async (req, res) => {
	try {
		const { shippingAddress, paymentMethod } = req.body;
		const user = await User.findById(req.user.id).populate("cart.goodie");

		if (user.cart.length === 0) {
			return res.status(400).json({ message: "Cart is empty" });
		}

		let totalPrice = 0;
		let totalCoinPrice = 0;
		const items = user.cart.map((item) => {
			totalPrice += item.goodie.price * item.quantity;
			totalCoinPrice += item.goodie.coinPrice * item.quantity;
			return {
				goodie: item.goodie._id,
				quantity: item.quantity,
				price: item.goodie.price,
				coinPrice: item.goodie.coinPrice,
			};
		});

		if (paymentMethod === "coin" && user.coins < totalCoinPrice) {
			return res.status(400).json({ message: "Insufficient coins" });
		}

		const orderId = generateOrderId();
		const order = new Order({
			user: req.user.id,
			items,
			totalPrice,
			totalCoinPrice,
			shippingAddress,
			paymentMethod,
			orderId,
		});

		if (paymentMethod === "money") {
			const options = {
				amount: totalPrice * 100, // Razorpay expects amount in paise
				currency: "INR",
				receipt: orderId,
			};
			const razorpayOrder = await razorpay.orders.create(options);
			order.razorpayOrderId = razorpayOrder.id;
			await order.save();

			return res.status(200).json({
				message: "Order created, proceed to payment",
				razorpayOrder,
				orderId,
			});
		} else {
			user.coins -= totalCoinPrice;
			user.cart = [];
			user.orders.push(order._id);
			await user.save();
			await order.save();
			return res.status(200).json({
				message:
					"Order placed successfully! Our team will contact you shortly.",
				orderId,
			});
		}
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.getUserOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user.id }).populate(
			"items.goodie"
		);
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate("items.goodie");
		if (!order || order.user.toString() !== req.user.id) {
			return res.status(404).json({ message: "Order not found" });
		}
		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Routes
const subscribeRoutes = require("./routes/subscribe");
const articleRoutes = require("./routes/articles");
const courseRoutes = require("./routes/courses");
const authRoutes = require("./routes/auth");
const adminArticleRoutes = require("./routes/admin/articles");
const adminCourseRoutes = require("./routes/admin/courses");
const roadmapRoutes = require("./routes/admin/roadmapRoutes");
const collegeRoutes = require("./routes/admin/collegeRoutes");
const counselingRoutes = require("./routes/admin/counselingRoutes");
const dsapracticeRoutes = require("./routes/admin/dsapracticeRoutes");
const internshipRoutes = require("./routes/admin/internshipRoutes");
const mentorshipRoutes = require("./routes/admin/mentorshipRoutes");
const chatbotRoutes = require("./routes/chatbot");
const resumeRoutes = require("./routes/resume");
const admissionRoutes = require("./routes/admissionRoutes");

const certificateRoutes = require("./routes/certificate");
const workshopCertificateRoutes = require("./routes/workshopCertificates");
const adminWorkshopRoutes = require("./routes/admin/workshop");
const welcomeCertificatesRouter = require("./routes/welcomeCertificates");

const dsaCertificateRoutes = require("./routes/certificate");
const streakRoutes = require("./routes/streak");
const issueRoutes = require("./routes/issueRoutes");

const contactRoutes = require("./routes/contactRoutes");

const goodiesRoutes = require("./routes/goodies");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

// Booking routes
const counselingBookingRoutes = require("./routes/counselingBookings");
const mentorshipBookingRoutes = require("./routes/mentorshipBookings");

// Dynamic Sitemap
const Article = require("./models/Article");
const Course = require("./models/Course");

app.get("/sitemap.xml", async (req, res) => {
	try {
		const articles = await Article.find().select("_id createdAt");
		const courses = await Course.find().select("_id createdAt");
		const baseUrl = "https://kalawatiputra.com";
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs-articles</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/courses</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/admissionhelp</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ${articles
				.map(
					(article) => `
  <url>
    <loc>${baseUrl}/article/${article._id}</loc>
    <lastmod>${new Date(article.createdAt).toISOString().split("T")[0]
						}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
				)
				.join("")}
  ${courses
				.map(
					(course) => `
  <url>
    <loc>${baseUrl}/courses/${course._id}</loc>
    <lastmod>${new Date(course.createdAt).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
				)
				.join("")}
</urlset>`;
		res.header("Content-Type", "application/xml");
		res.send(xml);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error generating sitemap");
	}
});

// Robots.txt
app.get("/robots.txt", (req, res) => {
	const robots = `
User-agent: *
Allow: /
Sitemap: https://kalawatiputra.com/sitemap.xml
`;
	res.header("Content-Type", "text/plain");
	res.send(robots);
});

// Use routes
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", authRoutes);
app.use("/api/admin/articles", adminArticleRoutes);
app.use("/api/admin/courses", adminCourseRoutes);
app.use("/api/admin/roadmaps", roadmapRoutes);
app.use("/api/admin/colleges", collegeRoutes);
app.use("/api/admin/counseling", counselingRoutes);
app.use("/api/admin/dsapractice", dsapracticeRoutes);
app.use("/api/admin/internships", internshipRoutes);
app.use("/api/admin/mentorships", mentorshipRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api", admissionRoutes);
app.use("/api/certificates", dsaCertificateRoutes);
app.use("/api", contactRoutes);

app.use("/api/goodies", goodiesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Booking routes
app.use("/api/counseling-bookings", counselingBookingRoutes);
app.use("/api/mentorship-bookings", mentorshipBookingRoutes);

// app.use('/api/certificates', certificateRoutes);
// app.use('/api/workshop-certificates', workshopCertificateRoutes);
// app.use('/api/admin/workshop', adminWorkshopRoutes);
// app.use('/api/welcome-certificates', welcomeCertificatesRouter);

// Middleware to set certificate type based on route
const setCertificateType = (type) => (req, res, next) => {
	if (!req.query.type) {
		req.query.type = type; // Set type if not provided in query
	}
	next();
};

// Routes for certificates
app.use("/api/certificates", setCertificateType("DSA"), certificateRoutes);
app.use(
	"/api/welcome-certificates",
	setCertificateType("Welcome"),
	certificateRoutes
);
app.use(
	"/api/workshop-certificates",
	setCertificateType("Workshop"),
	certificateRoutes
);

// Admin workshop routes (unchanged)
app.use("/api/admin/workshop", adminWorkshopRoutes);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/streak", streakRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/problems", require("./routes/problems"));

// Serve static files and handle SPA routing
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
	});
}

// MongoDB connection
const connectDB = async () => {
	try {
		const dbOptions = {
			dbName: "kalawatiputratutor",
		};
		await mongoose.connect(process.env.MONGO_URI, dbOptions);
		console.log("MongoDB connected");
	} catch (err) {
		console.error("MongoDB connection error:", err.message);
		process.exit(1);
	}
};
connectDB();

const PORT = process.env.PORT || 5000;

// Only start the server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless
module.exports = app;
