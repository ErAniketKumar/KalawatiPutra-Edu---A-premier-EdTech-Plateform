const Internship = require('../../models/Internship');

exports.createInternship = async (req, res) => {
    try {
        const { company, title, description, requirements, stipend, skills, deadline, applyLink } = req.body;
        if (!company || !title) {
            console.error('Validation error: Company and title are required');
            return res.status(400).json({ msg: 'Company and title are required' });
        }
        const internship = new Internship({
            company,
            title,
            description: description || '',
            requirements: requirements ? requirements.split(',').map(r => r.trim()) : [],
            stipend: stipend || '',
            skills: skills ? skills.split(',').map(s => s.trim()) : [],
            deadline: deadline || null,
            applyLink: applyLink || '',
        });
        await internship.save();
        console.log(`Internship created: ${title}`);
        res.status(201).json(internship);
    } catch (err) {
        console.error('Error creating internship:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.getInternships = async (req, res) => {
    try {
        const internships = await Internship.find();
        res.json(internships);
    } catch (err) {
        console.error('Error fetching internships:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.updateInternship = async (req, res) => {
    try {
        const { company, title, description, requirements, stipend, skills, deadline, applyLink } = req.body;
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            console.error('Internship not found:', req.params.id);
            return res.status(404).json({ msg: 'Internship not found' });
        }
        internship.company = company || internship.company;
        internship.title = title || internship.title;
        internship.description = description !== undefined ? description : internship.description;
        internship.requirements = requirements ? requirements.split(',').map(r => r.trim()) : internship.requirements;
        internship.stipend = stipend !== undefined ? stipend : internship.stipend;
        internship.skills = skills ? skills.split(',').map(s => s.trim()) : internship.skills;
        internship.deadline = deadline || internship.deadline;
        internship.applyLink = applyLink !== undefined ? applyLink : internship.applyLink;
        await internship.save();
        console.log(`Internship updated: ${internship.title}`);
        res.json(internship);
    } catch (err) {
        console.error('Error updating internship:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findByIdAndDelete(req.params.id);
        if (!internship) {
            console.error('Internship not found:', req.params.id);
            return res.status(404).json({ msg: 'Internship not found' });
        }
        console.log(`Internship deleted: ${internship.title}`);
        res.json({ msg: 'Internship deleted' });
    } catch (err) {
        console.error('Error deleting internship:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};