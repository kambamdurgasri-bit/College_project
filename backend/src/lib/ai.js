// Single entry point for every AI call in the backend.
//
// There are NO canned/templated fallbacks here on purpose: if no provider is
// reachable we throw AIUnavailableError so the API can answer with a real
// error instead of quietly storing fake content in the database.
//
// Providers:
//   1. OpenRouter (primary) — OpenAI-compatible chat completions, uses
//      OPENROUTERAI_API. Implemented with global fetch, so no extra SDK.
//   2. Google Gemini        — only when GEMINI_API_KEY is configured.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Tried in order until one returns usable output. Override with OPENROUTER_MODEL.
const DEFAULT_OPENROUTER_MODELS = [
  "google/gemini-3.8-flash",
  "openai/gpt-5.6-luna",
  "anthropic/claude-haiku-4.5",
];

const REQUEST_TIMEOUT_MS = 60000;
const ATTEMPTS_PER_MODEL = 2;

// OpenRouter reserves credits for max_tokens up front. Large models default to
// 64000, which a low-balance account can't afford (HTTP 402), so we ask for a
// deliberately small completion instead.
const MAX_TOKENS = Number(process.env.AI_MAX_TOKENS || 2000);

export class AIUnavailableError extends Error {
  constructor(message = "No AI provider is reachable. Set OPENROUTERAI_API in backend/.env.") {
    super(message);
    this.name = "AIUnavailableError";
    this.status = 503;
  }
}

export function openRouterModels() {
  const preferred = (process.env.OPENROUTER_MODEL || "").trim();
  const list = preferred ? [preferred] : [];
  for (const model of DEFAULT_OPENROUTER_MODELS) {
    if (!list.includes(model)) list.push(model);
  }
  return list;
}

export function isAIConfigured() {
  return Boolean(process.env.OPENROUTERAI_API || process.env.GEMINI_API_KEY);
}

export function getAIStatus() {
  return {
    configured: isAIConfigured(),
    primary: process.env.OPENROUTERAI_API ? "openrouter" : null,
    openRouterModels: process.env.OPENROUTERAI_API ? openRouterModels() : [],
    gemini: Boolean(process.env.GEMINI_API_KEY),
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- OpenRouter (primary) -------------------------------------------------

async function callOpenRouter(prompt, { system, temperature }) {
  const apiKey = process.env.OPENROUTERAI_API;
  if (!apiKey) return null;

  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  let lastError = null;

  for (const model of openRouterModels()) {
    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt += 1) {
      try {
        const response = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:5173",
            "X-Title": process.env.OPENROUTER_APP_NAME || "LearnTrack AI",
          },
          body: JSON.stringify({ model, messages, temperature, max_tokens: MAX_TOKENS }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (response.status === 401 || response.status === 403) {
          throw new AIUnavailableError(
            "OpenRouter rejected the API key (OPENROUTERAI_API). Check backend/.env."
          );
        }

        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          lastError = new Error(
            `OpenRouter ${response.status} on ${model}: ${detail.slice(0, 200)}`
          );
          if (attempt === ATTEMPTS_PER_MODEL) break;
          await sleep(800 * attempt);
          continue;
        }

        const payload = await response.json();
        const text = payload?.choices?.[0]?.message?.content?.trim();

        if (!text) {
          lastError = new Error(`OpenRouter returned an empty completion from ${model}.`);
          if (attempt === ATTEMPTS_PER_MODEL) break;
          await sleep(800 * attempt);
          continue;
        }

        return { text, model: `openrouter:${model}` };
      } catch (err) {
        // A bad key fails identically for every model — never mask it.
        if (err instanceof AIUnavailableError) throw err;
        lastError = err;
        if (attempt === ATTEMPTS_PER_MODEL) break;
        await sleep(800 * attempt);
      }
    }
  }

  if (lastError) {
    console.warn("OpenRouter attempts exhausted:", lastError.message);
  }
  return null;
}

// --- Google Gemini (optional secondary) -----------------------------------

let geminiClient = null;
let googleGenAICtor = null;

async function callGemini(prompt, { system, temperature }) {
  if (!process.env.GEMINI_API_KEY) return null;

  // Imported lazily so an OpenRouter-only setup never touches this package.
  if (!googleGenAICtor) {
    const mod = await import("@google/genai");
    googleGenAICtor = mod.GoogleGenAI;
  }
  if (!geminiClient) {
    geminiClient = new googleGenAICtor({ apiKey: process.env.GEMINI_API_KEY });
  }

  for (const model of ["gemini-2.5-flash", "gemini-1.5-flash"]) {
    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt += 1) {
      try {
        const result = await geminiClient.models.generateContent({
          model,
          contents: system ? `${system}\n\n${prompt}` : prompt,
          config: { temperature },
        });
        const text = result.text?.trim();
        if (text) return { text, model: `gemini:${model}` };
      } catch {
        if (attempt === ATTEMPTS_PER_MODEL) break;
        await sleep(1000);
      }
    }
  }
  return null;
}

// --- Public API -----------------------------------------------------------

export async function generateText(prompt, options = {}) {
  if (!prompt || !String(prompt).trim()) {
    throw new Error("A prompt is required to call the AI.");
  }

  const settings = {
    system: options.system,
    temperature: options.temperature ?? 0.4,
  };

  const fromOpenRouter = await callOpenRouter(prompt, settings);
  if (fromOpenRouter) return fromOpenRouter;

  const fromGemini = await callGemini(prompt, settings);
  if (fromGemini) return fromGemini;

  throw new AIUnavailableError(
    "All configured AI providers failed. Verify OPENROUTERAI_API (and the model id in OPENROUTER_MODEL) in backend/.env."
  );
}

// Models sometimes wrap JSON in prose or code fences — recover the payload
// instead of discarding an otherwise usable answer.
export function parseJsonLoosely(text) {
  const cleaned = String(text).replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // fall through to bracket recovery
  }

  const candidates = [];
  const firstArray = cleaned.indexOf("[");
  const lastArray = cleaned.lastIndexOf("]");
  if (firstArray !== -1 && lastArray > firstArray) {
    candidates.push(cleaned.slice(firstArray, lastArray + 1));
  }

  const firstObject = cleaned.indexOf("{");
  const lastObject = cleaned.lastIndexOf("}");
  if (firstObject !== -1 && lastObject > firstObject) {
    candidates.push(cleaned.slice(firstObject, lastObject + 1));
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // try the next candidate
    }
  }

  throw new Error("The AI response did not contain valid JSON.");
}

export async function generateJSON(prompt, options = {}) {
  const { text, model } = await generateText(prompt, options);
  return { data: parseJsonLoosely(text), model };
}

