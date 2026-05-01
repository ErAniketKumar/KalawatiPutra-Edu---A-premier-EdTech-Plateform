const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create courses'
      });
    }

    const {
      title,
      description,
      shortDescription,
      category,
      subcategory,
      level,
      price,
      discountPrice,
      duration,
      language,
      prerequisites,
      learningOutcomes,
      tags,
      videoPreview,
      modules,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    // Parse modules if they're in JSON string format
    let parsedModules = [];
    if (modules) {
      try {
        parsedModules = typeof modules === 'string' ? JSON.parse(modules) : modules;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid modules format'
        });
      }
    }

    // Handle file uploads
    const fileMap = {};
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        fileMap[file.fieldname] = file.path;
      }
    }

    // Process modules and topics with file mappings
    const processedModules = parsedModules.map((module, moduleIndex) => ({
      title: module.title,
      description: module.description || '',
      order: module.order || moduleIndex,
      isPublished: module.isPublished !== false,
      topics: (module.topics || []).map((topic, topicIndex) => ({
        title: topic.title,
        description: topic.description || '',
        youtubeUrl: topic.youtubeUrl || '',
        duration: topic.duration || 0,
        order: topic.order || topicIndex,
        notesUrl: fileMap[`notes_${moduleIndex}_${topicIndex}`] || topic.notesUrl || '',
        resources: topic.resources || []
      }))
    }));

    // Create the course
    const course = new Course({
      title,
      description,
      shortDescription: shortDescription || description.substring(0, 200),
      category,
      subcategory: subcategory || '',
      level: level || 'Beginner',
      author: req.user.userId,
      price: price ? parseFloat(price) : 0,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      duration: duration ? parseFloat(duration) : null,
      language: language || 'English',
      prerequisites: prerequisites ? (Array.isArray(prerequisites) ? prerequisites : prerequisites.split(',').map(p => p.trim())) : [],
      learningOutcomes: learningOutcomes ? (Array.isArray(learningOutcomes) ? learningOutcomes : learningOutcomes.split(',').map(o => o.trim())) : [],
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      image: fileMap['thumbnail'] || '',
      videoPreview: videoPreview || '',
      modules: processedModules,
      status: 'published', // Set status to published for new courses
      isPublished: true, // Set isPublished to true for new courses
      publishedAt: new Date(), // Set publish date
      seo: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || shortDescription || description.substring(0, 160),
        keywords: keywords ? (Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim())) : []
      }
    });

    await course.save();
    await course.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });

  } catch (error) {
    console.error('Error in createCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

// Get all courses with filtering and pagination
exports.getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      level,
      language,
      featured,
      trending,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (language) filter.language = language;
    if (featured) filter.featured = featured === 'true';
    if (trending) filter.trending = trending === 'true';
    if (status) filter.status = status;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    const courses = await Course.find(filter)
      .populate('author', 'name email')
      .populate('instructors', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCourses: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error in getCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};
// Get a specific course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('author', 'name email')
      .populate('instructors', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error in getCourseById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

// Get course by slug
exports.getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ 'seo.slug': req.params.slug })
      .populate('author', 'name email')
      .populate('instructors', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error in getCourseBySlug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update courses'
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const updateData = { ...req.body };

    // Handle file uploads
    const fileMap = {};
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        fileMap[file.fieldname] = file.path;
      }
    }

    // Update thumbnail if uploaded
    if (fileMap['thumbnail']) {
      updateData.image = fileMap['thumbnail'];
    }

    // Process modules if provided
    if (updateData.modules) {
      let parsedModules = [];
      try {
        parsedModules = typeof updateData.modules === 'string' ? JSON.parse(updateData.modules) : updateData.modules;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid modules format'
        });
      }

      updateData.modules = parsedModules.map((module, moduleIndex) => ({
        ...module,
        topics: (module.topics || []).map((topic, topicIndex) => ({
          ...topic,
          notesUrl: fileMap[`notes_${moduleIndex}_${topicIndex}`] || topic.notesUrl || ''
        }))
      }));
    }

    // Update arrays properly
    if (updateData.prerequisites && typeof updateData.prerequisites === 'string') {
      updateData.prerequisites = updateData.prerequisites.split(',').map(p => p.trim());
    }
    if (updateData.learningOutcomes && typeof updateData.learningOutcomes === 'string') {
      updateData.learningOutcomes = updateData.learningOutcomes.split(',').map(o => o.trim());
    }
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email').populate('instructors', 'name email');

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });

  } catch (error) {
    console.error('Error in updateCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization
    if (course.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this course'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};

// Get user's courses
exports.getUserCourses = async (req, res) => {
  try {
    const courses = await Course.find({ author: req.user.userId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });

  } catch (error) {
    console.error('Error in getUserCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user courses',
      error: error.message
    });
  }
};

// Enroll in course
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Course is not published yet'
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user.userId,
      course: req.params.id,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    const enrollment = new Enrollment({
      user: req.user.userId,
      course: req.params.id,
    });

    await enrollment.save();

    // Update enrollment count
    await Course.findByIdAndUpdate(req.params.id, {
      $inc: { enrollmentCount: 1 }
    });

    res.json({
      success: true,
      message: 'Enrolled successfully'
    });

  } catch (error) {
    console.error('Error in enrollCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message
    });
  }
};

