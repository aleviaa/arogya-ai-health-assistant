// src/services/ai.js

export async function askAI(prompt) {
  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (data.reply) return data.reply;

    return "⚠ AI Error: No response received.";
  } catch (err) {
    console.error("AI ERROR:", err);
    return "⚠ AI Service Error. Check server.";
  }
}

