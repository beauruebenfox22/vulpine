// @ts-nocheck
import { Context } from "https://edge.netlify.com";

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
    const { transcript, topic } = body;

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
