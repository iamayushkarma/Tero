const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

/**
 * Generate ATS-based AI explanation using Groq
 * @param {Object} params - Parameters
 * @param {Object} params.atsResult - ATS analysis result
 * @param {string} params.jobRole - Target job role
 * @param {string} params.resumeText - The actual resume content (REQUIRED for strong analysis)
 * @param {string} params.apiKey - Optional: Groq API key (uses env var if not provided)
 * @returns {Promise<string>} - Formatted AI feedback
 */
export async function generateAIVerdict({ atsResult, jobRole, resumeText, apiKey }) {
  const startTime = Date.now();

  // Validation
  if (!atsResult || typeof atsResult !== "object") {
    console.error("Invalid ATS result provided");
    return "AI analysis unavailable due to invalid ATS input.";
  }

  // Warn if resume text is missing
  if (!resumeText || resumeText.trim().length < 50) {
    console.warn("⚠️ Resume text not provided or too short. AI feedback will be generic.");
  }

  // Check for API key
  const groqApiKey = apiKey || process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.error("❌ GROQ_API_KEY not found in environment variables");
    return "AI analysis unavailable. Please configure Groq API key. Get one free at: https://console.groq.com/keys";
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
  const prompt = buildPrompt(compactATS, jobRole);

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
              "You are an elite ATS resume consultant. You provide detailed, structured feedback with clear HTML-friendly formatting. Use proper spacing, line breaks, and structure that renders beautifully in web interfaces. Always use bullet points (•), proper paragraph breaks, and clear visual hierarchy.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 3000,
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
        return "AI analysis unavailable: Invalid API key. Please check your Groq API key at https://console.groq.com/keys";
      } else if (response.status === 429) {
        return "AI analysis temporarily unavailable: Rate limit exceeded. Please try again in a moment.";
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
      return "AI analysis returned incomplete results. Please try again.";
    }

    // Log token usage
    if (data.usage) {
      console.log(
        `📊 Tokens used: ${data.usage.total_tokens} (prompt: ${data.usage.prompt_tokens}, completion: ${data.usage.completion_tokens})`,
      );
    }

    return formatResponse(rawResponse);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error("❌ AI Verdict Generation Failed:", {
      message: error.message,
      time: `${responseTime}ms`,
      stack: error.stack,
    });

    return "AI analysis is temporarily unavailable. Please refer to the ATS breakdown above or try again in a moment.";
  }
}

/**
 * Build the detailed prompt for Groq with structured output requirements
 */
