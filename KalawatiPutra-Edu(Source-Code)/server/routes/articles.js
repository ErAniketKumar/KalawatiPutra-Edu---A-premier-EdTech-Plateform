const express = require("express");
const {
	createArticle,
	getArticles,
	getArticleById,
	getUserArticles,
	updateArticle,
	deleteArticle,
	likeArticle,
	unlikeArticle,
	pinArticleByUser,
	unpinArticleByUser,
	pinArticleByAdmin,
	unpinArticleByAdmin,
} = require("../controllers/articles");

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/", auth, upload.array("files", 10), createArticle);
router.get("/", getArticles);
router.get("/:id", getArticleById);
router.get("/user/articles", auth, getUserArticles);
router.put("/:id", auth, upload.array("files", 10), updateArticle);
router.delete("/:id", auth, deleteArticle);
router.post("/:id/like", auth, likeArticle);
router.post("/:id/unlike", auth, unlikeArticle);
router.post("/:id/pin", auth, pinArticleByUser);
router.post("/:id/unpin", auth, unpinArticleByUser);
router.post("/:id/admin-pin", auth, adminAuth, pinArticleByAdmin);
router.post("/:id/admin-unpin", auth, adminAuth, unpinArticleByAdmin);

module.exports = router;
