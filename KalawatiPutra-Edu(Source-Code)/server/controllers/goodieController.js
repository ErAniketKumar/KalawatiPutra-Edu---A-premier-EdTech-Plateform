const Goodie = require("../models/Goodie");

exports.getAllGoodies = async (req, res) => {
	try {
		const goodies = await Goodie.find();
		res.status(200).json(goodies);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.getGoodieById = async (req, res) => {
	try {
		const goodie = await Goodie.findById(req.params.id);
		if (!goodie) return res.status(404).json({ message: "Goodie not found" });
		res.status(200).json(goodie);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.createGoodie = async (req, res) => {
	try {
		const { name, description, price, coinPrice, stock, category, isPopular } =
			req.body;

		// Validate required category field
		if (!category) {
			return res.status(400).json({ message: "Category is required" });
		}

		const image = req.file ? req.file.path : "";
		const goodie = new Goodie({
			name,
			description,
			price,
			coinPrice,
			stock,
			image,
			category,
			isPopular: isPopular || false, // Default to false if not provided
		});
		await goodie.save();
		res.status(201).json(goodie);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.updateGoodie = async (req, res) => {
	try {
		const { name, description, price, coinPrice, stock, category, isPopular } =
			req.body;
		const image = req.file ? req.file.path : req.body.image;

		// Prepare update object with only provided fields
		const updateData = {
			name,
			description,
			price,
			coinPrice,
			stock,
			image,
			...(category && { category }), // Include category if provided
			...(typeof isPopular !== "undefined" && { isPopular }), // Include isPopular if provided
		};

		const goodie = await Goodie.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
		});
		if (!goodie) return res.status(404).json({ message: "Goodie not found" });
		res.status(200).json(goodie);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.deleteGoodie = async (req, res) => {
	try {
		const goodie = await Goodie.findByIdAndDelete(req.params.id);
		if (!goodie) return res.status(404).json({ message: "Goodie not found" });
		res.status(200).json({ message: "Goodie deleted" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};
