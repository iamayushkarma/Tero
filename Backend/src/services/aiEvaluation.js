const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "phi3:mini";

/**
 * Enhanced Phi3:mini AI verdict generator
 * Target response time: 20-30 seconds
 * Optimized for detailed, structured output
 */
export async function generateAIVerdict({ atsResult, jobRole }) {
  const prompt = buildDetailedPhi3Prompt(atsResult, jobRole);

  try {
    const startTime = Date.now();
    console.log("🚀 Generating detailed AI verdict with phi3:mini...");

    const response = await axios.post(
      OLLAMA_URL,
      {
        model: MODEL,
        prompt,
        stream: false,
        options: {
          // Adjusted for more detailed output
          temperature: 0.3, // Slightly higher for more varied language
          top_p: 0.9, // Increased for better coherence
          top_k: 50, // More diverse token selection
          num_predict: 800, // INCREASED: ~500-600 words for detail
          repeat_penalty: 1.1, // Lower to allow natural repetition of terms
          num_ctx: 3072, // Larger context for better understanding
        },
      },
      {
        timeout: 60_000, // 60 seconds safety margin
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

    return generateRuleBasedFallback(atsResult, jobRole);
  }
}

/**
 * Enhanced detailed prompt for Phi3:mini
 * Requests more comprehensive analysis
 */
function buildDetailedPhi3Prompt(atsResult, jobRole) {
  const essentials = extractEssentialData(atsResult);

  return `You are an expert ATS resume analyzer. Provide a comprehensive analysis of this resume for: ${jobRole || "a position"}

RESUME METRICS:
- Overall Score: ${essentials.score}/100 (${essentials.verdict})
- Section Scores: ${essentials.breakdown.sections || 0}
- Keyword Match: ${essentials.breakdown.keywords || 0}
- Experience Quality: ${essentials.breakdown.experience_quality || 0}
- Skills Relevance: ${essentials.breakdown.skills_relevance || 0}
- Formatting: ${essentials.breakdown.formatting || 0}

DETECTED ISSUES:
${formatDetailedFindings(essentials.positives, essentials.negatives)}

Provide your analysis in this EXACT format:

### Final Verdict
Write 4-6 sentences that include:
1. Clear explanation of why the resume achieved this ${essentials.score}/100 score
2. Analysis of the top 2-3 factors that most impacted the score (both positive and negative)
3. Assessment of ATS pass likelihood with reasoning
4. Overall recommendation on urgency of improvements needed

### Strengths (Top 5)
For EACH strength, write 2-3 sentences covering:
• **Strength Title** - Specific evidence from the resume data showing this strength - Explanation of why ATS systems reward this particular element - Quantify impact when possible (e.g., "adds 15 points to score")

### Weaknesses (Top 5)
For EACH weakness, write 2-3 sentences covering:
• **Weakness Title** - Specific evidence showing the gap or issue - Clear explanation of how this reduces ATS score - Mention the scoring penalty (e.g., "reduces score by 8 points")

### High-Impact Improvements (Top 6)
For EACH improvement, write 2 sentences covering:
• **Action to Take** - Which specific resume section needs this change - Why this particular change will improve ATS scoring - Expected impact level (HIGH/MEDIUM/LOW) with brief justification

CRITICAL REQUIREMENTS:
- Write naturally and conversationally, not in bullet fragments
- Every point should be 2-3 complete sentences with specific details
- Reference actual data points from the metrics provided
- Explain the "why" behind each observation
- Use concrete examples, not generic advice
- Focus specifically on ATS optimization factors
- Total response should be 500-600 words for comprehensive detail`;
}

/**
 * Extract essential data with more details
 */
function extractEssentialData(atsResult) {
  const positives =
    atsResult.explanations?.filter((e) => ["positive", "high"].includes(e.severity)).slice(0, 6) ||
    [];

  const negatives =
    atsResult.explanations
      ?.filter((e) => ["critical", "negative", "medium"].includes(e.severity))
      .slice(0, 6) || [];

  return {
    score: atsResult.score,
    verdict: atsResult.verdict,
    breakdown: atsResult.breakdown || {},
    positives,
    negatives,
    recommendations: atsResult.recommendations || {},
    meta: atsResult.meta || {},
  };
}

/**
 * Format findings with more context for detailed analysis
 */
function formatDetailedFindings(positives, negatives) {
  const posStr =
    positives.length > 0
      ? positives
          .slice(0, 5)
          .map((p) => `✓ ${p.category}: ${p.message} (Impact: +${Math.abs(p.impact || 0)} points)`)
          .join("\n")
      : "✓ No significant strengths identified";

  const negStr =
    negatives.length > 0
      ? negatives
          .slice(0, 5)
          .map((n) => `✗ ${n.category}: ${n.message} (Impact: ${n.impact || 0} points)`)
          .join("\n")
      : "✗ No critical issues detected";

  return `Positive Factors:\n${posStr}\n\nNegative Factors:\n${negStr}`;
}

/**
 * Enhanced rule-based fallback with detailed explanations
 */
function generateRuleBasedFallback(atsResult, jobRole) {
  const { score, verdict, breakdown, explanations, recommendations } = atsResult;

  // Detailed pass likelihood assessment
  const passAnalysis = getPassLikelihoodAnalysis(score);

  // Get scored categories
  const categories = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const strongest = categories[0];
  const weakest = categories[categories.length - 1];

  // Extract and categorize findings
  const strengths =
    explanations?.filter((e) => ["positive", "high"].includes(e.severity)).slice(0, 5) || [];

  const weaknesses =
    explanations
      ?.filter((e) => ["critical", "negative", "medium"].includes(e.severity))
      .slice(0, 5) || [];

  // Prioritized improvements
  const improvements = [
    ...(recommendations.critical || []).map((r) => ({ text: r, impact: "HIGH" })),
    ...(recommendations.improvements || []).map((r) => ({ text: r, impact: "MEDIUM" })),
  ].slice(0, 6);

  return `### Final Verdict

This resume achieved a score of ${score}/100, placing it in the "${verdict}" category. ${passAnalysis.assessment} The analysis reveals that ${strongest[0]} is the strongest performing area with ${strongest[1]} points, demonstrating ${getStrengthReason(strongest[0])}. However, ${weakest[0]} is the weakest component at ${weakest[1]} points, which ${getWeaknessImpact(weakest[0])}. ${passAnalysis.recommendation} ${score < 70 ? "Immediate optimization is required to improve ATS compatibility and increase the chances of passing automated screening systems." : "With targeted improvements in the identified weak areas, this resume should perform well in most ATS systems."}

### Strengths

${
  strengths.length > 0
    ? strengths
        .map(
          (s) =>
            `• **${capitalizeFirst(s.category)} Excellence** - The resume demonstrates strong ${s.category} with ${s.message}. This is valuable because ATS algorithms prioritize ${s.category} matching and assign significant weight to this factor. This strength contributes approximately +${Math.abs(s.impact || 5)} points to the overall score, helping the resume stand out in automated screening.`,
        )
        .join("\n\n")
    : "• **Limited Distinguishing Features** - The resume currently lacks strong differentiating factors that ATS systems actively reward. This means it's scoring based primarily on basic requirements rather than excelling in key areas. To improve, focus on adding quantified achievements, relevant keywords, and industry-specific terminology that will boost scores across multiple categories."
}

### Weaknesses

${
  weaknesses.length > 0
    ? weaknesses
        .map(
          (w) =>
            `• **${capitalizeFirst(w.category)} Deficiency** - Analysis reveals ${w.message}, which is a significant concern for ATS optimization. This weakness directly impacts the resume's ability to pass automated filters because ${getWeaknessExplanation(w.category)}. The scoring penalty for this issue is approximately ${Math.abs(w.impact || 5)} points, making it a priority area for improvement.`,
        )
        .join("\n\n")
    : '• **No Critical Issues Detected** - The resume meets fundamental ATS requirements without major deficiencies. While this is positive, it also suggests the resume is performing at a baseline level. Consider adding more strategic optimizations to move from "acceptable" to "excellent" in ATS scoring systems.'
}

### High-Impact Improvements

${
  improvements.length > 0
    ? improvements
        .map(
          (imp, i) =>
            `${i + 1}. **${imp.text}** - This improvement should be implemented in ${getRelevantSection(imp.text)} to directly address scoring gaps. ${getImpactExplanation(imp.text, imp.impact)} Expected impact: **${imp.impact}** - ${getImpactJustification(imp.impact)}.`,
        )
        .join("\n\n")
    : "1. **Strategic Keyword Enhancement** - Add 8-12 industry-specific keywords throughout the experience and skills sections. This will improve keyword matching scores which typically account for 25-30% of ATS evaluation. Expected impact: **MEDIUM** - Can increase score by 5-8 points with proper implementation."
}

${score < 60 ? "\n⚠️ **URGENT ACTION REQUIRED**: This score places the resume in a high-risk category for ATS rejection. Prioritize addressing critical recommendations within the next revision cycle to significantly improve pass rates." : score < 75 ? "\n⚡ **Action Recommended**: While not critical, improvements in weak areas will notably enhance ATS performance and interview callback rates." : "\n✅ **Good Foundation**: This resume has solid ATS compatibility. Fine-tuning the identified areas will optimize it for maximum performance."}

*Comprehensive analysis generated by ATS Scoring Engine v${atsResult.meta?.scoringVersion || "1.0"}*`;
}

// Helper functions for detailed explanations

function getPassLikelihoodAnalysis(score) {
  if (score >= 80) {
    return {
      assessment:
        "This score indicates a very high likelihood of passing initial ATS screening, as it exceeds the typical 75-point threshold used by most enterprise ATS systems.",
      recommendation:
        "The resume is well-optimized and should successfully navigate automated filters in most industries.",
    };
  } else if (score >= 70) {
    return {
      assessment:
        "This score suggests a good probability of passing ATS screening, though performance may vary depending on the specific system's configuration and job requirements.",
      recommendation:
        "Minor enhancements in weak areas will push this resume into the excellent category.",
    };
  } else if (score >= 55) {
    return {
      assessment:
        "This score places the resume in a moderate risk zone where it may pass some ATS systems but could be filtered out by more stringent configurations.",
      recommendation:
        "Strategic optimization is needed to reliably clear ATS hurdles across different platforms.",
    };
  } else if (score >= 40) {
    return {
      assessment:
        "This score indicates significant challenges with ATS compatibility, suggesting the resume will struggle to pass automated screening in competitive applicant pools.",
      recommendation: "Substantial improvements are necessary to meet minimum ATS requirements.",
    };
  } else {
    return {
      assessment:
        "This score signals critical deficiencies that will likely result in automatic rejection by most ATS systems before human review.",
      recommendation: "Comprehensive restructuring and optimization are essential.",
    };
  }
}

function getStrengthReason(category) {
  const reasons = {
    keywords: "effective use of industry-relevant terminology and job-specific language",
    formatting: "clean structure that ATS parsers can easily read and categorize",
    experience: "well-presented work history with clear progression and relevant roles",
    skills: "strong alignment between listed competencies and target position requirements",
    sections: "comprehensive coverage of all standard resume components",
  };
  return reasons[category] || "positive performance in this evaluation criterion";
}

function getWeaknessImpact(category) {
  const impacts = {
    keywords:
      "significantly reduces matching scores and may cause the resume to be filtered out for keyword deficiency",
    formatting:
      "can cause parsing errors that misclassify or lose important information during ATS processing",
    experience: "weakens the perceived candidate qualification level and reduces relevance scoring",
    skills: "creates gaps in competency matching that lower overall candidate-job fit scores",
    penalties: "introduces deductions that compound other scoring issues",
  };
  return impacts[category] || "negatively affects the overall ATS evaluation score";
}

function getWeaknessExplanation(category) {
  const explanations = {
    keywords:
      "ATS systems rely heavily on keyword density and matching to rank candidates, and insufficient keywords result in poor ranking",
    formatting:
      "improperly formatted resumes cause parsing failures that lead to information loss or misclassification",
    experience:
      "ATS algorithms evaluate experience relevance, duration, and progression as key qualification indicators",
    skills:
      "modern ATS systems use semantic matching to assess skill alignment, and gaps reduce matching confidence",
    contact:
      "incomplete or non-standard contact information prevents ATS from properly categorizing candidate details",
  };
  return explanations[category] || "this element is heavily weighted in ATS scoring algorithms";
}

function getRelevantSection(improvement) {
  const text = improvement.toLowerCase();
  if (text.includes("keyword") || text.includes("terminology"))
    return "experience and skills sections";
  if (text.includes("format") || text.includes("structure")) return "overall document structure";
  if (text.includes("contact")) return "header/contact information section";
  if (text.includes("skill")) return "skills and competencies section";
  if (text.includes("experience") || text.includes("achievement")) return "work experience section";
  return "relevant resume sections";
}

function getImpactExplanation(improvement, impact) {
  const text = improvement.toLowerCase();
  if (text.includes("keyword")) {
    return "Keyword optimization directly affects the primary ATS ranking factor, with each relevant keyword typically adding 0.5-2 points to matching scores.";
  } else if (text.includes("format")) {
    return "Formatting corrections prevent parsing errors that can cause 10-15 point deductions when information is misclassified or lost.";
  } else if (text.includes("quantif")) {
    return "Adding quantified achievements increases credibility scoring and often triggers bonus points in experience evaluation algorithms.";
  }
  return "This targeted change addresses a specific scoring deficiency identified in the analysis.";
}

function getImpactJustification(impact) {
  if (impact === "HIGH") {
    return "This change can improve the score by 8-15 points and should be prioritized in the next revision";
  } else if (impact === "MEDIUM") {
    return "This change can add 4-8 points to the overall score and represents good optimization value";
  } else {
    return "This change provides incremental improvement of 2-4 points and should be addressed after higher priorities";
  }
}

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
        ? "✅ phi3:mini is ready for detailed analysis"
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
 * Optimized batch processing
 */
export async function generateBatchVerdicts(resumeResults) {
  console.log(`📊 Processing ${resumeResults.length} resumes with detailed analysis...`);
  const results = [];
  const startTime = Date.now();

  // Process sequentially for detailed output to avoid overwhelming phi3
  for (let i = 0; i < resumeResults.length; i++) {
    const item = resumeResults[i];
    console.log(`Processing resume ${i + 1}/${resumeResults.length}...`);

    try {
      const aiVerdict = await generateAIVerdict({
        atsResult: item.atsResult,
        jobRole: item.jobRole,
      });

      results.push({
        ...item,
        aiVerdict,
      });
    } catch (error) {
      console.error(`Error processing resume ${i + 1}:`, error.message);
      results.push({
        ...item,
        aiVerdict: generateRuleBasedFallback(item.atsResult, item.jobRole),
      });
    }

    console.log(`✓ Completed ${i + 1}/${resumeResults.length}`);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const avgTime = (totalTime / resumeResults.length).toFixed(1);
  console.log(
    `✅ Completed all ${resumeResults.length} resumes in ${totalTime}s (avg: ${avgTime}s per resume)`,
  );

  return results;
}
