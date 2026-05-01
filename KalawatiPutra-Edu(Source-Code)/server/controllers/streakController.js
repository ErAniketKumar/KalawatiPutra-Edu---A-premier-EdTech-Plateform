const Streak = require('../models/Streak');
const User = require('../models/User');

// Get user's streak data
exports.getUserStreaks = async (req, res) => {
  try {
    const streaks = await Streak.find({ user: req.user._id }).select('date activities');
    res.json(streaks);
  } catch (err) {
    console.error('Error fetching streaks:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update streak for a specific activity
exports.updateStreak = async (userId, activityType) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Check if streak exists for today
    let streak = await Streak.findOne({ user: userId, date: today });

    if (streak) {
      // Add activity if not already present
      if (!streak.activities.includes(activityType)) {
        streak.activities.push(activityType);
        await streak.save();
      }
    } else {
      // Create new streak entry
      streak = new Streak({
        user: userId,
        date: today,
        activities: [activityType],
      });
      await streak.save();

      // Update user's streaks array
      await User.findByIdAndUpdate(userId, { $push: { streaks: streak._id } });
    }
  } catch (err) {
    console.error('Error updating streak:', err);
  }
};