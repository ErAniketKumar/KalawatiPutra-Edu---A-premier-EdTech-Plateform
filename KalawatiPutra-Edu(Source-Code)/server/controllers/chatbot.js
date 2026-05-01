const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatbotLead = require("../models/ChatbotLead");
const Article = require("../models/Article");
const Course = require("../models/Course");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.submitLead = async (req, res) => {
    const { email, phone, message } = req.body;
    try {
        // Validate email/phone only for initial submission
        if (email && phone) {
            // Check if email already exists
            let lead = await ChatbotLead.findOne({ email });
            // if (lead) return res.status(400).json({ msg: 'Email already submitted' });
            if (!lead) {
                // Save new lead
                lead = new ChatbotLead({ email, phone });
                await lead.save();
            }
        }

        // Fetch context (e.g., 5 articles and 3 courses)
        const articles = await Article.find().limit(5).select("title _id");
        const courses = await Course.find().limit(3).select("title _id");

        const context = {
            articles: articles.map((a) => ({
                title: a.title,
                link: `/article/${a._id}`,
            })),
            courses: courses.map((c) => ({
                title: c.title,
                link: `/courses/${c._id}`,
            })),
        };

        // Prepare prompt for Gemini API
        const prompt = `
You are a helpful chatbot for a tutorial website offering articles, courses, and code snippets. The user may have asked: "${message || "Tell me about the website"
            }".
Here is some context about available content:
- Articles: ${context.articles.map((a) => `${a.title} (${a.link})`).join(", ")}
- Courses: ${context.courses.map((c) => `${c.title} (${c.link})`).join(", ")}

Provide a friendly response, suggesting at least one relevant article and one course based on the user's message (if provided) or general website content. Use the EXACT links provided in the context in the format [Title](link) without modifying them. For example, if a course link is /courses/123, use [Course Title](/courses/123). Do not generate new links or IDs. End with a thank-you message for their interest.
        `;

        // Call Gemini API
        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();

        // Fallback: Correct any incorrect course links in the response
        context.courses.forEach((course) => {
            const regex = new RegExp(`\\[${course.title}\\]\\([^)]+\\)`, "g");
            aiResponse = aiResponse.replace(
                regex,
                `[${course.title}](${course.link})`
            );
        });
        context.articles.forEach((article) => {
            const regex = new RegExp(`\\[${article.title}\\]\\([^)]+\\)`, "g");
            aiResponse = aiResponse.replace(
                regex,
                `[${article.title}](${article.link})`
            );
        });

        res.json({
            msg: "Thank you for submitting!",
            response: aiResponse,
            suggestions: context, // Include context for frontend display
        });
    } catch (err) {
        console.error("Chatbot Error:", err);

        // Detect Quota/Rate Limit Errors
        const isQuotaExceeded =
            err.status === 429 ||
            err.response?.status === 429 ||
            err.message?.toLowerCase().includes('quota') ||
            err.message?.toLowerCase().includes('rate limit') ||
            (err.errorDetails && JSON.stringify(err.errorDetails).toLowerCase().includes('quota'));

        if (isQuotaExceeded) {
            return res.json({
                msg: "Thank you for reaching out!",
                response: "I'm currently receiving a high volume of requests and need a short break. Please feel free to explore our [Articles](/articles) or [Courses](/courses) in the meantime! I'll be back online shortly.",
                isSystemMessage: true
            });
        }

        // Fallback for other errors
        res.json({
            msg: "Message received!",
            response: "I'm having a bit of trouble connecting to my brain right now, but I've received your message. You can check out our latest resources like [React Tutorial](/courses) or our [Tech Blog](/articles) while I get back on track!",
            isSystemMessage: true
        });
    }
};
