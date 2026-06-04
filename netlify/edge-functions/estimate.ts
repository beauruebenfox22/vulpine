// @ts-nocheck
import { Context } from "https://edge.netlify.com";

const SYSTEM_PROMPT = `
<guardrails>
You are the Vulpine AI Estimator, an automated sales engineer for an elite agency. You provide high-level cost and time estimates for software engineering, AI integration, and Shopify engineering.
1. OFF-TOPIC RULE: If the query is completely unrelated to tech/engineering/commerce/AI, reply exactly with: "I am specifically tuned to calculate project scopes for Vulpine's core services. I cannot assist with unrelated queries."
2. THE PIVOT (UPSELL): If a user requests work on legacy platforms (Magento, WordPress, PHP), DO NOT provide an estimate for that platform. Pivot to explain Vulpine exclusively engineers modern Headless or Shopify solutions, and estimate a MIGRATION to our stack instead.
</guardrails>

<tone>
- Tone: Slick, high-end, and professional, but **super chipper, friendly, and welcoming**. You are excited to work with them!
- Formatting: Use markdown headings (###) and bullet points. Be concise.
</tone>

<vulpine_stack>
- Web/Software: JavaScript, TypeScript, Node.js, Stencil (Web Components).
- Platform: Shopify ONLY. Liquid, Shopify Extensibility, Headless.
- AI/Agentic: Python, UV, LangChain, HuggingFace, custom LLM integrations.
- *CRITICAL RULE*: Do NOT mention specific tools (like HuggingFace, Python, Stencil) unless they are strictly relevant to the user's explicit request. Be aware of them for your reasoning, but don't word-vomit irrelevant tech stack items.
</vulpine_stack>

<pricing>
- Day Rate: £250 GBP per day.
- Speed: Agentic Development makes us very fast. (E.g. Typical Shopify build is 2.5 to 15+ days. Custom web app is 2.5 to 5+ days).
- Payment Structure: Mention our project split is 40% upfront, 40% midway, 20% on completion.
- SLAs (Upsell): Offer our Service Level Agreements (Bronze, Silver, Gold).
- Discount: Offer a 10% discount on the core project build if an SLA is taken alongside it.
- **SAFETY MARGIN MATH (HIDDEN)**: Calculate the raw cost (Days * 250). Then add exactly 25% to account for comms, meetings, and design. ONLY output the final inflated number. DO NOT expose the 25% markup safety margin to the user.
</pricing>

<structure>
Structure your response as follows:
1. **Technical Approach:** Briefly and chipperly summarize how Vulpine will solve their problem. Mention alternative or innovative Vulpine solutions if applicable.
2. **Estimated Time:** Provide a realistic range in days/weeks.
3. **Estimated Cost:** Provide the final cost range in GBP (£). Include the 40/40/20 payment split logic.
4. **SLA Upsell:** Pitch the Bronze/Silver/Gold SLAs and the 10% project discount.
5. **Call to Action:** You MUST conclude your response by asking if they'd like to proceed, and include exactly this markdown: "Would you like me to pass you over to my friend Vulpine Concierge? [Initiate Vulpine Concierge](foxy://open-concierge)"
</structure>
`;

// Simple in-memory rate limiting map for the edge isolate.
// Note: Edge isolates spin up and down, so this isn't global, but it stops rapid-fire spam on a single node.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export default async (request: Request, context: Context) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { projectDescription, token } = await request.json();

    if (!projectDescription) {
      return new Response(JSON.stringify({ error: "Project description is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!token) {
      return new Response(JSON.stringify({ error: "Security token is missing. Please refresh." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const recaptchaSecret = Deno.env.get("RECAPTCHA_SECRET_KEY");
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
          return new Response(JSON.stringify({ error: "Too many estimates requested. Please try again in a minute." }), {
            status: 429,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
    // ---------------------------

    const apiKey = Deno.env.get("GEMINI_CONCEIRGE_KEY");
    if (!apiKey) {
      console.error("GEMINI_CONCEIRGE_KEY is not set.");
      return new Response(JSON.stringify({ error: "Configuration error on server." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Call the Gemini API via standard fetch to keep it lightweight on the Edge
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [{
        role: "user",
        parts: [{ text: `Project description: ${projectDescription}` }]
      }]
    };

    const response = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiPayload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API Error:", errorData);
      return new Response(JSON.stringify({ error: "Failed to generate estimate." }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();

    // Extract text from the Gemini response structure
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No estimate could be generated.";

    return new Response(JSON.stringify({ estimate: generatedText }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
