import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3.1:8b";

export async function generateAIVerdict({ atsResult, jobRole }) {
  const prompt = `
You are an ATS resume expert.

Job Role: ${jobRole || "Not specified"}

Analyze the ATS result below and provide:

1. Overall verdict (1 short paragraph)
2. Key strengths (bullet points)
3. Weaknesses (bullet points)
4. Actionable improvements (bullet points)

Rules:
- Do NOT change the score
- Do NOT guess missing data
- Base everything strictly on ATS output
- Keep it concise and practical
- No marketing language

ATS Result:
${JSON.stringify(atsResult, null, 2)}
`;

  try {
    const response = await axios.post(
      OLLAMA_URL,
      {
        model: MODEL,
        prompt,
        stream: false,
      },
      {
        timeout: 120_000, // 120 seconds (IMPORTANT)
      },
    );

    return response.data.response;
  } catch (error) {
    console.error("AI Verdict Error:", {
      message: error.message,
      status: error.response?.status,
    });

    // Fallback (very important for production)
    return "AI analysis is temporarily unavailable. Please review the ATS breakdown and recommendations provided above.";
  }
}
