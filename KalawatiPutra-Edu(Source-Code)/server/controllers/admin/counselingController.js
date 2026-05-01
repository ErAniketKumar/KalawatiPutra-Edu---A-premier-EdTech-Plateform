const Counseling = require('../../models/Counseling');

exports.createCounseling = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            console.error('Validation error: Title and content are required');
            return res.status(400).json({ msg: 'Title and content are required' });
        }
        const counseling = new Counseling({ title, content });
        await counseling.save();
        console.log(`Counseling post created: ${title}`);
        res.status(201).json(counseling);
    } catch (err) {
        console.error('Error creating counseling post:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.getCounselingPosts = async (req, res) => {
    try {
        const posts = await Counseling.find();
        res.json(posts);
    } catch (err) {
        console.error('Error fetching counseling posts:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.updateCounseling = async (req, res) => {
    try {
        const { title, content } = req.body;
        const counseling = await Counseling.findById(req.params.id);
        if (!counseling) {
            console.error('Counseling post not found:', req.params.id);
            return res.status(404).json({ msg: 'Counseling post not found' });
        }
        counseling.title = title || counseling.title;
        counseling.content = content || counseling.content;
        await counseling.save();
        console.log(`Counseling post updated: ${counseling.title}`);
        res.json(counseling);
    } catch (err) {
        console.error('Error updating counseling post:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.deleteCounseling = async (req, res) => {
    try {
        const counseling = await Counseling.findByIdAndDelete(req.params.id);
        if (!counseling) {
            console.error('Counseling post not found:', req.params.id);
            return res.status(404).json({ msg: 'Counseling post not found' });
        }
        console.log(`Counseling post deleted: ${counseling.title}`);
        res.json({ msg: 'Counseling post deleted' });
    } catch (err) {
        console.error('Error deleting counseling post:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};