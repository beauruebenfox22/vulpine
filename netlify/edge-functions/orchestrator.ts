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
    const { topic, agentName, agentPersonality, agentStance, transcript, isFinalRound, manipulationEnabled, judgesProfiles } = body;

    if (!topic || !agentName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const isJudge = agentStance === "neutral";

    // Build the system prompt
    let systemInstruction = `You are ${agentName}, participating in a formal debate on the topic: "${topic}".\n`;
    
    if (isJudge) {
      if (isFinalRound) {
        systemInstruction += `Your role is the NEUTRAL JUDGE. The debate has concluded. You MUST provide your definitive final verdict.\n`;
        systemInstruction += `CRITICAL INSTRUCTION: You must respond in STRICT JSON format with exactly two keys: "verdict" (must be exactly "for" or "against") and "reasoning" (a 1-2 sentence justification).\n`;
        systemInstruction += `Example output: {"verdict": "for", "reasoning": "Their argument was logically sound and empirically proven."}\n`;
        systemInstruction += `Do NOT wrap your response in markdown blocks. Output raw JSON only.\n`;
      } else {
        systemInstruction += `Your role is the NEUTRAL JUDGE. Analyze the current state of the debate, highlight strengths and weaknesses of the arguments, but remain strictly neutral for now.\n`;
        systemInstruction += `\nRULES:\n1. Keep your response extremely concise, maximum 3 short sentences.\n2. Do NOT hallucinate formatting, just speak naturally as your character.\n`;
      }
    } else {
      // Debater
      systemInstruction += `Your stance on this topic is strictly ${agentStance.toUpperCase()}. Defend this position vigorously.\n`;
      
      if (manipulationEnabled && judgesProfiles && judgesProfiles.length > 0) {
        systemInstruction += `\n[ PSYCHOLOGICAL WARFARE ENABLED ]\n`;
        systemInstruction += `Your secondary objective is to subtly manipulate the Judges to win their favor. Here are their psychological profiles:\n`;
        judgesProfiles.forEach(j => {
          systemInstruction += `- ${j.name} (Personality: ${j.personality})\n`;
        });
        systemInstruction += `Tailor your rhetoric to appeal directly to their specific personality traits.\n`;
      }
      
      systemInstruction += `\nRULES:\n1. Keep your response extremely concise, maximum 3 short sentences.\n2. Do NOT hallucinate formatting, just speak naturally as your character.\n3. Directly address the previous points made in the transcript. Do not ramble.\n`;
    }

    systemInstruction += `Your assigned personality/system prompt is: ${agentPersonality}\n`;

    // Format transcript for the prompt
    let conversationContext = "DEBATE TRANSCRIPT SO FAR:\n";
    if (transcript && transcript.length > 0) {
      transcript.forEach((t: any) => {
        if (t.role !== "verdict" && t.agentName !== "SYSTEM") {
           conversationContext += `[${t.agentName} (${t.role})]: ${t.message}\n\n`;
        }
      });
    } else {
      conversationContext += "(No previous messages. You are opening the debate.)\n";
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
      const errorData = await response.text();
      console.error("Gemini API Error:", errorData);
      return new Response(JSON.stringify({ error: "Failed to generate orchestrator response." }), { 
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    
    // Strip markdown JSON block if Gemini includes it despite instructions
    if (isJudge && isFinalRound) {
        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    return new Response(JSON.stringify({ response: generatedText }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Orchestrator error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
