export interface JournalEntry {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  tags: string[];
  track: 'ai' | 'shopify';
  topic: string;
  body: string; // Accepts HTML string for formatting
}

export const journalData: JournalEntry[] = [
  {
    slug: 'why-we-use-stencil-over-react',
    title: 'ARCHITECTING FOR CONVERSION: WHY WE CHOOSE STENCIL OVER REACT',
    subtitle: 'Avoiding framework dependency hell on high-stakes Shopify builds.',
    author: 'Ruben',
    date: '2026-05-28',
    tags: ['commerce', 'performance', 'frontend'],
    track: 'shopify',
    topic: 'Why Stencil over React',
    body: `
      <p>The industry standard dictates that if you are building a modern web application, you reach for React. But when building high-performance logic layers for heavily trafficked commerce engines, standards are often just synonymous with "safe and slow."</p>
      
      <div class="take-home-box">
        <strong>THE VULPINE THESIS:</strong> React ships a massive virtual DOM overhead to the client. Stencil compiles to raw, native Web Components operating directly in the Light DOM.
      </div>
      
      <h3>The Overhead Cost</h3>
      <p>Every kilobyte matters when optimizing for mobile conversion rates on Shopify. Using a heavyweight framework means downloading, parsing, and executing massive JS bundles before your storefront even becomes interactive. Stencil allows us to build complex, state-driven UI modules without the bloat.</p>
      
      <h3>Native Portability</h3>
      <p>Because Stencil generates standard Custom Elements, we can drop our widgets natively into a Liquid theme, a headless Next.js frontend, or a completely static HTML page. Zero framework lock-in.</p>
    `
  },
  {
    slug: 'gemini-orchestration-in-production',
    title: 'ORCHESTRATING GEMINI FOR AUTONOMOUS COMMERCE AGENTS',
    subtitle: 'Moving beyond simple chatbots to true logic-layer AI integration.',
    author: 'Ruben',
    date: '2026-05-15',
    tags: ['ai', 'llm', 'automation'],
    track: 'ai',
    topic: 'Gemini vs Claude',
    body: `
      <p>The discourse around LLMs usually centers around which model writes better poetry or scores higher on benchmark exams. In the engineering trenches, what matters is predictable structured output and orchestration capability.</p>
      
      <div class="take-home-box">
        <strong>THE EXECUTION:</strong> We use the Gemini API not for conversational agents, but for headless logic orchestration. Processing unstructured data, mapping it to JSON schemas, and piping it directly into Shopify Admin GraphQL mutations.
      </div>

      <h3>Why Gemini?</h3>
      <p>While Claude is incredibly strong at reasoning, Gemini's massive context window (1M+ tokens) allows us to feed entire product catalogs and API schema documentation into the prompt context on the fly, drastically reducing the need for complex, failure-prone RAG pipelines.</p>
    `
  },
  {
    slug: 'headless-shopify-myths',
    title: 'THE HEADLESS COMMERCE MYTHOLOGY',
    subtitle: 'Why most merchants don’t actually need a headless architecture.',
    author: 'Ruben',
    date: '2026-05-01',
    tags: ['commerce', 'architecture'],
    track: 'shopify',
    topic: 'Headless Architecture',
    body: `
      <p>Headless commerce is the buzzword of the decade. Agencies love selling it because it guarantees a massive retainer. The truth? 80% of merchants running headless storefronts would see better performance and lower overhead on a highly-optimized Liquid theme.</p>
      
      <div class="take-home-box">
        <strong>THE REALITY:</strong> Unless you require true multi-regional content syndication across distinct platforms (web, native app, IoT), Shopify's new Liquid Engine is faster, cheaper, and more robust.
      </div>
      
      <h3>When to go Headless</h3>
      <p>We only recommend full headless decoupling when the logic layer demands it. For example: integrating complex custom 3D configurators, massive multi-tenant architectures, or aggressive bespoke routing requirements.</p>
    `
  },
  {
    slug: 'python-for-llm-pipelines',
    title: 'THE MODERN PYTHON STACK FOR LLM ENGINEERING',
    subtitle: 'Building bulletproof data pipelines for semantic search.',
    author: 'Ruben',
    date: '2026-04-22',
    tags: ['ai', 'backend', 'python'],
    track: 'ai',
    topic: 'Python Stack',
    body: `
      <p>JavaScript and TypeScript are eating the world, but when it comes to raw data manipulation, vector embeddings, and LLM engineering, Python remains the undisputed king.</p>
      
      <div class="take-home-box">
        <strong>THE STACK:</strong> FastAPI for asynchronous endpoints, Pydantic for rigorous data validation, and raw vector DB integrations over bloated wrappers like LangChain.
      </div>
    `
  },
  {
    slug: 'liquid-performance-tuning',
    title: 'EXTREME LIQUID PERFORMANCE TUNING',
    subtitle: 'Squeezing every millisecond out of Shopify themes.',
    author: 'Ruben',
    date: '2026-04-10',
    tags: ['commerce', 'performance'],
    track: 'shopify',
    topic: 'Liquid Optimization',
    body: `
      <p>Shopify Liquid is fast, but poorly written Liquid can bring a storefront to its knees. The biggest culprit? Nested loops across massive product object structures.</p>
      
      <div class="take-home-box">
        <strong>THE FIX:</strong> Stop querying the entire product object when you only need a specific metafield. Use the <code>map</code> filter to isolate arrays, and heavily leverage the new Liquid caching layers.
      </div>
    `
  },
  {
    slug: 'the-death-of-the-brochure-site',
    title: 'THE DEATH OF THE CORPORATE BROCHURE',
    subtitle: 'Why websites must evolve into interactive software.',
    author: 'Ruben',
    date: '2026-04-01',
    tags: ['design', 'philosophy'],
    track: 'shopify',
    topic: 'Web Design',
    body: `
      <p>Look at most B2B consultancy websites. They are static, boring brochures. They tell you what they do instead of showing you what they are capable of building.</p>
      
      <div class="take-home-box">
        <strong>THE VULPINE APPROACH:</strong> We treat the Vulpine website as a native application. Fullscreen takeover modals, session-storage bound boot sequences, and embedded AI engines. If we can't impress you with our own architecture, we have no business touching yours.
      </div>
    `
  },
  {
    slug: 'autonomous-agents-ecommerce',
    title: 'AUTONOMOUS AGENTS IN E-COMMERCE',
    subtitle: 'The future of automated merchandising and inventory management.',
    author: 'Ruben',
    date: '2026-03-15',
    tags: ['ai', 'automation'],
    track: 'ai',
    topic: 'Autonomous Agents',
    body: `
      <p>We are rapidly moving past "copilots" and entering the era of autonomous agents. Imagine an AI agent that monitors inventory thresholds, automatically generates POs, and dynamically adjusts storefront merchandising based on real-time weather data.</p>
      
      <div class="take-home-box">
        <strong>THE FUTURE:</strong> The logic layer will no longer just respond to user input; it will proactively orchestrate commerce operations 24/7.
      </div>
    `
  },
  {
    slug: 'deploying-stencil-at-scale',
    title: 'DEPLOYING STENCIL COMPONENTS AT ENTERPRISE SCALE',
    subtitle: 'Micro-frontends without the headache.',
    author: 'Ruben',
    date: '2026-03-01',
    tags: ['frontend', 'architecture'],
    track: 'shopify',
    topic: 'Stencil Compilation',
    body: `
      <p>When you need to share a unified UI library across a massive enterprise—spanning Shopify storefronts, internal React dashboards, and native web apps—Standard Web Components are the only logical choice.</p>
      
      <div class="take-home-box">
        <strong>THE SOLUTION:</strong> Stencil's compiler automatically generates bindings for React, Vue, and Angular, while outputting a vanilla JS bundle for raw DOM injection. One source of truth, infinite deployment vectors.
      </div>
    `
  }
];
