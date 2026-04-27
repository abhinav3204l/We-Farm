const express = require("express");
const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "No question provided" });
    }

    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      return res.json({
        reply: `🌾 Farming Tip: For "${question}" — check soil moisture, apply organic fertilizer, and monitor for pests weekly.`,
      });
    }

    // ✅ Using gemini-1.5-flash — more generous free quota than 2.0
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert farming assistant helping farmers in India. Give short, practical, friendly advice in 2-3 sentences. Farmer's question: ${question}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();

    // If quota hit, return smart fallback instead of error
    if (data?.error?.code === 429) {
      return res.json({
        reply: `🌾 Quick Tip: For "${question}" — ensure proper irrigation, check for pest damage, and consider soil testing. Consult your local Krishi Vigyan Kendra for expert advice.`,
      });
    }

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      console.error("Gemini response issue:", JSON.stringify(data));
      return res.json({
        reply: `🌾 Farming Tip: For "${question}" — check soil moisture, apply organic fertilizer, and monitor for pests weekly.`,
      });
    }

    res.json({ reply: answer });
  } catch (err) {
    console.error("AI route error:", err);
    res.status(500).json({ message: "AI error" });
  }
});

module.exports = router;