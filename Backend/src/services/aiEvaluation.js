const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function generateAIVerdict({ atsResult, jobRole, resumeText, apiKey }) {
  const startTime = Date.now();

  // Validation
  if (!atsResult || typeof atsResult !== "object") {
    console.error("Invalid ATS result provided");
    return {
      error: "AI analysis unavailable due to invalid ATS input.",
      finalVerdict: "AI analysis unavailable due to invalid ATS input.",
      working: [],
      hurting: [],
      fixPlan: [],
    };
  }

  // Warn if resume text is missing
  if (!resumeText || resumeText.trim().length < 50) {
    console.warn("⚠️ Resume text not provided or too short. AI feedback will be generic.");
  }

  // Check for API key
  const groqApiKey = apiKey || process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.error("❌ GROQ_API_KEY not found in environment variables");
    return {
      error: "AI analysis unavailable. Please configure Groq API key.",
      finalVerdict:
        "AI analysis unavailable. Please configure Groq API key. Get one free at: https://console.groq.com/keys",
      working: [],
      hurting: [],
      fixPlan: [],
    };
  }

  // Prepare compact data for AI with actual resume content
  const compactATS = {
    score: atsResult.score,
    verdict: atsResult.verdict,
    resumeText: resumeText?.substring(0, 4000) || "Resume text not provided",
    topSignals: atsResult.explanations?.slice(0, 6) || [],
    critical: atsResult.recommendations?.critical?.slice(0, 6) || [],
    suggestions: atsResult.recommendations?.suggestions?.slice(0, 6) || [],
    breakdown: atsResult.breakdown || {},
  };

  // Build the prompt
  const prompt = buildStructuredPrompt(compactATS, jobRole);

  try {
    console.log(`🔄 Calling Groq API for job role: ${jobRole || "unspecified"}`);

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an elite ATS resume consultant. You MUST respond with valid JSON only. No markdown, no preamble, no explanation - just pure JSON matching the exact schema provided.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 3500,
        top_p: 0.9,
        stream: false,
      }),
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Groq API error: ${response.status}`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        errorMessage += ` - ${errorText}`;
      }

      console.error("❌ Groq API Error:", {
        status: response.status,
        message: errorMessage,
      });

      if (response.status === 401) {
        return {
          error: "Invalid API key",
          finalVerdict:
            "AI analysis unavailable: Invalid API key. Please check your Groq API key at https://console.groq.com/keys",
          working: [],
          hurting: [],
          fixPlan: [],
        };
      } else if (response.status === 429) {
        return {
          error: "Rate limit exceeded",
          finalVerdict:
            "AI analysis temporarily unavailable: Rate limit exceeded. Please try again in a moment.",
          working: [],
          hurting: [],
          fixPlan: [],
        };
      }

      throw new Error(errorMessage);
    }

    // Parse response
    const data = await response.json();
    const responseTime = Date.now() - startTime;
    console.log(`✅ Groq API responded in ${responseTime}ms`);

    // Extract the generated text
    const rawResponse = data.choices?.[0]?.message?.content?.trim();

    if (!rawResponse || rawResponse.length < 100) {
      console.error("AI response too short or empty:", rawResponse);
      return {
        error: "Incomplete response",
        finalVerdict: "AI analysis returned incomplete results. Please try again.",
        working: [],
        hurting: [],
        fixPlan: [],
      };
    }

    // Log token usage
    if (data.usage) {
      console.log(
        `📊 Tokens used: ${data.usage.total_tokens} (prompt: ${data.usage.prompt_tokens}, completion: ${data.usage.completion_tokens})`,
      );
    }

    // Parse and validate the JSON response
    return parseStructuredResponse(rawResponse);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error("❌ AI Verdict Generation Failed:", {
      message: error.message,
      time: `${responseTime}ms`,
      stack: error.stack,
    });

    return {
      error: error.message,
      finalVerdict:
        "AI analysis is temporarily unavailable. Please refer to the ATS breakdown above or try again in a moment.",
      working: [],
      hurting: [],
      fixPlan: [],
    };
  }
}

/**
 * Build the structured prompt for JSON output
 */
function buildStructuredPrompt(compactATS, jobRole) {
  const hasResumeText =
    compactATS.resumeText && compactATS.resumeText !== "Resume text not provided";

  return `You are analyzing a resume for a ${jobRole || "job position"} role.

${
  hasResumeText
    ? `**ACTUAL RESUME CONTENT:**
\`\`\`
${compactATS.resumeText}
\`\`\`
`
    : `**NOTE:** Resume text was not provided. Provide feedback based on scores.`
}

**ATS ANALYSIS DATA:**
- Overall Score: ${compactATS.score}/100
- Verdict: ${compactATS.verdict || "Not specified"}

**Section Breakdown:**
- Keywords: ${compactATS.breakdown?.keywords || "N/A"}%
- Experience: ${compactATS.breakdown?.experience || "N/A"}%
- Education: ${compactATS.breakdown?.education || "N/A"}%
- Formatting: ${compactATS.breakdown?.formatting || "N/A"}%
- Skills: ${compactATS.breakdown?.skills || "N/A"}%

