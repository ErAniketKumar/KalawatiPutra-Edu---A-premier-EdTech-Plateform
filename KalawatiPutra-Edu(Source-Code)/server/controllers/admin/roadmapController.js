const Roadmap = require('../../models/Roadmap');

exports.createRoadmap = async (req, res) => {
  try {
    const { subject, content, category, difficulty, estimatedDuration, isCertificateAvailable } = req.body;
    const files = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        files.push(file.path);
      }
    }

    const roadmap = new Roadmap({
      subject,
      content,
      category,
      difficulty,
      estimatedDuration,
      isCertificateAvailable,
      files
    });
    await roadmap.save();
    res.status(201).json(roadmap);
  } catch (err) {
    console.error('Error creating roadmap:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (err) {
    console.error('Error fetching roadmaps:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateRoadmap = async (req, res) => {
  try {
    const { subject, content, category, difficulty, estimatedDuration, isCertificateAvailable } = req.body;
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });

    let files;
    if (req.files && Array.isArray(req.files)) {
      files = [];
      for (const file of req.files) {
        files.push(file.path);
      }
    }

    roadmap.subject = subject || roadmap.subject;
    roadmap.content = content || roadmap.content;
    roadmap.category = category || roadmap.category;
    roadmap.difficulty = difficulty || roadmap.difficulty;
    roadmap.estimatedDuration = estimatedDuration || roadmap.estimatedDuration;
    if (isCertificateAvailable !== undefined) roadmap.isCertificateAvailable = isCertificateAvailable;

    if (files) roadmap.files = files;
    await roadmap.save();
    res.json(roadmap);
  } catch (err) {
    console.error('Error updating roadmap:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
    if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });
    res.json({ msg: 'Roadmap deleted' });
  } catch (err) {
    console.error('Error deleting roadmap:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};