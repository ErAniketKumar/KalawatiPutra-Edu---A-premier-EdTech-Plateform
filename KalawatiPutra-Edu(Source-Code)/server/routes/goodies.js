const express = require("express");
const router = express.Router();
const goodieController = require("../controllers/goodieController");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");

router.get("/", goodieController.getAllGoodies);
router.get("/:id", goodieController.getGoodieById);
router.post("/", adminAuth, upload.single("image"), goodieController.createGoodie);
router.put("/:id", adminAuth, upload.single("image"), goodieController.updateGoodie);
router.delete("/:id", adminAuth, goodieController.deleteGoodie);

module.exports = router;