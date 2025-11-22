import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Emoji Translation Endpoint
app.post("/translate", async (req, res) => {
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

    // Call OpenAI API to get emoji translation
    const systemPrompt = `
You translate short, kid-friendly phrases into a short "emoji story."

Output rules:
- Return ONLY emojis (no words, no punctuation, no quotes).
- Use 4-9 emojis.
- Keep the original meaning AND order.
- Always represent the MAIN subject, the ACTION (verb), and the object/place if present.
- Prefer concrete emojis over abstract ones.
- If a specific noun has no emoji, use the closest common substitute.
- Do not add extra concepts not in the input.

Examples:
Input: "Batman eats a burger"
Output: "🦇🧔‍♂️🍽️🍔😋"

Input: "cat doing homework"
Output: "🐱📚✍️📝"

Input: "happy llama at wawa"
Output: "😀🦙🏪🥨"
`;

    let responseFromAI;
    try {
        responseFromAI = await openAIClient.responses.create({
            model: "gpt-4.1-mini",
            temperature: 0.2,
            input: [
                { role: "system", content: systemPrompt },
                { role: "user", content: trimmedText }
            ],
        });
    } catch (error) {
        console.error("Call to OpenAI failed:", error);
        return res.status(500).json({ error: "Failed to generate emojis." });
    }

    const emojiPhrase = responseFromAI.output_text.trim();

    if (!emojiPhrase) {
        return res.status(500).json({ error: "No emojis generated." });
    }

    return res.json({
        emojiPhrase,
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
