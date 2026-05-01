const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");

router.get("/", auth, cartController.getCart);
router.post("/add", auth, cartController.addToCart);
router.put("/update", auth, cartController.updateCart);
router.put('/update/:goodieId', auth, cartController.updateItemQuantity);

router.delete("/remove/:goodieId", auth, cartController.removeFromCart);


module.exports = router;