function buildPrompt(compactATS, jobRole) {
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
Create a comprehensive, well-formatted analysis. Use ONLY the following structure with proper spacing and line breaks.

---

📊 **WHY YOU GOT THIS SCORE**

[Write 5-7 sentences explaining the score. ${hasResumeText ? "Reference specific elements from their actual resume." : "Explain what typically causes this score range."} Use multiple paragraphs with blank lines between them for readability.]

---

✅ **WHAT'S WORKING**

Provide 3-5 strength points. Format each as:

**[Strength Title]**

- **What's strong:** [2-3 sentences explaining the element]

- **Why it matters for ATS:** [Technical explanation of ATS behavior]

- **Competitive advantage:** [Quantified benefit]

${hasResumeText ? "• **Specific example:** [Quote from resume]" : ""}

[blank line between each strength point]

---

⚠️ **WHAT'S HURTING YOU**

Provide 4-6 problem points. Format each as:

**[Problem Title]**

- **The issue:** [2-3 sentences explaining the problem]

${
  hasResumeText
    ? `• **❌ Current:** [Quote their weak content]

- **✅ Better:** [Improved version with metrics]`
    : `• **❌ Typical mistake:** [Weak example]

- **✅ Better approach:** [Improved version]`
}

- **ATS Impact:** [Specific score impact with numbers]

- **Fix difficulty:** [EASY/MEDIUM/HARD with explanation]

[blank line between each problem point]

---

🔧 **HOW TO FIX IT - PRIORITY ACTION PLAN**

Provide 4-6 action items. Format each as:

**Priority [#]: [Action Title]**

- **What to do:** [1-2 sentence instruction]

- **How to do it:** [3-4 sentence step-by-step]

${hasResumeText ? "• **Your specific fix:**" : "• **Example transformation:**"}
  
  ❌ **OLD:** [weak version]
  
  ✅ **NEW:** [improved version]

- **Expected outcome:** [Score improvement prediction]

- **Time investment:** [Realistic estimate]

- **Impact level:** 🔥🔥🔥 HIGH / 🔥🔥 MEDIUM / 🔥 LOW

[blank line between each priority]

---

**CRITICAL FORMATTING RULES:**
1. Add TWO line breaks between major sections (use ----)
2. Add ONE blank line between each point within a section
3. Add ONE blank line after each sub-bullet
4. Use bullet points (•) for ALL lists
5. Use **bold** for headers and emphasis
6. Put ❌ and ✅ examples on separate lines with blank lines around them
7. Each bullet should be 2-4 sentences (substantial)
8. Total length: 600-800 words

**SPACING EXAMPLE:**
**Problem Title**

- **The issue:** First sentence. Second sentence.

- **❌ Current:** Weak example here

- **✅ Better:** Improved example with lots of details

- **ATS Impact:** Explanation with numbers

- **Fix difficulty:** EASY - explanation

[blank line here before next point]

Be direct, encouraging, and specific. Use "you" throughout.`;
}

/**
 * Format the AI response for perfect frontend display
 */
function formatResponse(text) {
  let formatted = text
    // Remove any markdown headers and replace with clean format
    .replace(/#{1,6}\s*/g, "")

    // Ensure main section headers have proper spacing
    .replace(/📊\s*\*\*WHY YOU GOT THIS SCORE\*\*/gi, "\n\n📊 **WHY YOU GOT THIS SCORE**\n\n")
    .replace(/✅\s*\*\*WHAT'S WORKING\*\*/gi, "\n\n---\n\n✅ **WHAT'S WORKING**\n\n")
    .replace(/⚠️\s*\*\*WHAT'S HURTING YOU\*\*/gi, "\n\n---\n\n⚠️ **WHAT'S HURTING YOU**\n\n")
    .replace(
      /🔧\s*\*\*HOW TO FIX IT.*?\*\*/gi,
      "\n\n---\n\n🔧 **HOW TO FIX IT - PRIORITY ACTION PLAN**\n\n",
    )

    // Ensure subsection headers (point titles) have spacing
    .replace(/\n\*\*([^*\n]+)\*\*\n/g, "\n\n**$1**\n\n")

    // Ensure bullets have consistent spacing
    .replace(/\n•/g, "\n\n•")

    // Format ❌ and ✅ examples with extra spacing
    .replace(/•\s*❌\s*([^:]+):/g, "\n• **❌ $1:**")
    .replace(/•\s*✅\s*([^:]+):/g, "\n• **✅ $1:**")
    .replace(/❌\s*OLD:/gi, "\n\n❌ **OLD:**")
    .replace(/✅\s*NEW:/gi, "\n\n✅ **NEW:**")
    .replace(/❌\s*Current:/gi, "\n\n❌ **Current:**")
    .replace(/✅\s*Better:/gi, "\n\n✅ **Better:**")

    // Ensure Priority items have spacing
    .replace(/\*\*Priority\s+(\d+):/g, "\n\n**Priority $1:**")

    // Clean up common sub-bullets
    .replace(/•\s*\*\*What's strong:\*\*/g, "\n• **What's strong:**")
    .replace(/•\s*\*\*Why it matters for ATS:\*\*/g, "\n• **Why it matters for ATS:**")
    .replace(/•\s*\*\*Competitive advantage:\*\*/g, "\n• **Competitive advantage:**")
    .replace(/•\s*\*\*Specific example:\*\*/g, "\n• **Specific example:**")
    .replace(/•\s*\*\*The issue:\*\*/g, "\n• **The issue:**")
    .replace(/•\s*\*\*ATS Impact:\*\*/g, "\n• **ATS Impact:**")
    .replace(/•\s*\*\*Fix difficulty:\*\*/g, "\n• **Fix difficulty:**")
    .replace(/•\s*\*\*What to do:\*\*/g, "\n• **What to do:**")
    .replace(/•\s*\*\*How to do it:\*\*/g, "\n• **How to do it:**")
    .replace(/•\s*\*\*Your specific fix:\*\*/g, "\n• **Your specific fix:**")
    .replace(/•\s*\*\*Example transformation:\*\*/g, "\n• **Example transformation:**")
    .replace(/•\s*\*\*Expected outcome:\*\*/g, "\n• **Expected outcome:**")
    .replace(/•\s*\*\*Time investment:\*\*/g, "\n• **Time investment:**")
    .replace(/•\s*\*\*Impact level:\*\*/g, "\n• **Impact level:**")

    // Ensure section dividers have proper spacing
    .replace(/\n---\n/g, "\n\n---\n\n")

    // Clean up excessive blank lines (but keep intentional double breaks)
    .replace(/\n{4,}/g, "\n\n\n")

    // Ensure paragraphs within sections have spacing
    .replace(/([.!?])\s+([A-Z])/g, "$1\n\n$2")

    // Final cleanup
    .trim();

  return formatted;
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
