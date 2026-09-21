// Manual smoke test for the AI provider layer.
//
// Usage (from the backend/ folder):
//   npm run test:ai
//
// It must return real model output. If it prints an error instead, the AI
// provider is misconfigured — the API intentionally has no offline fallback,
// so quiz generation would correctly fail with HTTP 503.

import "dotenv/config";
import { generateJSON, getAIStatus } from "./src/lib/ai.js";

async function main() {
  console.log("AI status:", getAIStatus());

  const prompt = `Generate exactly 2 multiple-choice questions about "Deadlocks in Operating Systems".
Difficulty level: MEDIUM.

Respond with ONLY valid JSON (no markdown, no backticks, no extra text), in this exact shape:

[
  {
    "questionText": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": "string (must exactly match one of the options)"
  }
]`;

  console.time("AI round trip");
  const { data, model } = await generateJSON(prompt);
  console.timeEnd("AI round trip");

  console.log("model used:", model);
  console.log(JSON.stringify(data, null, 2));

  if (!Array.isArray(data) || data.length !== 2) {
    throw new Error("Expected an array of exactly 2 questions.");
  }
  for (const question of data) {
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error("Expected 4 options per question.");
    }
    if (!question.options.includes(question.correctAnswer)) {
      throw new Error("correctAnswer must match one of the options exactly.");
    }
  }

  console.log("✅ AI provider is working and returned well-formed questions.");
}

main().catch((error) => {
  console.error("❌ AI smoke test failed:", error.message);
  process.exit(1);
});
