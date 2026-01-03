import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3.1:8b";

export async function generateAIVerdict({ atsResult, jobRole }) {
  //   const prompt = `
  // You are an expert ATS resume analyst and career coach with 10+ years of experience.

  // JOB ROLE: ${jobRole || "General position"}

  // TASK: Provide a comprehensive, detailed analysis of this resume based on the ATS scan results.

  // ATS SCAN DATA:
  // ${JSON.stringify(atsResult, null, 2)}

  // ANALYSIS REQUIREMENTS:

  // 1. OVERALL VERDICT (2-3 paragraphs)
  //    - Summarize the resume's current standing
  //    - Explain if it's likely to pass ATS systems
  //    - Give context on what the score means in real-world hiring

  // 2. KEY STRENGTHS (Detailed Analysis)
  //    For each strength, provide:
  //    - What specifically is strong
  //    - Why this matters to recruiters/ATS
  //    - How it helps the candidate stand out
  //    - Specific examples from their resume
  //    (Minimum 3-5 strengths with 2-3 sentences each)

  // 3. CRITICAL WEAKNESSES (Detailed Analysis)
  //    For each weakness, provide:
  //    - What exactly is missing or weak
  //    - Why this hurts their chances
  //    - The potential impact on ATS scoring
  //    - Real-world consequences (e.g., resume may be filtered out)
  //    (Minimum 3-5 weaknesses with 2-3 sentences each)

  // 4. ACTIONABLE IMPROVEMENTS (Step-by-Step Guide)
  //    For each improvement, provide:
  //    - Specific action to take
  //    - Exactly how to implement it
  //    - Where in the resume to make changes
  //    - Example of good vs bad implementation
  //    - Expected impact on ATS score
  //    (Minimum 5-8 improvements with detailed instructions)

  // 5. KEYWORD OPTIMIZATION
  //    - List missing critical keywords for this role
  //    - Suggest where to naturally incorporate them
  //    - Provide example sentences using these keywords

  // 6. FORMATTING & STRUCTURE TIPS
  //    - Specific formatting issues detected
  //    - How to fix them
  //    - Best practices for ATS-friendly formatting

  // RULES:
  // - Be extremely specific and actionable
  // - Use examples wherever possible
  // - Don't change the actual ATS score provided
  // - Base everything strictly on the ATS data given
  // - Avoid vague advice like "improve your resume"
  // - Give concrete, copy-paste ready suggestions
  // - Prioritize improvements by impact (high/medium/low)
  // - Use professional but friendly tone

  // OUTPUT FORMAT:
  // Use clear headings and subheadings. Make it easy to scan and act upon.
  // `;
  const prompt = `
You are an ATS audit engine.

Your job is to EXPLAIN the ATS result below.
You must ONLY use the ATS data provided.
You must NOT change the score or invent details.

Job Role: ${jobRole || "Not specified"}

=====================
ATS RESULT (SOURCE)
=====================
${JSON.stringify(atsResult, null, 2)}

=====================
OUTPUT REQUIREMENTS
=====================

Respond using EXACTLY the structure below.

### Final Verdict
- 4–5 sentences maximum
- Explain why the resume received this score
- Mention the biggest contributing factors

### Strengths (Max 4)
For each:
- Title (short)
- Evidence from ATS data
- Why ATS rewards this

### Weaknesses (Max 4)
For each:
- Title (short)
- Evidence from ATS data
- Negative impact on ATS score

### High-Impact Improvements (Max 5)
For each:
- What to change
- Where to change it (section)
- Expected ATS impact (high / medium / low)

=====================
STRICT RULES
=====================
- Max 300 words total
- Short bullet points only
- No paragraphs longer than 2 sentences
- No generic advice
- No rewriting the resume
- No examples unless explicitly present in ATS data
- Be concise, factual, and ATS-focused
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
        timeout: 500_000, // 120 seconds (IMPORTANT)
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
