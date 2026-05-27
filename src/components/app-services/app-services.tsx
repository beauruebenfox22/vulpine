import { Component, Prop, State, Watch, h } from '@stencil/core';
import { Router } from "../../";

interface SubService {
  id: string;
  num: string;
  title: string;
  description: string;
  bentoChips: string[];
  visualType: string;
}

@Component({
  tag: 'app-services',
  styleUrl: 'app-services.css',
  shadow: false,
})
export class AppServices {
  @Prop() serviceType: 'ai' | 'shopify' = 'ai';

  @State() activeSectionIndex: number = 0;

  private wrapperRef?: HTMLDivElement;

  private aiServices: SubService[] = [
    {
      id: 'gemini-orchestration',
      num: '01',
      title: 'GEMINI ORCHESTRATION',
      description: 'Deploying highly coordinated LLM orchestration architectures that integrate deep reasoning and structured outputs seamlessly into your existing product logic.',
      bentoChips: ['01 / AGENT ARCHITECTURE', '02 / SECURE INFERENCE', '03 / CUSTOM DATA PIPELINES'],
      visualType: 'network-matrix',
    },
    {
      id: 'autonomous-agents',
      num: '02',
      title: 'AUTONOMOUS AGENTS',
      description: 'Architecting self-correcting agent chains and multi-agent systems designed to run asynchronous operations, background research, and recursive code synthesis.',
      bentoChips: ['01 / RECURSIVE LOOPS', '02 / HUMAN-IN-THE-LOOP', '03 / BEHAVIORAL LOGS'],
      visualType: 'agent-flow',
    },
    {
      id: 'secure-sdk-bridges',
      num: '03',
      title: 'SECURE SDK BRIDGES',
      description: 'Building encrypted interfaces and API gateways that guarantee high-throughput, low-latency token transfers while preserving corporate data boundary compliance.',
      bentoChips: ['01 / ZERO-TRUST API', '02 / TOKEN SHIELDING', '03 / SECURE MEMORY'],
      visualType: 'secure-bridge',
    },
    {
      id: 'logic-layer-integration',
      num: '04',
      title: 'LOGIC LAYER INTEGRATION',
      description: 'Integrating powerful reasoning engines deep into your core business rules. Creating robust, predictable layers where LLM flexibility meets transactional safety.',
      bentoChips: ['01 / DETECT & COPE', '02 / TRANSACTION SHIELD', '03 / STATE MACHINE'],
      visualType: 'logic-state',
    },
  ];

  private shopifyServices: SubService[] = [
    {
      id: 'headless-architecture',
      num: '01',
      title: 'HEADLESS ARCHITECTURE',
      description: "Decoupling your storefront using premium custom stacks (Next.js, Remix, Stencil) coupled with Shopify's Storefront API for blazing-fast speed and unparalleled design freedom.",
      bentoChips: ['01 / HYDROGEN & OXYGEN', '02 / GRAPHQL SPEED', '03 / JAMSTACK SCALING'],
      visualType: 'headless-api',
    },
    {
      id: 'platform-re-engineering',
      num: '02',
      title: 'PLATFORM RE-ENGINEERING',
      description: 'Migrating complex legacy catalog structures and monolithic setups into modern, clean, scalable architectures with zero-downtime database and schema conversions.',
      bentoChips: ['01 / DATA DE-DUPLICATE', '02 / MASS CATALOG', '03 / HOT-SWAP DATA'],
      visualType: 'database-split',
    },
    {
      id: 'custom-app-development',
      num: '03',
      title: 'CUSTOM APP DEVELOPMENT',
      description: 'Crafting bespoke Shopify App Store-compliant applications utilizing high-throughput webhooks, custom databases, and deeply integrated Admin APIs.',
      bentoChips: ['01 / ROBUST WEBHOOKS', '02 / COMPLIANT ADMIN', '03 / SECURE OAUTH'],
      visualType: 'dashboard-nodes',
    },
    {
      id: 'extensibility-engines',
      num: '04',
      title: 'EXTENSIBILITY ENGINES',
      description: 'Leveraging Shopify Checkout Extensibility, custom app blocks, theme app extensions, and functions to mold checkout behaviors without performance degradation.',
      bentoChips: ['01 / CHECKOUT BLOCKS', '02 / CUSTOM FUNCTIONS', '03 / SANDBOX SAFETY'],
      visualType: 'extensibility-blocks',
    },
  ];

