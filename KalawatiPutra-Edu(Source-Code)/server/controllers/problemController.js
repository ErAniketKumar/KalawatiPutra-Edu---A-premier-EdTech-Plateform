const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { LANGUAGE_MAP } = require('../models/Submission');
const axios = require('axios');

// Judge0 Configuration
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const USE_RAPID_API = !!JUDGE0_API_KEY;
const JUDGE0_API_URL = USE_RAPID_API
    ? (process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com")
    : "https://ce.judge0.com";

// Language ID to internal name mapping
const LANG_ID_TO_NAME = {
    50: 'c',
    54: 'cpp',
    62: 'java',
    63: 'javascript',
    71: 'python',
    82: 'sql'
};

// Judge0 status codes
const JUDGE0_STATUS = {
    IN_QUEUE: 1,
    PROCESSING: 2,
    ACCEPTED: 3,
    WRONG_ANSWER: 4,
    TIME_LIMIT_EXCEEDED: 5,
    COMPILATION_ERROR: 6,
    RUNTIME_ERROR_SIGSEGV: 7,
    RUNTIME_ERROR_SIGXFSZ: 8,
    RUNTIME_ERROR_SIGFPE: 9,
    RUNTIME_ERROR_SIGABRT: 10,
    RUNTIME_ERROR_NZEC: 11,
    RUNTIME_ERROR_OTHER: 12,
    INTERNAL_ERROR: 13,
    EXEC_FORMAT_ERROR: 14
};

const getHeaders = () => {
    const headers = { 'content-type': 'application/json' };
    if (USE_RAPID_API) {
        headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
        headers['X-RapidAPI-Host'] = process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com";
    }
    return headers;
};

// Map Judge0 status to our status
const mapStatus = (statusId) => {
    switch (statusId) {
        case JUDGE0_STATUS.ACCEPTED: return 'Accepted';
        case JUDGE0_STATUS.WRONG_ANSWER: return 'Wrong Answer';
        case JUDGE0_STATUS.TIME_LIMIT_EXCEEDED: return 'Time Limit Exceeded';
        case JUDGE0_STATUS.COMPILATION_ERROR: return 'Compilation Error';
        case JUDGE0_STATUS.RUNTIME_ERROR_SIGSEGV:
        case JUDGE0_STATUS.RUNTIME_ERROR_SIGXFSZ:
        case JUDGE0_STATUS.RUNTIME_ERROR_SIGFPE:
        case JUDGE0_STATUS.RUNTIME_ERROR_SIGABRT:
        case JUDGE0_STATUS.RUNTIME_ERROR_NZEC:
        case JUDGE0_STATUS.RUNTIME_ERROR_OTHER:
            return 'Runtime Error';
        default: return 'Internal Error';
    }
};

// --- Problem Management ---

exports.createProblem = async (req, res) => {
    try {
        const problem = new Problem({
            ...req.body,
            author: req.user.userId
        });
        await problem.save();
        res.status(201).json(problem);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.getProblems = async (req, res) => {
    try {
        const { difficulty, tags, problemType } = req.query;
        let query = { isPublic: true };

        if (difficulty) query.difficulty = difficulty;
        if (tags) query.tags = { $in: tags.split(',') };
        if (problemType) query.problemType = problemType;

        const problems = await Problem.find(query)
            .select('title slug difficulty tags problemType solvedCount attemptCount acceptanceRate companies')
            .sort({ createdAt: -1 });

        res.json(problems);
    } catch (err) {
        console.error("Error fetching problems:", err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getProblemBySlug = async (req, res) => {
    try {
        const problem = await Problem.findOne({ slug: req.params.slug });
        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        const problemObj = problem.toObject();
        
        // Always hide hidden test cases from non-admin users
        if (req.user?.role !== 'admin') {
            problemObj.testCases = problemObj.testCases.filter(tc => !tc.isHidden);
            // Also hide SQL seed data and schema details for SQL problems
            if (problemObj.problemType === 'SQL') {
                delete problemObj.sqlSeedData;
            }
        }

        // Remove driver code from response - never expose to frontend
        if (problemObj.defaultCode) {
            problemObj.defaultCode = problemObj.defaultCode.map(dc => ({
                language: dc.language,
                code: dc.code
            }));
        }

        res.json(problemObj);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateProblem = async (req, res) => {
    try {
        const problem = await Problem.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(problem);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteProblem = async (req, res) => {
    try {
        await Problem.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Problem deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get user's submissions for a problem
exports.getUserSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            user: req.user.userId,
            problem: req.params.problemId
        })
        .sort({ createdAt: -1 })
        .limit(20);
        
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all user submissions
exports.getAllUserSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user.userId })
            .populate('problem', 'title slug difficulty')
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// --- Code Execution ---

const createJudge0Submission = async (sourceCode, languageId, stdin, expectedOutput, timeLimit = 2, memoryLimit = 256000) => {
    const options = {
        method: 'POST',
        url: `${JUDGE0_API_URL}/submissions`,
        params: { base64_encoded: 'true', wait: 'true' },
        headers: getHeaders(),
        data: {
            source_code: Buffer.from(sourceCode).toString('base64'),
            language_id: languageId,
            stdin: Buffer.from(stdin || "").toString('base64'),
            expected_output: expectedOutput ? Buffer.from(expectedOutput.trim()).toString('base64') : null,
            cpu_time_limit: timeLimit,
            memory_limit: memoryLimit
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error("Judge0 Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Compilation/Execution failed");
    }
};

const mergeCode = (userCode, driverCode) => {
    if (!driverCode) return userCode;
    return `${userCode}\n\n${driverCode}`;
};

// Normalize output for comparison (trim whitespace, normalize line endings)
const normalizeOutput = (output) => {
    if (!output) return '';
    return output.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '');
};

exports.runCode = async (req, res) => {
    const { code, languageId, input, slug } = req.body;

    if (!code || !languageId) {
        return res.status(400).json({ msg: "Code and Language ID are required" });
    }

    try {
        let finalCode = code;
        let problem = null;

        if (slug) {
            problem = await Problem.findOne({ slug });
            if (problem && problem.defaultCode) {
                const langName = LANG_ID_TO_NAME[languageId];
                if (langName) {
                    const template = problem.defaultCode.find(dc => dc.language === langName);
                    if (template && template.driverCode) {
                        finalCode = mergeCode(code, template.driverCode);
                    }
                }
            }
        }

        const result = await createJudge0Submission(
            finalCode, 
            languageId, 
            input,
            null,
            problem?.timeLimit || 2,
            problem?.memoryLimit || 256000
        );

        // Decode base64 outputs
        if (result.stdout) result.stdout = Buffer.from(result.stdout, 'base64').toString('utf-8');
        if (result.stderr) result.stderr = Buffer.from(result.stderr, 'base64').toString('utf-8');
        if (result.compile_output) result.compile_output = Buffer.from(result.compile_output, 'base64').toString('utf-8');

        res.json(result);
    } catch (err) {
        res.status(500).json({ msg: 'Execution failed', error: err.message });
    }
};

// Run code against sample test cases
exports.runWithSamples = async (req, res) => {
    const { code, languageId, slug } = req.body;

    if (!code || !languageId || !slug) {
        return res.status(400).json({ msg: "Code, Language ID, and slug are required" });
    }

    try {
        const problem = await Problem.findOne({ slug });
        if (!problem) return res.status(404).json({ msg: "Problem not found" });

        let finalCode = code;
        const langName = LANG_ID_TO_NAME[languageId];
        
        if (langName && problem.defaultCode) {
            const template = problem.defaultCode.find(dc => dc.language === langName);
            if (template && template.driverCode) {
                finalCode = mergeCode(code, template.driverCode);
            }
        }

        const results = [];
        const sampleCases = problem.sampleCases || [];

        if (sampleCases.length === 0) {
            return res.status(400).json({ msg: "No sample test cases available for this problem" });
        }

        for (const sample of sampleCases) {
            const result = await createJudge0Submission(
                finalCode,
                languageId,
                sample.input,
                sample.output,
                problem.timeLimit,
                problem.memoryLimit
            );

            // Decode outputs
            let stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8') : '';
            let stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8') : '';
            let compile_output = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8') : '';

            results.push({
                input: sample.input,
                expectedOutput: sample.output,
                actualOutput: stdout.trim(),
                passed: result.status.id === JUDGE0_STATUS.ACCEPTED,
                status: result.status.description,
                time: result.time,
                memory: result.memory,
                stderr,
                compile_output
            });
        }

        const allPassed = results.every(r => r.passed);
        res.json({
            allPassed,
            results,
            totalPassed: results.filter(r => r.passed).length,
            totalCases: results.length
        });

    } catch (err) {
        res.status(500).json({ msg: 'Execution failed', error: err.message });
    }
};

exports.submitCode = async (req, res) => {
    const { code, languageId, problemId } = req.body;
    const langName = LANG_ID_TO_NAME[languageId];

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ msg: "Problem not found" });

        // Increment attempt count
        problem.attemptCount += 1;

        let finalCode = code;
        if (langName && problem.defaultCode) {
            const template = problem.defaultCode.find(dc => dc.language === langName);
            if (template && template.driverCode) {
                finalCode = mergeCode(code, template.driverCode);
            }
        }

        const testCases = problem.testCases;
        
        if (!testCases || testCases.length === 0) {
            return res.status(400).json({ msg: "No test cases available for this problem" });
        }
        
        let passedCount = 0;
        let totalTime = 0;
        let maxMemory = 0;
        let finalStatus = "Accepted";
        let errorDetails = "";
        let failedTestCase = null;

        for (const testCase of testCases) {
            const result = await createJudge0Submission(
                finalCode,
                languageId,
                testCase.input,
                testCase.output,
                problem.timeLimit,
                problem.memoryLimit
            );

            totalTime += parseFloat(result.time || 0);
            maxMemory = Math.max(maxMemory, result.memory || 0);

            if (result.status.id !== JUDGE0_STATUS.ACCEPTED) {
                finalStatus = mapStatus(result.status.id);
                
                // Decode error details
                if (result.stderr) {
                    errorDetails = Buffer.from(result.stderr, 'base64').toString('utf-8');
                } else if (result.compile_output) {
                    errorDetails = Buffer.from(result.compile_output, 'base64').toString('utf-8');
                } else {
                    errorDetails = result.status.description;
                }

                // For wrong answer, show expected vs actual (only for non-hidden or first sample)
                if (result.status.id === JUDGE0_STATUS.WRONG_ANSWER && !testCase.isHidden) {
                    const actualOutput = result.stdout 
                        ? Buffer.from(result.stdout, 'base64').toString('utf-8').trim() 
                        : '';
                    failedTestCase = {
                        input: testCase.input,
                        expectedOutput: testCase.output,
                        actualOutput
                    };
                }
                break;
            } else {
                passedCount++;
            }
        }

        // If all passed, increment solved count
        if (finalStatus === 'Accepted') {
            // Check if user has already solved this problem
            const existingSolved = await Submission.findOne({
                user: req.user.userId,
                problem: problemId,
                status: 'Accepted'
            });
            
            if (!existingSolved) {
                problem.solvedCount += 1;
            }
        }

        await problem.save();

        const submission = new Submission({
            user: req.user.userId,
            problem: problemId,
            code,
            language: LANGUAGE_MAP[languageId] || 'Unknown',
            languageId,
            status: finalStatus,
            executionTime: Math.round(totalTime * 1000) / 1000,
            memoryUsed: maxMemory,
            passedTestCases: passedCount,
            totalTestCases: testCases.length,
            errorDetails,
            failedTestCase
        });

        await submission.save();
        res.json(submission);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Submission failed', error: err.message });
    }
};

// Get problem statistics
exports.getProblemStats = async (req, res) => {
    try {
        const stats = await Problem.aggregate([
            { $match: { isPublic: true } },
            {
                $group: {
                    _id: '$difficulty',
                    count: { $sum: 1 },
                    totalSolved: { $sum: '$solvedCount' }
                }
            }
        ]);

        const totalProblems = await Problem.countDocuments({ isPublic: true });
        
        res.json({
            total: totalProblems,
            byDifficulty: stats
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get user's solved problems
exports.getUserProgress = async (req, res) => {
    try {
        const solvedSubmissions = await Submission.find({
            user: req.user.userId,
            status: 'Accepted'
        }).distinct('problem');

        const solvedProblems = await Problem.find({
            _id: { $in: solvedSubmissions }
        }).select('title slug difficulty');

        res.json({
            solvedCount: solvedProblems.length,
            solvedProblems
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
