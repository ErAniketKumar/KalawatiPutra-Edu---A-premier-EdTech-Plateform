const Article = require('../models/Article');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const { updateStreak } = require('./streakController');


    exports.createArticle = async (req, res) => {
        const { title, content, tags, codeSnippets } = req.body;
        const files = req.files;
        try {
            const images = [];
            const pdfs = [];

            // Process uploaded files
            for (const file of files) {
                if (file.mimetype.startsWith('image/')) {
                    images.push(file.path);
                } else if (file.mimetype === 'application/pdf') {
                    pdfs.push(file.path);
                }
            }

            const article = new Article({
                title,
                content,
                tags,
                codeSnippets: JSON.parse(codeSnippets),
                images,
                pdfs,
                author: req.user.userId,
                status: req.user.role === 'admin' ? 'approved' : 'pending',
            });
            await article.save();
            await updateStreak(req.user.userId, 'blog_creation');
            res.json(article);
        } catch (err) {
            console.error('Error in createArticle:', err);
            res.status(500).json({ msg: 'Server error: ' + err.message });
        }
    };

    exports.getArticles = async (req, res) => {
        try {
            const { page = 1, limit = 6, search = '' } = req.query;
            const query = {
                status: 'approved',
                ...(search && { title: { $regex: search, $options: 'i' } }), // Case-insensitive title search
            };

            const articles = await Article.find(query)
                .populate('author', 'name')
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 }); // Sort by newest first

            const totalArticles = await Article.countDocuments(query);

            res.json({
                articles,
                totalPages: Math.ceil(totalArticles / limit),
                currentPage: parseInt(page),
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    };

    exports.getArticleById = async (req, res) => {
        try {
            const article = await Article.findById(req.params.id).populate('author', 'name');
            if (!article) return res.status(404).json({ msg: 'Article not found' });
            if (article.status !== 'approved' && (!req.user || article.author.toString() !== req.user.userId)) {
                return res.status(403).json({ msg: 'Article not accessible' });
            }
            res.json(article);
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    };

    exports.getUserArticles = async (req, res) => {
        try {
            const articles = await Article.find({ author: req.user.userId }).populate('author', 'name');
            res.json(articles);
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    };

    exports.updateArticle = async (req, res) => {
        const { title, content, tags, codeSnippets } = req.body;
        const files = req.files;
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return res.status(404).json({ msg: 'Article not found' });
            if (article.author.toString() !== req.user.userId && req.user.role !== 'admin') {
                return res.status(403).json({ msg: 'Unauthorized' });
            }

            article.title = title || article.title;
            article.content = content || article.content;
            article.tags = tags || article.tags;
            article.codeSnippets = codeSnippets ? JSON.parse(codeSnippets) : article.codeSnippets;

            if (files && files.length > 0) {
                const images = [];
                const pdfs = [];

                // Process new files
                for (const file of files) {
                    if (file.mimetype.startsWith('image/')) {
                        images.push(file.path);
                    } else if (file.mimetype === 'application/pdf') {
                        pdfs.push(file.path);
                    }
                }

                // Update only if new files were uploaded
                article.images = images.length > 0 ? images : article.images;
                article.pdfs = pdfs.length > 0 ? pdfs : article.pdfs;
            }

            if (req.user.role === 'admin') {
                article.status = 'approved';
            }

            await article.save();
            res.json(article);
        } catch (err) {
            console.error('Error in updateArticle:', err);
            res.status(500).json({ msg: 'Server error: ' + err.message });
        }
    };

    exports.deleteArticle = async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return res.status(404).json({ msg: 'Article not found' });
            if (article.author.toString() !== req.user.userId && req.user.role !== 'admin') {
                return res.status(403).json({ msg: 'Unauthorized' });
            }

            await article.deleteOne();
            res.json({ msg: 'Article deleted' });
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    };

    // Admin-specific functions
    exports.getAllArticles = async (req, res) => {
        try {
            const articles = await Article.find().populate('author', 'name');
            res.json(articles);
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    };

    exports.approveArticle = async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return res.status(404).json({ msg: 'Article not found' });
            article.status = 'approved';
            await article.save();
            res.json(article);
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    };

    exports.denyArticle = async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return res.status(404).json({ msg: 'Article not found' });
            article.status = 'denied';
            await article.save();
            res.json(article);
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    };


    // Like an article
exports.likeArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ msg: 'Article not found' });

        // Prevent double-like by same user
        if (article.likedBy.includes(req.user.userId)) {
            return res.status(400).json({ msg: 'Already liked' });
        }

        article.likes += 1;
        article.likedBy.push(req.user.userId);
        await article.save();

        res.json({ likes: article.likes });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Unlike an article
exports.unlikeArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ msg: 'Article not found' });

        // Only unlike if user has liked
        const idx = article.likedBy.indexOf(req.user.userId);
        if (idx === -1) {
            return res.status(400).json({ msg: 'Not liked yet' });
        }

        article.likes = Math.max(0, article.likes - 1);
        article.likedBy.splice(idx, 1);
        await article.save();

        res.json({ likes: article.likes });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// pinned articles

// POST /articles/:id/pin - Pin an article for the authenticated user
exports.pinArticleByUser = async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user.userId; // Extracted from JWT

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Find user and update pinned articles
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already pinned
    if (user.pinnedArticles.includes(articleId)) {
      return res.status(400).json({ error: 'Article already pinned' });
    }

    // Add article to pinned list
    user.pinnedArticles.push(articleId);
    await user.save();

    res.status(200).json({ message: 'Article pinned successfully' });
  } catch (err) {
    console.error('Error pinning article:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /articles/:id/unpin - Unpin an article for the authenticated user
exports.unpinArticleByUser = async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user.userId;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.isPinnedByAdmin) {
      const user = await User.findById(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Cannot unpin admin-pinned article' });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.pinnedArticles.includes(articleId)) {
      return res.status(400).json({ error: 'Article not pinned' });
    }

    user.pinnedArticles = user.pinnedArticles.filter(id => id.toString() !== articleId);
    await user.save();

    res.status(200).json({ message: 'Article unpinned successfully' });
  } catch (err) {
    console.error('Error unpinning article:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



// pin  by admin

// POST /articles/:id/admin-pin - Pin an article globally by admin
exports.pinArticleByAdmin = async (req, res) => {
  try {
    const articleId = req.params.id;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.isPinnedByAdmin) {
      return res.status(400).json({ error: 'Article already pinned by admin' });
    }

    article.isPinnedByAdmin = true;
    await article.save();

    res.status(200).json({ message: 'Article pinned by admin successfully' });
  } catch (err) {
    console.error('Error pinning article by admin:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /articles/:id/admin-unpin - Unpin an article globally by admin
exports.unpinArticleByAdmin = async (req, res) => {
  try {
    const articleId = req.params.id;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (!article.isPinnedByAdmin) {
      return res.status(400).json({ error: 'Article not pinned by admin' });
    }

    article.isPinnedByAdmin = false;
    await article.save();

    res.status(200).json({ message: 'Article unpinned by admin successfully' });
  } catch (err) {
    console.error('Error unpinning article by admin:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
