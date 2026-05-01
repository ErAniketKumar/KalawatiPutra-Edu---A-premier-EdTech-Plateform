const Issue = require('../models/Issue');

exports.submitIssue = async (req, res) => {
  try {
    const { issueType, fullName, email, description } = req.body;

    // Validate input
    if (!issueType || !fullName || !email || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new issue
    const newIssue = new Issue({
      issueType,
      fullName,
      email,
      description,
    });

    // Save to database
    await newIssue.save();

    res.status(201).json({ message: 'Issue submitted successfully' });
  } catch (error) {
    console.error('Error submitting issue:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['to-do', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update status
    const issue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', issue });
  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete issue
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};