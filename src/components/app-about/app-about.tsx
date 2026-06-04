import { Component, State, h } from '@stencil/core';
import { setSEO } from '../../utils/seo';

@Component({
  tag: 'app-about',
  styleUrl: 'app-about.css',
  shadow: false,
})
export class AppAbout {
  @State() isBooting: boolean = false;
  @State() activeTech: string = 'stencil';
  @State() activeReview: number = 0;

  private reviews = [
    { id: 'REQ-01', status: '200 OK', user: 'CEO, SynthCorp', message: 'Vulpine delivered a headless architecture that cut our load times by 400%. Absolute units.' },
    { id: 'REQ-02', status: '200 OK', user: 'Founder, Apex Innovations', message: 'The AI orchestration integrated seamlessly into our existing Shopify Liquid theme. Unbelievable precision.' },
    { id: 'REQ-03', status: '200 OK', user: 'CTO, Nexus Retail', message: 'They don’t build websites, they build weapons-grade commerce platforms.' }
  ];

  componentWillLoad() {
    const hasBooted = sessionStorage.getItem('vulpine_about_booted');
    if (!hasBooted) {
      this.isBooting = true;
      sessionStorage.setItem('vulpine_about_booted', 'true');
      setTimeout(() => {
        this.isBooting = false;
      }, 3500); // 3.5s boot sequence
    }

    setSEO({
      title: 'The Blueprint | About Vulpine Custom Software House',
      description: 'No agency overhead. No corporate discovery bloat. Read the manifesto behind our elite, direct-to-repository software engineering workflows.',
      url: 'https://vulpine.digital/about'
    });

  };

  private setTech(tech: string) {
    this.activeTech = tech;
  }

  private cycleReview() {
    this.activeReview = (this.activeReview + 1) % this.reviews.length;
  }

