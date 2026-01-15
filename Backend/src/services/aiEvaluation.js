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
              "You are an elite ATS resume consultant. You MUST respond with valid JSON only. No markdown, no preamble, no explanation - just pure JSON matching the exact schema provided. Each item must be UNIQUE and SPECIFIC - never repeat the same suggestions, percentages, or advice across different items.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
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
 * Build the structured prompt for JSON output with emphasis on uniqueness
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
- Experience: ${compactATS.breakdown?.experience_quality || compactATS.breakdown?.experience || "N/A"}%
- Education: ${compactATS.breakdown?.education || "N/A"}%
- Formatting: ${compactATS.breakdown?.formatting || "N/A"}%
- Skills: ${compactATS.breakdown?.skills_relevance || compactATS.breakdown?.skills || "N/A"}%
- Sections: ${compactATS.breakdown?.sections || "N/A"}%

**Detected Issues:**
${compactATS.critical.length > 0 ? compactATS.critical.map((c) => `• ${c}`).join("\n") : "• No critical issues detected"}

**CRITICAL INSTRUCTIONS FOR UNIQUENESS:**
- Each "working" item must focus on a DIFFERENT strength (e.g., one about keywords, one about formatting, one about experience depth)
- Each "hurting" item must identify a DIFFERENT problem (e.g., one about missing sections, one about weak metrics, one about poor keywords)
- Each "fixPlan" item must provide a DIFFERENT action with DIFFERENT expected outcomes and time estimates
- NEVER use the same percentage improvement (e.g., "10-15%") more than once
- NEVER use the same time estimate (e.g., "30-60 minutes") more than once
- Vary your language - use different phrases and examples for each item
- Make each advantage/impact SPECIFIC to that particular strength or weakness

**YOUR TASK:**
Respond with ONLY a valid JSON object. No markdown code blocks, no preamble, no explanation.

