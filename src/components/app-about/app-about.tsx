import { Component, State, h } from '@stencil/core';

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
  }

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
              <h1 class="manifesto-headline">AI FIRST.<br/>NOT VIBE CODE.</h1>
              <p>
                We are a hyper-specialized engineering consultancy. We don't build standard corporate brochures. We architect high-performance, AI-driven commerce systems that break conventions and redefine industry standards. 
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
                  <li>&gt; Senior Shopify Engineer</li>
                  <li>&gt; LLM Orchestration Specialist</li>
                  <li>&gt; Python/JS Full-Stack</li>
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
                    <h4>STENCIL VS REACT</h4>
                    <p>We buck the industry trend. React is bloated. Stencil compiles to raw, native Web Components operating in the Light DOM. The result? Unmatched performance metrics and blistering fast mobile rendering.</p>
                  </div>
                )}
                {this.activeTech === 'shopify' && (
                  <div class="tech-panel">
                    <h4>COMMERCE ENGINE</h4>
                    <p>Whether it's deeply customized Liquid architectures or fully headless storefronts, Shopify is our foundation for scalable, high-volume transactions.</p>
                  </div>
                )}
                {this.activeTech === 'gemini' && (
                  <div class="tech-panel">
                    <h4>GEMINI VS CLAUDE</h4>
                    <p>We leverage Google's Gemini models and AI Studio for orchestration. The integration speed, system instruction compliance, and multi-modal capabilities make it our weapon of choice for embedded AI features.</p>
                  </div>
                )}
                {this.activeTech === 'python' && (
                  <div class="tech-panel">
                    <h4>MODERN BACKEND</h4>
                    <p>Our LLM engineering relies on a robust, modern Python stack. Perfect for data parsing, semantic search, and bridging the gap between heavy commerce logic and language models.</p>
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
