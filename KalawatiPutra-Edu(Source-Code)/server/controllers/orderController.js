const User = require("../models/User");
const Goodie = require("../models/Goodie");
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");

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

    // Validate input
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!["money", "coin"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }
    if (
      !shippingAddress.name ||
      !shippingAddress.mobile ||
      !shippingAddress.address ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({ message: "Incomplete shipping address" });
    }

    // Fetch user and populate cart
    const user = await User.findById(req.user.userId).populate("cart.goodie");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Filter out invalid cart items and calculate totals
    let totalPrice = 0;
    let totalCoinPrice = 0;
    const items = [];
    const invalidItems = [];

    for (const item of user.cart) {
      if (!item.goodie || !item.goodie._id) {
        invalidItems.push(item);
        continue; // Skip invalid items
      }
      totalPrice += item.goodie.price * item.quantity;
      totalCoinPrice += item.goodie.coinPrice * item.quantity;
      items.push({
        goodie: item.goodie._id,
        quantity: item.quantity,
        price: item.goodie.price,
        coinPrice: item.goodie.coinPrice,
      });
    }

    // If no valid items remain after filtering
    if (items.length === 0) {
      return res.status(400).json({ message: "No valid items in cart" });
    }

    // Remove invalid items from user's cart
    if (invalidItems.length > 0) {
      user.cart = user.cart.filter((item) =>
        item.goodie && item.goodie._id
      );
      await user.save();
    }

    // Check coins for coin payment
    if (paymentMethod === "coin" && user.coins < totalCoinPrice) {
      return res.status(400).json({ message: "Insufficient coins" });
    }

    const orderId = generateOrderId();
    const order = new Order({
      user: req.user.userId,
      items,
      totalPrice,
      totalCoinPrice,
      shippingAddress,
      paymentMethod,
      orderId,
    });

    if (paymentMethod === "money") {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ message: "Razorpay configuration missing" });
      }
      const options = {
        amount: totalPrice * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: orderId,
      };
      try {
        const razorpayOrder = await razorpay.orders.create(options);
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();
        return res.status(200).json({
          message: "Order created, proceed to payment",
          razorpayOrder,
          orderId,
        });
      } catch (razorpayError) {
        console.error("Razorpay error:", razorpayError);
        return res.status(500).json({ message: "Failed to create Razorpay order", error: razorpayError.message });
      }
    } else {
      user.coins -= totalCoinPrice;
      user.cart = [];
      user.orders.push(order._id);
      await user.save();
      await order.save();
      return res.status(200).json({
        message: "Order placed successfully! Our team will contact you shortly.",
        orderId,
      });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Server error during checkout", error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update order status and clear cart
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "processing";
    await order.save();

    const user = await User.findById(req.user.userId);
    user.cart = [];
    user.orders.push(order._id);
    await user.save();

    res.status(200).json({ message: "Payment verified and order placed successfully", orderId });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Server error during payment verification", error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;   // Default to page 1
    const limit = 10;                             // Items per page
    const skip = (page - 1) * limit;

    // Fetch orders with pagination
    const orders = await Order.find({ user: req.user.userId })
      .populate("items.goodie")
      .sort({ createdAt: -1 })  // optional: newest first
      .skip(skip)
      .limit(limit);

    // Check if there are more orders
    const totalOrders = await Order.countDocuments({ user: req.user.userId });
    const hasMore = skip + orders.length < totalOrders;

    res.status(200).json({ orders, hasMore });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.goodie");
    if (!order || order.user.toString() !== req.user.userId) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};