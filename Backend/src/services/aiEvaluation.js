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
You are an AI career assistant explaining an ATS resume evaluation directly to the user.

Speak in a clear, supportive, human tone — as if you are personally reviewing their resume.
Do NOT sound robotic, system-like, or academic.

You must ONLY use the provided ATS data.
You must NOT invent sections, keywords, experience, or penalties.

Job Role: ${jobRole || "Not specified"}

ATS DATA:
${JSON.stringify(compactATS)}

OUTPUT FORMAT (STRICT):

Final Verdict
- 3–4 short sentences
- Speak directly to the user (use "you" and "your resume")
- Clearly explain why this score was achieved
- Keep the tone honest but encouraging

Strengths (Max 5)
- Bullet points
- Phrase each point as a positive observation about the user’s resume
- Each point must be backed by ATS data

Weaknesses (Max 5)
- Bullet points
- Only list weaknesses explicitly present in ATS data
- Phrase gently and constructively (no harsh language)

How You Can Improve (Max 5)
- Actionable steps
- Mention which section to update
- Mention expected ATS impact (high / medium / low)
- Write as guidance, not instructions

RULES:
- Max 220 words
- No filler text
- No assumptions
- No ATS jargon unless necessary
- Output must feel like feedback written for a real person
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
        timeout: 60_000, // realistic CPU timeout
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
