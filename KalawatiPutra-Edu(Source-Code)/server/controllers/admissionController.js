const AdmissionApplication = require('../models/AdmissionApplication');

exports.submitAdmissionApplication = async (req, res) => {
    try {
        const { name, dob, fatherName, email, phone, address, courses, collegeId } = req.body;

        // Validate required fields
        if (!name || !dob || !fatherName || !email || !phone || !address || !collegeId) {
            return res.status(400).json({ msg: 'All required fields must be provided' });
        }

        // Generate reference ID: first 3 chars of name + first 4 digits of phone + 3 random chars
        const namePart = name.slice(0, 3).toUpperCase();
        const phonePart = phone.replace(/\D/g, '').slice(0, 4).padEnd(4, '0');
        const randomChars = Array(3).fill().map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
        const referenceId = `${namePart}${phonePart}${randomChars}`;

        // Create new application
        const application = new AdmissionApplication({
            name,
            dob,
            fatherName,
            email,
            phone,
            address,
            courses: courses ? courses.split(',').map(c => c.trim()) : [],
            collegeId,
            referenceId,
        });

        await application.save();
        res.status(201).json({ msg: 'Application submitted successfully', referenceId });
    } catch (err) {
        console.error('Error submitting application:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.getAllAdmissionApplications = async (req, res) => {
    try {
        const applications = await AdmissionApplication.find().populate('collegeId', 'name');
        res.status(200).json(applications);
    } catch (err) {
        console.error('Error fetching admission applications:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};