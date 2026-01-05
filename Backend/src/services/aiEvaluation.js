import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "phi3:mini";

/**
 * Generate ATS-based AI explanation
 * Optimized for speed, low tokens, and CPU inference
 */
export async function generateAIVerdict({ atsResult, jobRole }) {
  if (!atsResult || typeof atsResult !== "object") {
    return "AI analysis unavailable due to invalid ATS input.";
  }

  /**
   * 🔹 CRITICAL: shrink input to avoid slow inference
   * Only pass what the AI needs to explain
   */
  const compactATS = {
    score: atsResult.score,
    verdict: atsResult.verdict,
    topSignals: atsResult.explanations?.slice(0, 8) || [],
    penalties: atsResult.recommendations?.critical || [],
    breakdown: atsResult.breakdown,
  };

  const prompt = `
You are an ATS explanation engine.

Your task is to explain the ATS evaluation below.
You must ONLY use the provided data.
You must NOT invent keywords, sections, or penalties.

Job Role: ${jobRole || "Not specified"}

ATS DATA:
${JSON.stringify(compactATS)}

OUTPUT FORMAT (STRICT):

### Final Verdict
- 3–4 short sentences
- Explain why this score was given

### Strengths (Max 6)
- Bullet points
- Each must reference ATS data

### Weaknesses (Max 6)
- Bullet points
- ONLY if explicitly present in ATS data

### Improvements (Max 5)
- What to change
- Where (section)
- Expected ATS impact (high / medium / low)

RULES:
- Max 220 words
- No filler text
- No assumptions
- ATS-focused language only
`;

  try {
    const response = await axios.post(
      OLLAMA_URL,
      {
        model: MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.15, // stable output
          top_p: 0.85,
          num_predict: 2000, // ⬅️ hard limit output
          num_ctx: 2048, // ⬅️ smaller context = faster
        },
      },
      {
        timeout: 45_000, // realistic CPU timeout
      },
    );

    return response.data?.response?.trim() || "AI analysis completed but returned empty output.";
  } catch (error) {
    console.error("AI Verdict Error:", {
      message: error.message,
      status: error.response?.status,
    });

    return "AI analysis is temporarily unavailable. Please refer to the ATS breakdown above.";
  }
}
