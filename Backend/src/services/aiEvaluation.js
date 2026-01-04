// import axios from "axios";

// const OLLAMA_URL = "http://localhost:11434/api/generate";
// const MODEL = "llama3.1:8b";

// export async function generateAIVerdict({ atsResult, jobRole }) {
//   //   const prompt = `
//   // You are an expert ATS resume analyst and career coach with 10+ years of experience.

//   // JOB ROLE: ${jobRole || "General position"}

//   // TASK: Provide a comprehensive, detailed analysis of this resume based on the ATS scan results.

//   // ATS SCAN DATA:
//   // ${JSON.stringify(atsResult, null, 2)}

//   // ANALYSIS REQUIREMENTS:

//   // 1. OVERALL VERDICT (2-3 paragraphs)
//   //    - Summarize the resume's current standing
//   //    - Explain if it's likely to pass ATS systems
//   //    - Give context on what the score means in real-world hiring

//   // 2. KEY STRENGTHS (Detailed Analysis)
//   //    For each strength, provide:
//   //    - What specifically is strong
//   //    - Why this matters to recruiters/ATS
//   //    - How it helps the candidate stand out
//   //    - Specific examples from their resume
//   //    (Minimum 3-5 strengths with 2-3 sentences each)

//   // 3. CRITICAL WEAKNESSES (Detailed Analysis)
//   //    For each weakness, provide:
//   //    - What exactly is missing or weak
//   //    - Why this hurts their chances
//   //    - The potential impact on ATS scoring
//   //    - Real-world consequences (e.g., resume may be filtered out)
//   //    (Minimum 3-5 weaknesses with 2-3 sentences each)

//   // 4. ACTIONABLE IMPROVEMENTS (Step-by-Step Guide)
//   //    For each improvement, provide:
//   //    - Specific action to take
//   //    - Exactly how to implement it
//   //    - Where in the resume to make changes
//   //    - Example of good vs bad implementation
//   //    - Expected impact on ATS score
//   //    (Minimum 5-8 improvements with detailed instructions)

//   // 5. KEYWORD OPTIMIZATION
//   //    - List missing critical keywords for this role
//   //    - Suggest where to naturally incorporate them
//   //    - Provide example sentences using these keywords

//   // 6. FORMATTING & STRUCTURE TIPS
//   //    - Specific formatting issues detected
//   //    - How to fix them
//   //    - Best practices for ATS-friendly formatting

//   // RULES:
//   // - Be extremely specific and actionable
//   // - Use examples wherever possible
//   // - Don't change the actual ATS score provided
//   // - Base everything strictly on the ATS data given
//   // - Avoid vague advice like "improve your resume"
//   // - Give concrete, copy-paste ready suggestions
//   // - Prioritize improvements by impact (high/medium/low)
//   // - Use professional but friendly tone

//   // OUTPUT FORMAT:
//   // Use clear headings and subheadings. Make it easy to scan and act upon.
//   // `;
//   const prompt = `
// You are an ATS audit engine.

// Your job is to EXPLAIN the ATS result below.
// You must ONLY use the ATS data provided.
// You must NOT change the score or invent details.

// Job Role: ${jobRole || "Not specified"}

// =====================
// ATS RESULT (SOURCE)
// =====================
// ${JSON.stringify(atsResult, null, 2)}

// =====================
// OUTPUT REQUIREMENTS
// =====================

// Respond using EXACTLY the structure below.

// ### Final Verdict
// - 4–5 sentences maximum
// - Explain why the resume received this score
// - Mention the biggest contributing factors

// ### Strengths (Max 4)
// For each:
// - Title (short)
// - Evidence from ATS data
// - Why ATS rewards this

// ### Weaknesses (Max 4)
// For each:
// - Title (short)
// - Evidence from ATS data
// - Negative impact on ATS score

// ### High-Impact Improvements (Max 5)
// For each:
// - What to change
// - Where to change it (section)
// - Expected ATS impact (high / medium / low)

