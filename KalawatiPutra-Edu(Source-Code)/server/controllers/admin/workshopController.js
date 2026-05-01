const Workshop = require('../../models/Workshop');

exports.createWorkshop = async (req, res) => {
  try {
    const { title, code } = req.body;
    if (!title || !code) {
      return res.status(400).json({ message: 'Title and code are required' });
    }

    const existingWorkshop = await Workshop.findOne({ code });
    if (existingWorkshop) {
      return res.status(400).json({ message: 'Code already exists' });
    }

    const workshop = new Workshop({ title, code });
    await workshop.save();
    res.status(201).json({ message: 'Workshop created successfully', workshop });
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ createdAt: -1 });
    res.json(workshops);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ message: 'Server error' });
  }
};