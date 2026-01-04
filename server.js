import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ ACTIVE MODEL
      messages: [
        {
          role: "system",
          content:
            "You are AROGYA, a professional medical AI assistant. Provide clear, structured, safe health guidance. Always advise consulting a doctor for serious or persistent symptoms.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({ error: "AI failed to respond" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Arogya server running on http://localhost:${PORT}`);
});