  render() {
    return (
      <div class={`about-container ${this.isBooting ? 'is-booting' : ''}`}>

        {/* BOOT SEQUENCE OVERLAY */}
        {this.isBooting && (
          <div class="boot-sequence">
            <div class="boot-log">
              <p>[sys] INITIALIZING VULPINE_MANIFEST.EXE ...</p>
              <p class="delay-1">[sys] LOADING OPERATOR DATA ...</p>
              <p class="delay-2">[sys] MOUNTING TECH STACK ...</p>
              <p class="delay-3">[sys] DECRYPTING CLIENT TELEMETRY ...</p>
              <p class="delay-4 success">SYSTEM READY.</p>
            </div>
          </div>
        )}

        <main class="about-bento-grid">

          {/* SECTOR 1: ABOUT VULPINE */}
          <article class="bento-box box-vulpine">
            <div class="bento-header">
              <span class="bento-id">// 01</span>
              <h2>VULPINE DIRECTIVE</h2>
            </div>
            <div class="bento-content">
              <h1 class="manifesto-headline">AI FIRST.<br />NOT VIBE CODE.</h1>
              <p>
                Standard is our enemy. Vulpine delivers elite engineering for teams who have outgrown basic software. Whether we are building unhinged custom Shopify frontends that convert or deploying fine-tuned, trend-defying AI systems on the edge—we ship hardened code designed for maximum velocity.
              </p>
            </div>
          </article>

          {/* SECTOR 2: THE OPERATOR */}
          <article class="bento-box box-operator">
            <div class="bento-header">
              <span class="bento-id">// 02</span>
              <h2>THE OPERATOR</h2>
            </div>
            <div class="bento-content operator-profile">
              <div class="operator-avatar">
                <div class="avatar-glitch"></div>
              </div>
              <div class="operator-data">
                <h3>RUBEN</h3>
                <span class="operator-title">Lead Architect / Founder</span>
                <ul class="accreditations">
                  <li>&gt; Senior Engineer</li>
                  <li>&gt; Applied AI Specialist</li>
                  <li>&gt; Python / JS Full-Stack / Shopify / Edge Computing</li>
                  <li>&gt; 10+ Years Experience</li>
                </ul>
              </div>
            </div>
          </article>

          {/* SECTOR 3: TECH STACK INTERACTIVE */}
          <article class="bento-box box-tech">
            <div class="bento-header">
              <span class="bento-id">// 03</span>
              <h2>CORE TECHNOLOGY</h2>
            </div>
            <div class="bento-content tech-layout">
              <div class="tech-nav">
                <button class={`tech-btn ${this.activeTech === 'stencil' ? 'active' : ''}`} onClick={() => this.setTech('stencil')}>STENCIL</button>
                <button class={`tech-btn ${this.activeTech === 'shopify' ? 'active' : ''}`} onClick={() => this.setTech('shopify')}>SHOPIFY</button>
                <button class={`tech-btn ${this.activeTech === 'gemini' ? 'active' : ''}`} onClick={() => this.setTech('gemini')}>GEMINI</button>
                <button class={`tech-btn ${this.activeTech === 'python' ? 'active' : ''}`} onClick={() => this.setTech('python')}>PYTHON</button>
              </div>
              <div class="tech-display">
                {this.activeTech === 'stencil' && (
                  <div class="tech-panel">
                    <h4>PURE PERFORMANCE</h4>
                    <p>
                      While the rest of the industry chokes on heavy JavaScript frameworks, we build light. Stencil compiles down to raw, native Web Components that run seamlessly in the Light DOM. No virtual DOM overhead, no unneeded bloat—just blistering mobile rendering and flawless web vitals built for scale.
                    </p>
                  </div>
                )}
                {this.activeTech === 'shopify' && (
                  <div class="tech-panel">
                    <h4>MONOLITHIC FOCUS</h4>
                    <p>
                      We don’t do general e-commerce. Shopify is the only platform we support, because it’s the only one capable of anchoring our high-end builds. We bypass basic templates to engineer custom themes and deep-tier architecture that turn the world's leading commerce engine into an unfair competitive advantage.
                    </p>
                  </div>
                )}
                {this.activeTech === 'gemini' && (
                  <div class="tech-panel">
                    <h4>ENTERPRISE COGNITION</h4>
                    <p>
                      We chose Google Gemini as our flagship model for a reason. Its massive context window, lightning-fast token processing, and robust SDK capabilities allow us to architect multi-agent systems and agentic code ecosystems that other models choke on. We build heavy-duty intelligence, not chat wrappers.
                    </p>
                  </div>
                )}
                {this.activeTech === 'python' && (
                  <div class="tech-panel">
                    <h4>RAW MACHINERY</h4>
                    <p>
                      Python is the undisputed engine of modern artificial intelligence. We use it to build our core backend infrastructure, custom middleware layers, and token efficiency algorithms. Combined with LangChain and Hugging Face, it allows us to ship rock-solid, production-ready AI products with zero operational lag.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* SECTOR 4: API LOG (REVIEWS) */}
          <article class="bento-box box-telemetry">
            <div class="bento-header">
              <span class="bento-id">// 04</span>
              <h2>CLIENT TELEMETRY</h2>
              <button class="cycle-btn" onClick={() => this.cycleReview()}>[ FETCH NEXT ]</button>
            </div>
            <div class="bento-content api-log">
              <div class="log-entry">
                <div class="log-meta">
                  <span class="log-method">GET</span>
                  <span class="log-endpoint">/api/v1/client-feedback/{this.reviews[this.activeReview].id}</span>
                  <span class="log-status">{this.reviews[this.activeReview].status}</span>
                </div>
                <div class="log-json">
                  <pre>
                    {`{
  "client": "${this.reviews[this.activeReview].user}",
  "telemetry_data": "${this.reviews[this.activeReview].message}",
  "timestamp": "${new Date().toISOString()}"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </article>

        </main>
      </div>
    );
  }
}