The JSON structure MUST be:
{
  "finalVerdict": "3 sentences explaining why they got this score. ${hasResumeText ? "Reference specific sections and elements from their actual resume (e.g., 'Your experience section shows...', 'Your skills list includes...')." : "Explain what typically causes this score range."} Be direct, specific, and encouraging. Mention the exact score and what it means.",
  
  "working": [
    {
      "title": "UNIQUE Strength Title (e.g., 'Strong Technical Keywords', 'Well-Structured Experience Section', 'Clear Visual Hierarchy')",
      "whatsStrong": "2-3 sentences explaining what SPECIFICALLY is strong. ${hasResumeText ? "Quote or reference actual content from their resume." : "Be specific about the type of content."} Use varied language.",
      "whyItMatters": "Explain the SPECIFIC ATS mechanism this affects (e.g., 'ATS algorithms assign higher relevance scores to resumes with industry-standard terminology' or 'Parsers can extract dates 40% more accurately with consistent formatting')",
      "advantage": "Provide a UNIQUE, specific competitive advantage with concrete numbers (e.g., '23% higher callback rate', '2.5x more likely to pass initial screening', 'Saves recruiters 45 seconds per review'). NEVER repeat the same percentage across items."
    }
    // Include 3-5 items, each focusing on a COMPLETELY DIFFERENT aspect
  ],
  
  "hurting": [
    {
      "title": "UNIQUE Problem Title (e.g., 'Missing Quantifiable Achievements', 'Weak Action Verbs', 'Inconsistent Date Formatting', 'Generic Skills List')",
      "issue": "2-3 sentences explaining the SPECIFIC problem. ${hasResumeText ? "Reference the exact section or content that's problematic." : "Be specific about what's typically missing."} Each problem must be DIFFERENT.",
      "typicalMistake": "${hasResumeText ? "Quote the EXACT weak phrase from their resume (e.g., 'Responsible for managing team' or 'Worked on various projects')" : "Provide a specific weak example (e.g., 'Managed projects' without metrics)"}",
      "betterApproach": "Provide a CONCRETE improved version with specific numbers and action verbs (e.g., 'Led 8-person engineering team to deliver 3 products, increasing user engagement by 47% and reducing load time by 2.3s'). Make it detailed and compelling.",
      "atsImpact": "Specify UNIQUE score impact using DIFFERENT numbers (e.g., 'Reduces score by 6-9 points', 'Costs 12-18 points', 'Loses 3-5 points per instance'). Include WHY (e.g., 'ATS keyword matching fails', 'Section parser errors increase').",
      "difficulty": "EASY, MEDIUM, or HARD with a SPECIFIC explanation (e.g., 'EASY - Just add numbers to existing bullets, 5 min per item' or 'MEDIUM - Requires researching industry keywords, 45 min total' or 'HARD - Need to reframe entire work history, 2-3 hours')"
    }
    // Include 4-6 items, each addressing a COMPLETELY DIFFERENT weakness
  ],
  
  "fixPlan": [
    {
      "priority": 1,
      "action": "UNIQUE Action Title (e.g., 'Add Quantifiable Metrics to Experience', 'Optimize for ATS Keywords', 'Restructure Education Section', 'Create Skills Matrix')",
      "howToDoIt": "Provide 3-4 sentences with SPECIFIC, actionable steps. Use exact instructions (e.g., 'Open each bullet point, identify the outcome, then add: revenue impact (%), time saved (hours), team size (#), or scope ($ value). Use formulas like: [Action Verb] + [What] + [Metric] + [Timeframe].')",
      "exampleOld": "${hasResumeText ? "Their ACTUAL current weak content from resume" : "A SPECIFIC weak example with detail (e.g., 'Managed social media accounts and posted content regularly')"}",
      "exampleNew": "A DETAILED improved version that's substantially better (e.g., 'Grew Instagram following from 2.3K to 47K followers in 6 months by implementing data-driven content strategy, resulting in 340% increase in engagement rate and $12K in influencer partnerships'). Make it impressive and specific.",
      "expectedOutcome": "Provide a UNIQUE prediction with SPECIFIC numbers and reasoning (e.g., 'Should increase score from 75 to 82-85 by improving keyword density from 45% to 68% and adding measurable achievements', or 'Expect 8-12 point boost by fixing section parsing errors that currently cost you 6 ranking points'). NEVER repeat the same outcome.",
      "time": "Provide a UNIQUE, realistic time estimate (e.g., '20-25 minutes', '1.5-2 hours', '45 minutes over 2 sessions', '3-4 hours across a weekend'). NEVER use the same time twice.",
      "impactLevel": "HIGH, MEDIUM, or LOW with specific reasoning (e.g., 'HIGH - Directly affects 30% of ATS score', 'MEDIUM - Improves recruiter perception but doesn't affect ATS parsing', 'LOW - Minor improvement but easy win')"
    }
    // Include 4-6 items, ordered by priority, each with COMPLETELY DIFFERENT actions, times, and outcomes
  ]
}

**UNIQUENESS CHECKLIST - VERIFY BEFORE RESPONDING:**
✓ Each "working" item discusses a different strength
✓ Each "hurting" item identifies a different problem  
✓ Each "fixPlan" item provides a different action
✓ All percentages and score impacts are DIFFERENT numbers
✓ All advantages are SPECIFIC and UNIQUE
✓ All examples are CONCRETE and DETAILED
✓ No repeated phrases or cookie-cutter language

**CONTENT REQUIREMENTS:**
- finalVerdict: 150-200 words with SPECIFIC score context
- Each working item: 100-150 words, highly specific
- Each hurting item: 120-180 words, concrete examples
- Each fixPlan item: 150-200 words, actionable steps
- Use varied vocabulary - don't repeat the same phrases
- Reference ACTUAL resume content when available
- Include SPECIFIC numbers, metrics, and percentages
- Make every item valuable and non-redundant

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
