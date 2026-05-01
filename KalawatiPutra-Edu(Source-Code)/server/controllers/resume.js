const Resume = require('../models/Resume');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Retry logic for API calls with exponential backoff
const retryApiCall = async (fn, maxRetries = 5, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (err) {
            console.warn(`API call attempt ${i + 1} failed: ${err.message}`);
            if ((err.status === 429 || err.code === 'ECONNRESET') && i < maxRetries - 1) {
                console.warn(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
                continue;
            }
            throw err;
        }
    }
};

// Fetch file from Cloudinary URL and return buffer
const fetchFileBuffer = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    } catch (err) {
        throw new Error(`Failed to fetch file from Cloudinary: ${err.message}`);
    }
};

const uploadResume = async (req, res) => {
    try {
        // Log for debugging
        console.log('req.file:', req.file);
        console.log('req.user:', req.user);

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized: No user authenticated.' });
        }

        const resume = new Resume({
            userId: req.user.userId, // Use req.user.userId from auth middleware
            filename: req.file.filename, // Cloudinary filename
            path: req.file.path, // Cloudinary URL
        });

        await resume.save();
        res.status(200).json({ message: 'Resume uploaded successfully.', filename: req.file.filename, path: req.file.path });
    } catch (err) {
        console.error('Error uploading resume:', err);
        res.status(500).json({ message: 'Error uploading resume: ' + err.message });
    }
};

const screenResume = async (req, res) => {
    try {
        const { filename } = req.body;
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized: No user authenticated.' });
        }
        const userId = req.user.userId; // Use req.user.userId instead of req.body.userId
        console.log('Screening resume with filename:', filename, 'userId:', userId);
        const resume = await Resume.findOne({ filename, userId }).sort({ createdAt: -1 });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found.' });
        }

        let resumeText = '';
        if (filename.endsWith('.pdf')) {
            try {
                const buffer = await fetchFileBuffer(resume.path);
                const data = await pdf(buffer);
                resumeText = data.text;
            } catch (pdfErr) {
                console.error('PDF parsing error:', pdfErr);
                return res.status(500).json({ message: 'Error parsing PDF file.' });
            }
        } else if (filename.match(/\.(jpg|jpeg|png)$/)) {
            resumeText = 'Image-based resume detected. Please provide text-based resume for better analysis.';
        } else if (filename.match(/\.(doc|docx)$/)) {
            resumeText = 'Word document detected. Please convert to PDF for analysis.';
        }

        console.log('Sending prompt to Gemini API...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const prompt = `Analyze the following resume text line-by-line and provide detailed suggestions for improvement, including grammar, sentence structure, missing ATS-friendly keywords, and impactful additions for FAANG/MAANG job applications:\n\n${resumeText}`;
        
        try {
            const result = await retryApiCall(() => model.generateContent(prompt));
            if (!result.response || !result.response.text()) {
                console.error('Empty or invalid Gemini API response');
                return res.status(500).json({ message: 'Invalid response from AI. Please try again.' });
            }
            const suggestions = result.response.text();
            console.log('Gemini API response length:', suggestions.length);

            resume.suggestions = suggestions;
            await resume.save();

            res.status(200).json({ suggestions });
        } catch (apiErr) {
            console.error('Gemini API error:', apiErr.message, apiErr.stack, 'Status:', apiErr.status);
            let message = 'Error processing resume with AI.';
            if (apiErr.status === 403) {
                message = 'Invalid or unauthorized API key. Please check GOOGLE_API_KEY in server/.env.';
            } else if (apiErr.status === 429) {
                message = 'API quota exceeded. Please wait and try again.';
            } else if (apiErr.status === 400) {
                message = 'Invalid request to AI API. Please check model or prompt.';
            }
            return res.status(500).json({ message });
        }
    } catch (err) {
        console.error('Error screening resume:', err);
        res.status(500).json({ message: 'Error screening resume.' });
    }
};

const generateQuestions = async (req, res) => {
    try {
        const { filename } = req.body;
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized: No user authenticated.' });
        }
        const userId = req.user.userId; // Use req.user.userId instead of req.body.userId
        console.log('Generating questions for filename:', filename, 'userId:', userId);
        const resume = await Resume.findOne({ filename, userId }).sort({ createdAt: -1 });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found.' });
        }

        let resumeText = '';
        if (filename.endsWith('.pdf')) {
            try {
                const buffer = await fetchFileBuffer(resume.path);
                const data = await pdf(buffer);
                resumeText = data.text;
            } catch (pdfErr) {
                console.error('PDF parsing error:', pdfErr);
                return res.status(500).json({ message: 'Error parsing PDF file.' });
            }
        } else {
            resumeText = 'Non-PDF resume detected. Please upload a PDF for question generation.';
        }

        console.log('Sending prompt to Gemini API...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const prompt = `Based on the following resume text, generate 6–10 FAANG/MAANG-level interview questions (with detailed answers) for each of three categories: 
        1. Technical/Coding (based on the tech stack mentioned in the resume).
        2. Aptitude/Logical Reasoning (general problem-solving).
        3. Soft Skills (behavioral questions).
        Format the response as JSON with keys 'technical', 'aptitude', and 'softSkills', each containing an array of objects with 'question' and 'answer' fields.\n\n${resumeText}`;
        
        try {
            const result = await retryApiCall(() => model.generateContent(prompt));
            if (!result.response || !result.response.text()) {
                console.error('Empty or invalid Gemini API response');
                return res.status(500).json({ message: 'Invalid response from AI. Please try again.' });
            }
            let questions;
            try {
                const responseText = result.response.text().replace(/```json|```/g, '').trim();
                questions = JSON.parse(responseText);
                console.log('Gemini API response parsed successfully:', Object.keys(questions));
            } catch (parseErr) {
                console.error('JSON parsing error:', parseErr, 'Raw response:', result.response.text());
                questions = { technical: [], aptitude: [], softSkills: [] };
                return res.status(500).json({ message: 'Error parsing AI response. Please try again.' });
            }

            resume.questions = questions;
            await resume.save();

            res.status(200).json({ questions });
        } catch (apiErr) {
            console.error('Gemini API error:', apiErr.message, apiErr.stack, 'Status:', apiErr.status);
            let message = 'Error generating questions with AI.';
            if (apiErr.status === 403) {
                message = 'Invalid or unauthorized API key. Please check GOOGLE_API_KEY in server/.env.';
            } else if (apiErr.status === 429) {
                message = 'API quota exceeded. Please wait and try again.';
            } else if (apiErr.status === 400) {
                message = 'Invalid request to AI API. Please check model or prompt.';
            }
            return res.status(500).json({ message });
        }
    } catch (err) {
        console.error('Error generating questions:', err);
        res.status(500).json({ message: 'Error generating questions.' });
    }
};

module.exports = { uploadResume, screenResume, generateQuestions };