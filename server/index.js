import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Emoji Translation Endpoint
app.post("/translate", (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text input is required." });
    }

    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
        return res.status(400).json({ error: "Text input cannot be empty." });
    }

    if (trimmedText.length > 120) {
        return res.status(400).json({ error: "Text input exceeds maximum length of 120 characters." });
    }

    return res.json({
        emojis: "✅ (This is a placeholder emoji translation.)",
        userInput: trimmedText
    });
});

// Server Health Checks
app.get("/health", (req, res) => {
    res.json({ ok: true, message: "server is healthy" });
});

app.get("/openai-check", (req, res) => {
    const hasKey = Boolean(process.env.OPENAI_API_KEY);
    res.json({ ok: hasKey });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
