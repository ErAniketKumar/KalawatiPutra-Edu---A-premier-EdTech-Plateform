const College = require('../../models/College');

exports.createCollege = async (req, res) => {
    try {
        const { name, about, courses, contact, website, feeStructure } = req.body;
        if (!name) {
            console.error('Validation error: Name is required');
            return res.status(400).json({ msg: 'Name is required' });
        }
        const college = new College({ 
            name, 
            about: about || '', 
            courses: courses ? courses.split(',').map(c => c.trim()) : [], 
            contact: contact || '', 
            website: website || '', 
            feeStructure: feeStructure || '' 
        });
        await college.save();
        console.log(`College created: ${name}`);
        res.status(201).json(college);
    } catch (err) {
        console.error('Error creating college:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.getColleges = async (req, res) => {
    try {
        const colleges = await College.find();
        res.json(colleges);
    } catch (err) {
        console.error('Error fetching colleges:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.updateCollege = async (req, res) => {
    try {
        const { name, about, courses, contact, website, feeStructure } = req.body;
        const college = await College.findById(req.params.id);
        if (!college) {
            console.error('College not found:', req.params.id);
            return res.status(404).json({ msg: 'College not found' });
        }
        college.name = name || college.name;
        college.about = about !== undefined ? about : college.about;
        college.courses = courses ? courses.split(',').map(c => c.trim()) : college.courses;
        college.contact = contact !== undefined ? contact : college.contact;
        college.website = website !== undefined ? website : college.website;
        college.feeStructure = feeStructure !== undefined ? feeStructure : college.feeStructure;
        await college.save();
        console.log(`College updated: ${college.name}`);
        res.json(college);
    } catch (err) {
        console.error('Error updating college:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.deleteCollege = async (req, res) => {
    try {
        const college = await College.findByIdAndDelete(req.params.id);
        if (!college) {
            console.error('College not found:', req.params.id);
            return res.status(404).json({ msg: 'College not found' });
        }
        console.log(`College deleted: ${college.name}`);
        res.json({ msg: 'College deleted' });
    } catch (err) {
        console.error('Error deleting college:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};