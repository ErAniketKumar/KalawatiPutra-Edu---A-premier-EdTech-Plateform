const User = require("../models/User");
const Goodie = require("../models/Goodie");

exports.getCart = async (req, res) => {
	try {
		if (!req.user || !req.user.userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const user = await User.findById(req.user.userId).populate("cart.goodie");
		res.status(200).json(user.cart);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.addToCart = async (req, res) => {
	try {
		const { goodieId, quantity } = req.body;
		const user = await User.findById(req.user.userId);
		const goodie = await Goodie.findById(goodieId);
		if (!goodie) return res.status(404).json({ message: "Goodie not found" });

		const cartItemIndex = user.cart.findIndex(
			(item) => item.goodie.toString() === goodieId
		);
		if (cartItemIndex > -1) {
			user.cart[cartItemIndex].quantity += quantity;
		} else {
			user.cart.push({ goodie: goodieId, quantity });
		}
		await user.save();
		await user.populate("cart.goodie");
		res.status(200).json(user.cart);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.updateCart = async (req, res) => {
	try {
		const { goodieId, quantity } = req.body;
		const user = await User.findById(req.user.userId);
		const cartItemIndex = user.cart.findIndex(
			(item) => item.goodie.toString() === goodieId
		);
		if (cartItemIndex > -1) {
			user.cart[cartItemIndex].quantity = quantity;
			await user.save();
			await user.populate("cart.goodie");
			res.status(200).json(user.cart);
		} else {
			res.status(404).json({ message: "Item not in cart" });
		}
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};


exports.updateItemQuantity = async (req, res) => {
  try {
    const { goodieId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cartItem = user.cart.find(item => item.goodie.toString() === goodieId);
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

    cartItem.quantity = quantity;
    await user.save();
    await user.populate("cart.goodie");
    res.status(200).json(user.cart);
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.removeFromCart = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId);
		user.cart = user.cart.filter(
			(item) => item.goodie.toString() !== req.params.goodieId
		);
		await user.save();
		await user.populate("cart.goodie");
		res.status(200).json(user.cart);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};