  @Watch('serviceType')
  handleServiceTypeChange() {
    this.activeSectionIndex = 0;
    setTimeout(() => {
      this.handleHashNavigation();
    }, 100);
  }

  componentWillLoad() {
    // Initial configuration
  }

  componentDidLoad() {
    if (this.wrapperRef) {
      this.wrapperRef.addEventListener('scroll', this.handleScroll, { passive: true });
    }
    // Bind global hashchange routing event
    window.addEventListener('hashchange', this.handleHashNavigation);

    // Initial load check
    setTimeout(() => {
      this.handleHashNavigation();
    }, 150);
  }

  componentDidUpdate() {
    // Decoupled from hash scroll actions to prevent recursive snap cycles
  }

  disconnectedCallback() {
    if (this.wrapperRef) {
      this.wrapperRef.removeEventListener('scroll', this.handleScroll);
    }
    window.removeEventListener('hashchange', this.handleHashNavigation);
  }

  private handleHashNavigation = () => {
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.replace('#', '');
      const services = this.serviceType === 'ai' ? this.aiServices : this.shopifyServices;
      const index = services.findIndex(s => s.id === targetId);
      if (index !== -1) {
        this.scrollToSection(index);
      }
    }
  };

  private handleScroll = (event: Event) => {
    const container = event.target as HTMLElement;
    // Calculate index dynamically based on clean viewport heights
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== this.activeSectionIndex && index >= 0) {
      this.activeSectionIndex = index;
    }
  };

  private scrollToSection = (index: number) => {
    if (this.wrapperRef) {
      // Mathematically precise container-specific scrolling bypasses browser-specific scrollIntoView snap issues
      this.wrapperRef.scrollTo({
        top: index * this.wrapperRef.clientHeight,
        behavior: 'smooth'
      });
    }
  };


  private handleBackToHome = () => {
    Router.push('/');
  };

  private renderVisualEngine(type: string) {
    switch (type) {
      case 'network-matrix':
        return (
          <svg class="visual-svg network-matrix-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="var(--theme-glow)" stop-opacity="0.8" />
                <stop offset="100%" stop-color="var(--theme-glow)" stop-opacity="0" />
              </radialGradient>
            </defs>
            {/* Connections */}
            <line x1="80" y1="120" x2="200" y2="80" class="conn-line delay-1" />
            <line x1="200" y1="80" x2="320" y2="150" class="conn-line delay-2" />
            <line x1="80" y1="120" x2="160" y2="240" class="conn-line delay-3" />
            <line x1="160" y1="240" x2="320" y2="150" class="conn-line delay-4" />
            <line x1="160" y1="240" x2="260" y2="300" class="conn-line delay-5" />
            <line x1="320" y1="150" x2="260" y2="300" class="conn-line delay-6" />
            
            {/* Pulsing Nodes */}
            <circle cx="80" cy="120" r="16" fill="url(#nodeGlow)" class="glow-pulse" />
            <circle cx="80" cy="120" r="6" fill="var(--theme-glow)" />
            
            <circle cx="200" cy="80" r="16" fill="url(#nodeGlow)" class="glow-pulse delay-2" />
            <circle cx="200" cy="80" r="6" fill="var(--theme-glow)" />
            
            <circle cx="320" cy="150" r="16" fill="url(#nodeGlow)" class="glow-pulse delay-4" />
            <circle cx="320" cy="150" r="6" fill="var(--theme-glow)" />
            
            <circle cx="160" cy="240" r="16" fill="url(#nodeGlow)" class="glow-pulse delay-1" />
            <circle cx="160" cy="240" r="6" fill="var(--theme-glow)" />
            
            <circle cx="260" cy="300" r="16" fill="url(#nodeGlow)" class="glow-pulse delay-3" />
            <circle cx="260" cy="300" r="6" fill="var(--theme-glow)" />
          </svg>
        );

      case 'agent-flow':
        return (
          <svg class="visual-svg agent-flow-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <g class="flow-track">
              <path d="M 50 200 C 120 100, 280 100, 350 200 C 280 300, 120 300, 50 200 Z" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="6" />
              <path d="M 50 200 C 120 100, 280 100, 350 200 C 280 300, 120 300, 50 200 Z" fill="none" stroke="var(--theme-core)" stroke-width="2" stroke-dasharray="15, 120" class="flow-dash" />
            </g>
            {/* Center Core */}
            <circle cx="200" cy="200" r="30" fill="var(--base-secondary)" stroke="var(--theme-glow)" stroke-width="2" />
            <circle cx="200" cy="200" r="10" fill="var(--theme-glow)" class="glow-pulse" />
            <circle cx="50" cy="200" r="8" fill="var(--theme-core)" />
            <circle cx="350" cy="200" r="8" fill="var(--theme-core)" />
          </svg>
        );

      case 'secure-bridge':
        return (
          <svg class="visual-svg secure-bridge-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <g class="grid-mesh" stroke="rgba(255,255,255,0.05)" stroke-width="1">
              <line x1="50" y1="100" x2="350" y2="100" />
              <line x1="50" y1="200" x2="350" y2="200" />
              <line x1="50" y1="300" x2="350" y2="300" />
              <line x1="100" y1="50" x2="100" y2="350" />
              <line x1="200" y1="50" x2="200" y2="350" />
              <line x1="300" y1="50" x2="300" y2="350" />
            </g>
            {/* Shield Hexagon */}
            <polygon points="200,110 280,150 280,250 200,290 120,250 120,150" fill="none" stroke="var(--theme-core)" stroke-width="3" class="shield-pulse" />
            <polygon points="200,130 260,165 260,235 200,270 140,235 140,165" fill="none" stroke="var(--theme-glow)" stroke-dasharray="10 5" class="shield-rotate" />
            
            {/* Secure Central Node */}
            <circle cx="200" cy="200" r="15" fill="var(--theme-glow)" />
          </svg>
        );

      case 'logic-state':
        return (
          <svg class="visual-svg logic-state-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="80" width="100" height="60" rx="6" fill="var(--base-secondary)" stroke="var(--theme-core)" stroke-width="2" />
            <text x="110" y="115" font-family="Outfit" font-size="12" fill="#fff" text-anchor="middle">INPUT</text>

            <line x1="160" y1="110" x2="240" y2="110" stroke="var(--theme-core)" stroke-width="2" stroke-dasharray="5 5" class="state-flow-line" />

            <rect x="240" y="80" width="100" height="60" rx="6" fill="var(--base-secondary)" stroke="var(--theme-glow)" stroke-width="2" />
            <text x="290" y="115" font-family="Outfit" font-size="12" fill="#fff" text-anchor="middle">REASONING</text>

            <path d="M 290 140 L 290 260 C 290 260, 200 260, 160 260" fill="none" stroke="var(--theme-core)" stroke-width="2" stroke-dasharray="5 5" class="state-flow-line-rev" />

            <rect x="60" y="230" width="100" height="60" rx="6" fill="var(--base-secondary)" stroke="var(--theme-core)" stroke-width="2" />
            <text x="110" y="265" font-family="Outfit" font-size="12" fill="#fff" text-anchor="middle">TRANSACT</text>
            
            <circle cx="110" cy="140" r="4" fill="var(--theme-glow)" class="node-flash" />
            <circle cx="290" cy="80" r="4" fill="var(--theme-glow)" class="node-flash delay-2" />
          </svg>
        );

      case 'headless-api':
        return (
          <svg class="visual-svg headless-api-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            {/* Separated Panels */}
            {/* Front-end Mock */}
            <rect x="50" y="80" width="120" height="150" rx="8" fill="var(--base-secondary)" stroke="var(--theme-core)" stroke-width="2" />
            <line x1="65" y1="105" x2="115" y2="105" stroke="var(--theme-core)" stroke-width="4" />
            <rect x="65" y="125" width="90" height="40" rx="4" fill="rgba(255,255,255,0.05)" />
            <circle cx="80" cy="190" r="10" fill="var(--theme-glow)" />

            {/* Shopify APIs */}
            <rect x="230" y="170" width="120" height="150" rx="8" fill="var(--base-secondary)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
            <line x1="245" y1="195" x2="315" y2="195" stroke="var(--theme-core)" stroke-width="4" />
            <circle cx="290" cy="250" r="25" fill="none" stroke="var(--theme-core)" stroke-width="2" stroke-dasharray="4 4" class="shield-rotate" />
            <circle cx="290" cy="250" r="10" fill="var(--theme-core)" />

            {/* Floating Connection Vectors */}
            <path d="M 170 155 C 200 155, 200 245, 230 245" fill="none" stroke="var(--theme-glow)" stroke-width="3" stroke-dasharray="8 6" class="api-bridge-pulse" />
          </svg>
        );

      case 'database-split':
        return (
          <svg class="visual-svg database-split-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            {/* Legacy DB Cylinders on left */}
            <g class="db-group legacy" opacity="0.4">
              <path d="M 60 100 C 60 80, 140 80, 140 100 L 140 180 C 140 200, 60 200, 60 180 Z" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
              <ellipse cx="100" cy="100" rx="40" ry="15" fill="var(--base-secondary)" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
              <ellipse cx="100" cy="125" rx="40" ry="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
              <ellipse cx="100" cy="150" rx="40" ry="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
            </g>

            {/* Transition pipeline */}
            <path d="M 140 140 L 260 200" fill="none" stroke="var(--theme-core)" stroke-width="3" stroke-dasharray="10 8" class="data-transfer-dash" />

            {/* Smart modern db on right */}
            <g class="db-group modern">
              <path d="M 260 160 C 260 140, 340 140, 340 160 L 340 240 C 340 260, 260 260, 260 240 Z" fill="none" stroke="var(--theme-core)" stroke-width="2.5" />
              <ellipse cx="300" cy="160" rx="40" ry="15" fill="var(--base-secondary)" stroke="var(--theme-glow)" stroke-width="2.5" />
              <ellipse cx="300" cy="185" rx="40" ry="15" fill="none" stroke="var(--theme-core)" stroke-width="1.5" />
              <ellipse cx="300" cy="210" rx="40" ry="15" fill="none" stroke="var(--theme-core)" stroke-width="1.5" />
              <circle cx="300" cy="160" r="6" fill="var(--theme-glow)" class="glow-pulse" />
            </g>
          </svg>
        );

      case 'dashboard-nodes':
        return (
          <svg class="visual-svg dashboard-nodes-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            {/* Grid base */}
            <rect x="50" y="80" width="300" height="240" rx="10" fill="var(--base-secondary)" stroke="rgba(255,255,255,0.05)" stroke-width="2" />
            
            {/* Bar charts glowing */}
            <rect x="80" y="240" width="30" height="60" rx="3" fill="var(--theme-core)" opacity="0.6" class="bar-grow-1" />
            <rect x="130" y="180" width="30" height="120" rx="3" fill="var(--theme-core)" opacity="0.8" class="bar-grow-2" />
            <rect x="180" y="140" width="30" height="160" rx="3" fill="var(--theme-glow)" class="bar-grow-3" />
            <rect x="230" y="210" width="30" height="90" rx="3" fill="var(--theme-core)" opacity="0.7" class="bar-grow-4" />
            
            {/* Connected analytical line */}
            <path d="M 95 230 L 145 170 L 195 125 L 245 200 L 295 110" fill="none" stroke="var(--theme-glow)" stroke-width="3" class="line-reveal" />
            
            <circle cx="195" cy="125" r="5" fill="#fff" />
            <circle cx="295" cy="110" r="5" fill="#fff" />
          </svg>
        );

      case 'extensibility-blocks':
        return (
          <svg class="visual-svg extensibility-blocks-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="var(--theme-core)" stroke-width="2">
              {/* Outer boundary box */}
              <rect x="60" y="60" width="280" height="280" rx="12" stroke-dasharray="10 5" />
              
              {/* Checkout core */}
              <rect x="100" y="100" width="200" height="200" rx="8" fill="var(--base-secondary)" opacity="0.5" />
              
              {/* Slide-in extension blocks */}
              <g class="block-slide-1">
                <rect x="120" y="120" width="160" height="40" rx="4" fill="var(--base-secondary)" stroke="var(--theme-glow)" stroke-width="2" />
                <circle cx="140" cy="140" r="5" fill="var(--theme-glow)" />
              </g>
              <g class="block-slide-2">
                <rect x="120" y="180" width="160" height="40" rx="4" fill="var(--base-secondary)" stroke="var(--theme-core)" stroke-width="2" />
                <circle cx="140" cy="200" r="5" fill="var(--theme-core)" />
              </g>
              <g class="block-slide-3">
                <rect x="120" y="240" width="160" height="40" rx="4" fill="var(--base-secondary)" stroke="var(--theme-core)" stroke-width="1" stroke-dasharray="4 4" />
              </g>
            </g>
          </svg>
        );

      default:
        return null;
    }
  }

  render() {
    const services = this.serviceType === 'ai' ? this.aiServices : this.shopifyServices;
    const currentThemeClass = this.serviceType === 'ai' ? 'track-ai' : 'track-shopify';

    return (
      <div class={`app-services-container ${currentThemeClass}`}>
        
        {/* PROGRESS DOTS SIDEBAR NAVIGATION */}
        <div class="service-dot-nav" role="navigation" aria-label="Page scroll position">
          {services.map((service, index) => (
            <button
              class={{ 'dot-nav-item': true, 'is-active': this.activeSectionIndex === index }}
              onClick={() => this.scrollToSection(index)}
              aria-label={`Scroll to ${service.title}`}
              aria-current={this.activeSectionIndex === index ? 'true' : 'false'}
            >
              <span class="dot-inner"></span>
              <span class="dot-tooltip">{service.title}</span>
            </button>
          ))}
        </div>

        {/* SERVICE DECKS */}
        <div class="service-deck-wrapper" ref={(el) => (this.wrapperRef = el)}>
        {services.map((service, index) => {
          // Automatic layout alternating
          const alignClass = index % 2 === 0 ? 'align-left' : 'align-right';

          return (
            <section id={service.id} class={`deck-section ${alignClass}`} key={service.id}>
              
              {/* PANEL 1: NARRATIVE BLOCK (45vw width) */}
              <div class="narrative-panel">
                <div class="panel-inner">
                  {/* Subtle Faint ID Label */}
                  <div class="faint-id-label">#{service.num}</div>
                  
                  {/* Heading */}
                  <h2 class="narrative-heading">
                    {service.title}
                  </h2>
                  
                  {/* Body Text */}
                  <p class="narrative-body-text">
                    {service.description}
                  </p>
                  
                  {/* Capabilities Bento Chips */}
                  <div class="capabilities-bento-grid">
                    {service.bentoChips.map((chip) => (
                      <div class="bento-chip" key={chip}>
                        <span class="chip-dot"></span>
                        <span class="chip-text">{chip}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Action Button in section footer */}
                  <div class="narrative-actions">
                    <button class="cta-outline-btn" onClick={this.handleBackToHome}>
                      [ CONTACT AN EXPERT ]
                    </button>
                  </div>
                </div>
              </div>

              {/* PANEL 2: ARTSTAGE STAGE VISUAL (55vw width) */}
              <div class="artstage-panel">
                <div class="artstage-decorations">
                  <div class="decor-circle bg-glow-circle-1"></div>
                  <div class="decor-circle bg-glow-circle-2"></div>
                </div>
                <div class="artstage-visual-container">
                  {this.renderVisualEngine(service.visualType)}
                </div>
              </div>

            </section>
          );
        })}
        </div>
      </div>
    );
  }
}
