const Dsapractice = require('../../models/Dsapractice');

exports.createDsapractice = async (req, res) => {
    try {
        const { company, question, link, ytLink, topic, difficulty } = req.body;
        if (!company || !question || !topic || !difficulty) {
            console.error('Validation error: Company, question, topic, and difficulty are required');
            return res.status(400).json({ msg: 'Company, question, topic, and difficulty are required' });
        }
        const validTopics = [
            'array', 'string', 'linkedlist', 'stack', 'queue', 'tree',
            'dp', 'recursion', 'binarysearch', 'sorting', 'graph',
            'hashing', 'heap', 'trie', 'greedy', 'backtracking',
            'twopointers', 'slidingwindow', 'bitmanipulation',
            'segmenttree', 'matrix', 'maths', 'gametheory', 'divideandconquer'
        ];

        const validDifficulties = ['basic', 'easy', 'medium', 'hard'];
        if (!validTopics.includes(topic)) {
            console.error('Validation error: Invalid topic');
            return res.status(400).json({ msg: 'Invalid topic' });
        }
        if (!validDifficulties.includes(difficulty)) {
            console.error('Validation error: Invalid difficulty');
            return res.status(400).json({ msg: 'Invalid difficulty' });
        }
        const dsapractice = new Dsapractice({
            company,
            question,
            link: link || '',
            ytLink: ytLink || '',
            topic,
            difficulty
        });
        await dsapractice.save();
        console.log(`DSA practice created: ${question}`);
        res.status(201).json(dsapractice);
    } catch (err) {
        console.error('Error creating DSA practice:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.getDsapractice = async (req, res) => {
    try {
        const dsapractice = await Dsapractice.find();
        res.json(dsapractice);
    } catch (err) {
        console.error('Error fetching DSA practice:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.updateDsapractice = async (req, res) => {
    try {
        const { company, question, link, ytLink, topic, difficulty } = req.body;
        const dsapractice = await Dsapractice.findById(req.params.id);
        if (!dsapractice) {
            console.error('DSA practice not found:', req.params.id);
            return res.status(404).json({ msg: 'DSA practice not found' });
        }
        dsapractice.company = company || dsapractice.company;
        dsapractice.question = question || dsapractice.question;
        dsapractice.link = link !== undefined ? link : dsapractice.link;
        dsapractice.ytLink = ytLink !== undefined ? ytLink : dsapractice.ytLink;
        dsapractice.topic = topic || dsapractice.topic;
        dsapractice.difficulty = difficulty || dsapractice.difficulty;
        await dsapractice.save();
        console.log(`DSA practice updated: ${dsapractice.question}`);
        res.json(dsapractice);
    } catch (err) {
        console.error('Error updating DSA practice:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.deleteDsapractice = async (req, res) => {
    try {
        const dsapractice = await Dsapractice.findByIdAndDelete(req.params.id);
        if (!dsapractice) {
            console.error('DSA practice not found:', req.params.id);
            return res.status(404).json({ msg: 'DSA practice not found' });
        }
        console.log(`DSA practice deleted: ${dsapractice.question}`);
        res.json({ msg: 'DSA practice deleted' });
    } catch (err) {
        console.error('Error deleting DSA practice:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};