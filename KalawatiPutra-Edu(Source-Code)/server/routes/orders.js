const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

router.post("/checkout", auth, orderController.checkout);
router.post("/verify-payment", auth, orderController.verifyPayment);
router.get("/", auth, orderController.getUserOrders);
router.get("/:id", auth, orderController.getOrderById);

module.exports = router;