**Detected Issues:**
${compactATS.critical.length > 0 ? compactATS.critical.map((c) => `• ${c}`).join("\n") : "• No critical issues detected"}

**YOUR TASK:**
Respond with ONLY a valid JSON object. No markdown code blocks, no preamble, no explanation.

The JSON structure MUST be:
{
  "finalVerdict": "5-7 sentences explaining why they got this score. ${hasResumeText ? "Reference specific elements from their resume." : "Explain what causes this score range."} Be direct and encouraging.",
  "working": [
    {
      "title": "Strength Title",
      "whatsStrong": "2-3 sentences explaining what's strong",
      "whyItMatters": "Technical explanation of ATS behavior and why this matters",
      "advantage": "Quantified competitive advantage this provides"
    }
    // 3-5 items total
  ],
  "hurting": [
    {
      "title": "Problem Title",
      "issue": "2-3 sentences explaining the problem clearly",
      "typicalMistake": "${hasResumeText ? "Quote from their resume showing the weak content" : "Example of typical weak content"}",
      "betterApproach": "Improved version with specific examples and metrics",
      "atsImpact": "Specific score impact with numbers (e.g., 'Costs 8-12 points')",
      "difficulty": "EASY, MEDIUM, or HARD with brief explanation"
    }
    // 4-6 items total
  ],
  "fixPlan": [
    {
      "priority": 1,
      "action": "Clear action title",
      "howToDoIt": "3-4 sentences with step-by-step instructions",
      "exampleOld": "${hasResumeText ? "Their current weak version" : "Typical weak example"}",
      "exampleNew": "Improved version with metrics and impact words",
      "expectedOutcome": "Score improvement prediction with reasoning",
      "time": "Realistic time estimate (e.g., '15-30 minutes')",
      "impactLevel": "HIGH, MEDIUM, or LOW"
    }
    // 4-6 items total, ordered by priority
  ]
}

**CONTENT REQUIREMENTS:**
- finalVerdict: 150-200 words
- Each working item: 100-150 words total across all fields
- Each hurting item: 120-180 words total across all fields
- Each fixPlan item: 150-200 words total across all fields
- Be specific, actionable, and encouraging
- Use "you" and "your" throughout
- Include actual numbers and metrics
- Reference specific resume content when available

Respond with ONLY the JSON object. Start with { and end with }. No other text.`;
}

/**
 * Parse and validate the structured JSON response
 */
function parseStructuredResponse(rawResponse) {
  try {
    // Remove markdown code blocks if present
    let cleaned = rawResponse.trim();
    cleaned = cleaned.replace(/^```json\n?/i, "").replace(/\n?```$/i, "");
    cleaned = cleaned.trim();

    // Parse JSON
    const parsed = JSON.parse(cleaned);

    // Validate structure
    if (!parsed.finalVerdict || typeof parsed.finalVerdict !== "string") {
      throw new Error("Missing or invalid finalVerdict");
    }

    if (!Array.isArray(parsed.working)) {
      throw new Error("Missing or invalid working array");
    }

    if (!Array.isArray(parsed.hurting)) {
      throw new Error("Missing or invalid hurting array");
    }

    if (!Array.isArray(parsed.fixPlan)) {
      throw new Error("Missing or invalid fixPlan array");
    }

    // Validate working items
    parsed.working.forEach((item, idx) => {
      if (!item.title || !item.whatsStrong || !item.whyItMatters || !item.advantage) {
        throw new Error(`Invalid working item at index ${idx}`);
      }
    });

    // Validate hurting items
    parsed.hurting.forEach((item, idx) => {
      if (
        !item.title ||
        !item.issue ||
        !item.typicalMistake ||
        !item.betterApproach ||
        !item.atsImpact ||
        !item.difficulty
      ) {
        throw new Error(`Invalid hurting item at index ${idx}`);
      }
    });

    // Validate fixPlan items
    parsed.fixPlan.forEach((item, idx) => {
      if (
        !item.priority ||
        !item.action ||
        !item.howToDoIt ||
        !item.exampleOld ||
        !item.exampleNew ||
        !item.expectedOutcome ||
        !item.time ||
        !item.impactLevel
      ) {
        throw new Error(`Invalid fixPlan item at index ${idx}`);
      }
    });

    console.log("✅ Successfully parsed and validated structured response");
    return parsed;
  } catch (error) {
    console.error("❌ Failed to parse AI response as JSON:", error.message);
    console.error("Raw response:", rawResponse.substring(0, 500));

    // Return fallback structure
    return {
      error: "Failed to parse AI response",
      finalVerdict: "AI analysis generated an invalid response format. Please try again.",
      working: [],
      hurting: [],
      fixPlan: [],
    };
  }
}

/**
 * Helper function to extract text from resume
 */
export function extractResumeText(resumeFile) {
  console.warn("extractResumeText not implemented - returning placeholder");
  return "Resume text extraction not configured";
}

// Default export
export default generateAIVerdict;
