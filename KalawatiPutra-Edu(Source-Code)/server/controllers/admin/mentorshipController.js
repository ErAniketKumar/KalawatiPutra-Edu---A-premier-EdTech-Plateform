const Mentorship = require('../../models/Mentorship');

    exports.createMentorship = async (req, res) => {
        try {
            console.log('Creating mentorship - Request body:', req.body);
            console.log('Creating mentorship - Request file:', req.file);

            const { name, email, phone, linkedin, experience, domain } = req.body;
            let photo = null;

            if (req.file) {
                console.log('Using uploaded photo:', req.file.originalname);
                photo = req.file.path;
            } else {
                console.log('No photo uploaded');
            }

            console.log('Creating mentorship document:', { name, email, phone, linkedin, experience, domain, photo });
            const mentorship = new Mentorship({ name, email, phone, linkedin, photo, experience, domain });
            await mentorship.save();
            console.log(`Mentorship created: ${name}`);
            res.status(201).json(mentorship);
        } catch (err) {
            console.error('Error creating mentorship:', err.message, err.stack);
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    };

    exports.getMentorships = async (req, res) => {
        try {
            console.log('Fetching mentorships');
            const mentorships = await Mentorship.find();
            res.json(mentorships);
        } catch (err) {
            console.error('Error fetching mentorships:', err.message, err.stack);
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    };

    exports.updateMentorship = async (req, res) => {
        try {
            console.log('Updating mentorship - Request body:', req.body);
            console.log('Updating mentorship - Request file:', req.file);

            const { name, email, phone, linkedin, experience, domain } = req.body;
            const mentorship = await Mentorship.findById(req.params.id);
            if (!mentorship) {
                console.error('Mentorship not found:', req.params.id);
                return res.status(404).json({ msg: 'Mentorship not found' });
            }

            let photo = mentorship.photo;
            if (req.file) {
                console.log('Using uploaded photo:', req.file.originalname);
                photo = req.file.path;
            } else {
                console.log('No photo uploaded for update');
            }

            console.log('Updating mentorship document:', { name, email, phone, linkedin, experience, domain, photo });
            mentorship.name = name || mentorship.name;
            mentorship.email = email || mentorship.email;
            mentorship.phone = phone || mentorship.phone;
            mentorship.linkedin = linkedin || mentorship.linkedin;
            mentorship.photo = photo !== undefined ? photo : mentorship.photo;
            mentorship.experience = experience || mentorship.experience;
            mentorship.domain = domain || mentorship.domain;
            await mentorship.save();
            console.log(`Mentorship updated: ${mentorship.name}`);
            res.json(mentorship);
        } catch (err) {
            console.error('Error updating mentorship:', err.message, err.stack);
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    };

    exports.deleteMentorship = async (req, res) => {
        try {
            console.log('Deleting mentorship:', req.params.id);
            const mentorship = await Mentorship.findByIdAndDelete(req.params.id);
            if (!mentorship) {
                console.error('Mentorship not found:', req.params.id);
                return res.status(404).json({ msg: 'Mentorship not found' });
            }
            console.log(`Mentorship deleted: ${mentorship.name}`);
            res.json({ msg: 'Mentorship deleted' });
        } catch (err) {
            console.error('Error deleting mentorship:', err.message, err.stack);
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    };