// Get course content (for enrolled users)
exports.getCourseContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('author', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user.userId,
      course: req.params.id,
    });

    res.json({
      success: true,
      data: {
        course,
        isEnrolled: !!enrollment,
        completedTopics: enrollment ? enrollment.completedTopics : [],
        progress: enrollment ? enrollment.progress : 0
      }
    });

  } catch (error) {
    console.error('Error in getCourseContent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course content',
      error: error.message
    });
  }
};

// Mark topic as complete
exports.markTopicComplete = async (req, res) => {
  try {
    const { topicId } = req.body;

    const enrollment = await Enrollment.findOne({
      user: req.user.userId,
      course: req.params.id,
    });

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    if (!enrollment.completedTopics.includes(topicId)) {
      enrollment.completedTopics.push(topicId);

      // Calculate progress
      const course = await Course.findById(req.params.id);
      const totalTopics = course.metadata.totalTopics;
      enrollment.progress = totalTopics > 0 ? (enrollment.completedTopics.length / totalTopics) * 100 : 0;

      await enrollment.save();
    }

    res.json({
      success: true,
      message: 'Topic marked as complete',
      progress: enrollment.progress
    });

  } catch (error) {
    console.error('Error in markTopicComplete:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark topic as complete',
      error: error.message
    });
  }
};

// Get course statistics
exports.getCourseStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const draftCourses = await Course.countDocuments({ status: 'draft' });
    const totalEnrollments = await Enrollment.countDocuments();

    // Categories breakdown
    const categoriesStats = await Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Level breakdown
    const levelStats = await Course.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Popular courses
    const popularCourses = await Course.find()
      .sort({ enrollmentCount: -1 })
      .limit(5)
      .select('title enrollmentCount rating');

    res.json({
      success: true,
      data: {
        totalCourses,
        publishedCourses,
        draftCourses,
        totalEnrollments,
        categoriesStats,
        levelStats,
        popularCourses
      }
    });

  } catch (error) {
    console.error('Error in getCourseStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course statistics',
      error: error.message
    });
  }
};

// Update course status
exports.updateCourseStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { status } = req.body;
    const validStatuses = ['draft', 'review', 'published', 'archived'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (status === 'published') {
      updateData.isPublished = true;
      updateData.publishedAt = new Date();
    } else {
      updateData.isPublished = false;
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course status updated successfully',
      data: course
    });

  } catch (error) {
    console.error('Error in updateCourseStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course status',
      error: error.message
    });
  }
};