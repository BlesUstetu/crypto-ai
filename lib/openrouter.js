export async function askAI({ prompt, model }) {
  try {
    // =========================
    // VALIDASI API KEY
    // =========================
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY not set");
    }

    // =========================
    // TIMEOUT CONTROLLER
    // =========================
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "https://your-domain.vercel.app",
        "X-Title": "AI Trading App"
      },
      body: JSON.stringify({
        model: model || "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    clearTimeout(timeout);

    // =========================
    // HANDLE HTTP ERROR
    // =========================
    if (!res.ok) {
      const errText = await res.text();

      console.error("OPENROUTER HTTP ERROR:", errText);

      throw new Error(`OpenRouter error ${res.status}`);
    }

    const data = await res.json();

    // =========================
    // HANDLE API ERROR
    // =========================
    if (data.error) {
      console.error("OPENROUTER API ERROR:", data.error);
      throw new Error(data.error.message || "AI error");
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    return content;

  } catch (err) {
    console.error("ASK AI ERROR:", err.message);

    return `
Signal: HOLD
Entry: -
TP: -
SL: -
Confidence: LOW
Reason: AI service unavailable (${err.message})
`;
  }
}