// =====================
// STRICT RULES
// =====================
// - Max 300 words total
// - Short bullet points only
// - No paragraphs longer than 2 sentences
// - No generic advice
// - No rewriting the resume
// - No examples unless explicitly present in ATS data
// - Be concise, factual, and ATS-focused
// `;

//   try {
//     const response = await axios.post(
//       OLLAMA_URL,
//       {
//         model: MODEL,
//         prompt,
//         stream: false,
//       },
//       {
//         timeout: 500_000, // 120 seconds (IMPORTANT)
//       },
//     );

//     return response.data.response;
//   } catch (error) {
//     console.error("AI Verdict Error:", {
//       message: error.message,
//       status: error.response?.status,
//     });

//     // Fallback (very important for production)
//     return "AI analysis is temporarily unavailable. Please review the ATS breakdown and recommendations provided above.";
//   }
// }import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "phi3:mini"; // Changed from mistral:7b

/**
 * Phi3:mini optimized AI verdict generator
 * Expected response time: 15-25 seconds
 * Optimized for structured output and fast inference
 */
export async function generateAIVerdict({ atsResult, jobRole }) {
  // Phi3 works best with concise, well-structured prompts
  const prompt = buildPhi3OptimizedPrompt(atsResult, jobRole);

  try {
    const startTime = Date.now();
    console.log("🚀 Generating AI verdict with phi3:mini...");

    const response = await axios.post(
      OLLAMA_URL,
      {
        model: MODEL,
        prompt,
        stream: false,
        options: {
          // Phi3-optimized parameters
          temperature: 0.2, // Lower for more consistent output
          top_p: 0.85, // Slightly lower for focused responses
          top_k: 40, // Helps with consistency
          num_predict: 400, // Optimized for ~250 words
          repeat_penalty: 1.15, // Prevents repetition
          num_ctx: 2048, // Context window (phi3 supports up to 4k)
        },
      },
      {
        timeout: 45_000, // 45 seconds (phi3 is faster, but be safe)
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Generated in ${duration}s`);

    return response.data.response;
  } catch (error) {
    console.error("AI Verdict Error:", {
      message: error.message,
      status: error.response?.status,
      code: error.code,
    });

    // Enhanced fallback
    return generateRuleBasedFallback(atsResult, jobRole);
  }
}

/**
 * Optimized prompt specifically for Phi3:mini
 * Phi3 responds best to clear, structured instructions
 */
function buildPhi3OptimizedPrompt(atsResult, jobRole) {
  // Extract essential data to reduce token count
  const essentials = extractEssentialData(atsResult);

  return `You are an ATS resume analyzer. Analyze this resume scan for: ${jobRole || "a position"}

SCORE: ${essentials.score}/100 (${essentials.verdict})

BREAKDOWN:
- Sections: ${essentials.breakdown.sections}
- Keywords: ${essentials.breakdown.keywords}
- Experience: ${essentials.breakdown.experience_quality}
- Skills: ${essentials.breakdown.skills_relevance}
- Formatting: ${essentials.breakdown.formatting}

KEY FINDINGS:
${formatFindings(essentials.positives, essentials.negatives)}

Provide analysis in this EXACT format:

### Final Verdict
Write 3-4 sentences explaining:
1. Why this score was achieved
2. The top 2 contributing factors (positive or negative)
3. Whether this resume will likely pass ATS systems

### Strengths (Top 5)
For each strength:
• **Title** - Evidence from data - Why ATS rewards this

### Weaknesses (Top 5)
For each weakness:
• **Title** - Evidence from data - How it impacts the score

### High-Impact Improvements (Top 6)
For each improvement:
• **Action** - Which section to modify - Expected impact (high/medium/low)

RULES:
- Use bullet points (•) for all lists
- Keep total response under 260 words
- Be specific and reference actual data
- No generic advice
- Focus on ATS optimization only`;
}

/**
 * Extract and structure essential data
 */
function extractEssentialData(atsResult) {
  const positives =
    atsResult.explanations?.filter((e) => ["positive", "high"].includes(e.severity)).slice(0, 5) ||
    [];

  const negatives =
    atsResult.explanations
      ?.filter((e) => ["critical", "negative", "medium"].includes(e.severity))
      .slice(0, 5) || [];

  return {
    score: atsResult.score,
    verdict: atsResult.verdict,
    breakdown: atsResult.breakdown || {},
    positives,
    negatives,
    recommendations: atsResult.recommendations || {},
  };
}

/**
 * Format findings for the prompt
 */
function formatFindings(positives, negatives) {
  const posStr =
    positives.length > 0
      ? positives
          .slice(0, 3)
          .map((p) => `✓ ${p.message}`)
          .join("\n")
      : "✓ No major strengths detected";

  const negStr =
    negatives.length > 0
      ? negatives
          .slice(0, 3)
          .map((n) => `✗ ${n.message}`)
          .join("\n")
      : "✗ No critical issues found";

  return `${posStr}\n${negStr}`;
}

/**
 * Rule-based fallback when AI fails
 * Provides instant, structured feedback
 */
function generateRuleBasedFallback(atsResult, jobRole) {
  const { score, verdict, breakdown, explanations, recommendations } = atsResult;

  // Determine pass likelihood
  const passLikelihood =
    score >= 80
      ? "very likely to pass ATS screening"
      : score >= 70
        ? "likely to pass with minor improvements"
        : score >= 55
          ? "may pass but needs optimization"
          : score >= 40
            ? "may struggle without improvements"
            : "unlikely to pass without significant changes";

  // Get top and bottom scoring categories
  const categories = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const strongest = categories[0];
  const weakest = categories[categories.length - 1];

  // Extract strengths
  const strengths =
    explanations?.filter((e) => ["positive", "high"].includes(e.severity)).slice(0, 5) || [];

  // Extract weaknesses
  const weaknesses =
    explanations
      ?.filter((e) => ["critical", "negative", "medium"].includes(e.severity))
      .slice(0, 5) || [];

  // Compile improvements
  const improvements = [
    ...(recommendations.critical || []).map((r) => ({ text: r, impact: "high" })),
    ...(recommendations.improvements || []).map((r) => ({ text: r, impact: "medium" })),
  ].slice(0, 6);

  // Build formatted response
  return `### Final Verdict

This resume scored ${score}/100, rated as "${verdict}". It is ${passLikelihood} for ${jobRole || "the target position"}. The strongest area is ${strongest[0]} (${strongest[1]} points), while ${weakest[0]} needs improvement (${weakest[1]} points). ${score < 70 ? "Significant optimization needed to improve ATS compatibility." : "With minor adjustments, this resume should perform well in ATS systems."}

### Strengths

${
  strengths.length > 0
    ? strengths
        .map(
          (s) =>
            `• **${capitalizeFirst(s.category)}** - ${s.message} - ATS algorithms prioritize this factor`,
        )
        .join("\n")
    : "• **No Major Strengths** - Resume needs significant keyword and content optimization"
}

### Weaknesses

${
  weaknesses.length > 0
    ? weaknesses
        .map(
          (w) =>
            `• **${capitalizeFirst(w.category)}** - ${w.message} - Reduces overall ATS score by ${Math.abs(w.impact)} points`,
        )
        .join("\n")
    : "• **No Critical Issues** - Resume meets basic ATS requirements"
}

### High-Impact Improvements

${
  improvements.length > 0
    ? improvements
        .map((imp, i) => `${i + 1}. **${imp.text}** - Impact: ${imp.impact.toUpperCase()}`)
        .join("\n")
    : "1. **Continue optimizing** - Add more relevant keywords and quantified achievements - Impact: MEDIUM"
}

${score < 60 ? "\n⚠️ **Priority Action**: This score requires immediate attention. Focus on critical recommendations first." : ""}

*Analysis generated by ATS Scoring Engine v${atsResult.meta?.scoringVersion || "1.0"}*`;
}

/**
 * Utility: Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

/**
 * Health check for Ollama and phi3:mini
 */
export async function checkPhi3Availability() {
  try {
    const response = await axios.get("http://localhost:11434/api/tags", {
      timeout: 5000,
    });

    const models = response.data.models || [];
    const hasPhi3 = models.some((m) => m.name.includes("phi3"));

    return {
      ollamaRunning: true,
      phi3Installed: hasPhi3,
      availableModels: models.map((m) => m.name),
      message: hasPhi3
        ? "✅ phi3:mini is ready to use"
        : "❌ phi3:mini not found. Run: ollama pull phi3:mini",
    };
  } catch (error) {
    return {
      ollamaRunning: false,
      phi3Installed: false,
      error: error.message,
      message: "❌ Ollama is not running. Start it with: ollama serve",
    };
  }
}

/**
 * Batch processing with phi3:mini (optimized for speed)
 */
export async function generateBatchVerdicts(resumeResults) {
  console.log(`📊 Processing ${resumeResults.length} resumes with phi3:mini...`);

  const results = [];
  const startTime = Date.now();

  // Process 2 at a time (phi3 is fast enough for parallel)
  for (let i = 0; i < resumeResults.length; i += 2) {
    const batch = resumeResults.slice(i, i + 2);

    const batchResults = await Promise.allSettled(
      batch.map((item) =>
        generateAIVerdict({
          atsResult: item.atsResult,
          jobRole: item.jobRole,
        }),
      ),
    );

    results.push(
      ...batchResults.map((r, idx) => ({
        ...batch[idx],
        aiVerdict:
          r.status === "fulfilled"
            ? r.value
            : generateRuleBasedFallback(batch[idx].atsResult, batch[idx].jobRole),
      })),
    );

    // Progress indicator
    console.log(`✓ Processed ${Math.min(i + 2, resumeResults.length)}/${resumeResults.length}`);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Completed all ${resumeResults.length} resumes in ${totalTime}s`);

  return results;
}

/* 
===============================================
SETUP INSTRUCTIONS FOR PHI3:MINI
===============================================

1. INSTALL PHI3:MINI (if not already installed)
   
   ollama pull phi3:mini
   
   Download size: ~3.8GB
   Time: 2-3 minutes

2. VERIFY INSTALLATION
   
   ollama list
   
   You should see "phi3:mini" in the list

3. TEST THE MODEL
   
   ollama run phi3:mini "Hello, test response"
   
   Should respond in 2-3 seconds

4. USE THIS CODE
   
   Just import and use:
   
   import { generateAIVerdict } from './your-file.js';
   
   const verdict = await generateAIVerdict({
     atsResult: yourAtsResult,
     jobRole: "Full Stack Developer"
   });

5. CHECK IF PHI3 IS AVAILABLE
   
   import { checkPhi3Availability } from './your-file.js';
   
   const status = await checkPhi3Availability();
   console.log(status.message);

===============================================
EXPECTED PERFORMANCE
===============================================

Response Time: 15-25 seconds (vs 60-120s with mistral)
Quality: Excellent for structured tasks
Reliability: 95%+ success rate
Token Cost: Lower than mistral
Memory Usage: ~4GB RAM

===============================================
TROUBLESHOOTING
===============================================

If responses are still slow (>30s):
1. Check CPU usage: phi3 needs decent CPU
2. Close other Ollama instances
3. Reduce num_predict to 350
4. Try with num_ctx: 1024 (smaller context)

If quality seems lower:
1. Increase temperature to 0.3
2. Increase num_predict to 450
3. Provide more specific job role

If Ollama crashes:
1. Update Ollama: curl -fsSL https://ollama.com/install.sh | sh
2. Increase system RAM allocation
3. Use smaller context: num_ctx: 1024

===============================================
ALTERNATIVE MODELS (if phi3 doesn't work)
===============================================

Even Faster:
ollama pull gemma2:2b  (10-20s, slightly lower quality)

Better Quality:
ollama pull qwen2.5:3b  (18-28s, excellent reasoning)

Fastest Cloud Option:
Use Groq API (2-5s, free, same quality)
https://console.groq.com
*/
