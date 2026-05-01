const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    youtubeUrl: { type: String }, // YouTube video URL
    notesUrl: { type: String }, // PDF notes URL
    description: { type: String }, // Topic description
    duration: { type: Number }, // Duration in minutes
    order: { type: Number, default: 0 }, // Order within module
    isCompleted: { type: Boolean, default: false },
    resources: [{
        title: String,
        url: String,
        type: { type: String, enum: ['pdf', 'link', 'video', 'document'] }
    }]
});

const ModuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    topics: [TopicSchema],
    order: { type: Number, default: 0 }, // Order within course
    isPublished: { type: Boolean, default: true }
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },
    category: { type: String, required: true },
    subcategory: { type: String },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    price: { type: Number, default: 0 },
    discountPrice: { type: Number },
    currency: { type: String, default: 'USD' },
    duration: { type: Number }, // Total duration in hours
    language: { type: String, default: 'English' },
    prerequisites: [String],
    learningOutcomes: [String],
    tags: [String],
    image: { type: String }, // Course thumbnail
    videoPreview: { type: String }, // Preview video URL
    modules: [ModuleSchema],
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date },
    enrollmentCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'review', 'published', 'archived'], default: 'draft' },
    metadata: {
        totalTopics: { type: Number, default: 0 },
        totalDuration: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now }
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String],
        slug: { type: String, unique: true, sparse: true }
    }
}, {
    timestamps: true
});

// Pre-save middleware to calculate metadata
CourseSchema.pre('save', function (next) {
    let totalTopics = 0;
    let totalDuration = 0;

    this.modules.forEach(module => {
        totalTopics += module.topics.length;
        module.topics.forEach(topic => {
            if (topic.duration) {
                totalDuration += topic.duration;
            }
        });
    });

    this.metadata.totalTopics = totalTopics;
    this.metadata.totalDuration = totalDuration;
    this.metadata.lastUpdated = new Date();

    // Generate slug if not provided
    if (!this.seo.slug) {
        const baseSlug = this.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
        // Add timestamp to ensure uniqueness
        this.seo.slug = `${baseSlug}-${Date.now()}`;
    }

    next();
});

// Create indexes for better search performance
CourseSchema.index({ category: 1, level: 1 });
CourseSchema.index({ isPublished: 1, publishedAt: -1 });
CourseSchema.index({ featured: 1, trending: 1 });
CourseSchema.index({ 'seo.slug': 1 });
CourseSchema.index({ tags: 1 });

CourseSchema.pre('findOneAndDelete', async function (next) {
    const courseId = this.getQuery()['_id'];
    const Enrollment = require('./Enrollment');
    await Enrollment.deleteMany({ course: courseId });
    next();
});

module.exports = mongoose.model('Course', CourseSchema);