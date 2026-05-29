// @ts-nocheck
import { Context } from "https://edge.netlify.com";

// Simple in-memory rate limiting map for the edge isolate.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export default async (request: Request, context: Context) => {
  // CORS Preflight
  if (request.method === "OPTIONS") {
    return new Response("OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  const apiKey = Netlify.env.get("GEMINI_ORCHESTRATOR_API_KEY") || Netlify.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Orchestrator API key missing" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const { transcript, topic, token } = body;

    if (!token) {
      return new Response(JSON.stringify({ error: "Security token is missing. Please refresh." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const recaptchaSecret = Netlify.env.get("RECAPTCHA_SECRET_KEY") || Deno.env.get("RECAPTCHA_SECRET_KEY");
    if (!recaptchaSecret) {
      console.error("RECAPTCHA_SECRET_KEY is not set.");
      return new Response(JSON.stringify({ error: "Server misconfiguration." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Verify reCAPTCHA token
    const verifyParams = new URLSearchParams();
    verifyParams.append('secret', recaptchaSecret);
    verifyParams.append('response', token);
    
    const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: verifyParams
    });
    
    const verifyData = await verifyResponse.json();
    
    // We enforce a strict score threshold (0.5) to block bots.
    if (!verifyData.success || verifyData.score < 0.5) {
      console.warn(`ReCaptcha failed. Score: ${verifyData.score}`);
      return new Response(JSON.stringify({ error: "Automated traffic detected. Request blocked." }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // --- Rate Limiting Logic ---
    const ip = context.ip || "unknown";
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    } else {
      const data = rateLimitMap.get(ip)!;
      if (now - data.timestamp > RATE_LIMIT_WINDOW_MS) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      } else {
        data.count++;
        if (data.count > MAX_REQUESTS_PER_WINDOW) {
          console.warn(`Rate limit triggered for IP: ${ip}`);
          return new Response(JSON.stringify({ error: "Too many summaries requested. Please try again in a minute." }), {
            status: 429,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
    // ---------------------------

    const systemInstruction = `You are a neutral summarization agent (The Middleman). 
Your task is to take a raw transcript of a debate on the topic: "${topic}" and condense it into a highly dense, token-efficient brief for the Judges.
Summarize the core arguments made by the FOR side and the AGAINST side in this specific round. 
Do not declare a winner. Keep it entirely objective. Maximum 4 sentences.`;

    let conversationContext = "RAW TRANSCRIPT:\n";
    if (transcript && transcript.length > 0) {
      transcript.forEach((t: any) => {
        if (t.role !== "verdict" && t.agentName !== "SYSTEM") {
          conversationContext += `[${t.agentName}]: ${t.message}\n\n`;
        }
      });
    }

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [{
        role: "user",
        parts: [{ text: conversationContext }]
      }]
    };

    const response = await fetch(geminiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload)
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to generate summary." }), { 
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Summarization failed.";

    return new Response(JSON.stringify({ summary: generatedText }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
