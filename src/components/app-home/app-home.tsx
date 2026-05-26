import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: false,
})
export class AppHome {
  @State() introActive: boolean = true;
  @State() introPhase: number = 0; // 0: Init/FadeIn, 1: TextSlideOut/FadeOut, 2: ColumnsEntering
  @State() activePanel: 'ai' | 'shopify' | null = null;

  componentWillLoad() {
    // Check if the cinematic intro has already played in this browser session
    const hasIntroPlayed = sessionStorage.getItem('volpine_intro_played') === 'true';
    
    if (hasIntroPlayed) {
      this.introActive = false;
      this.introPhase = 3; // Ready state
    } else {
      this.runCinematicSequence();
    }
  }

  private runCinematicSequence() {
    this.introActive = true;
    this.introPhase = 0;

    // Phase 1: Word & logo fade out after 2.2 seconds
    setTimeout(() => {
      this.introPhase = 1;
    }, 2200);

    // Phase 2: Split columns slide into view from top/bottom at 3.2 seconds
    setTimeout(() => {
      this.introPhase = 2;
    }, 3200);

    // Phase 3: Transition completely complete at 4.6 seconds, active state unlocked
    setTimeout(() => {
      this.introPhase = 3;
      this.introActive = false;
      sessionStorage.setItem('volpine_intro_played', 'true');
    }, 4600);
  }

  private handlePanelEnter(panel: 'ai' | 'shopify') {
    this.activePanel = panel;
  }

  private handlePanelLeave() {
    this.activePanel = null;
  }

  render() {
    const isIntroSequence = this.introActive;
    
    return (
      <div class={{
        'app-home-layout': true,
        'intro-running': isIntroSequence,
        [`phase-${this.introPhase}`]: isIntroSequence,
        'hover-ai': this.activePanel === 'ai',
        'hover-shopify': this.activePanel === 'shopify',
      }}>
        
        {/* CINEMATIC INTRO OVERLAY */}
        {isIntroSequence && (
          <div class="intro-overlay">
            <div class="intro-content">
              <foxy-logo size="large" class="intro-logo-anim"></foxy-logo>
              <h1 class="intro-title">VULPINE</h1>
              <p class="intro-subtitle">AI SYSTEMS & SHOPIFY ARCHITECTURE</p>
            </div>
          </div>
        )}

        {/* FULLSCREEN SPLIT HERO CONTAINER */}
        <section class="split-hero-container">
          
          {/* LEFT COLUMN: AI ARCHITECTURE */}
          <div 
            class={{
              'hero-panel': true,
              'panel-ai': true,
              'active': this.activePanel === 'ai',
              'inactive': this.activePanel === 'shopify',
            }}
            onMouseEnter={() => this.handlePanelEnter('ai')}
            onMouseLeave={() => this.handlePanelLeave()}
          >
            {/* Interactive living lines canvas behind the logo */}
            {!isIntroSequence && <foxy-constellation></foxy-constellation>}
            
            <div class="panel-content">
              <div class="logo-wrapper">
                <foxy-logo size="large"></foxy-logo>
              </div>
              
              <div class="text-block">
                <h2 class="panel-heading">
                  ARCHITECT <br />
                  THE FUTURE <br />
                  OF AI.
                </h2>
                
                {/* Expanded text appearing in the open hover state (as in homepage_open.png) */}
                <p class="panel-description">
                  GEMINI ORCHESTRATION, CUSTOM AGENTS, LOGIC LAYER, AND END-TO-END LLM ENGINEERING. WE BUILD INTELLECTUAL PLATFORMS, SECURE SDK INTEGRATIONS, AND COMPONENT-DRIVEN INFRASTRUCTURE BUCKING THE TREND.
                </p>
                
                <a href="#" class="foxy-cta-button" onClick={(e) => { e.preventDefault(); alert("Explore Gemini Solutions Clicked"); }}>
                  [ EXPLORE GEMINI SOLUTIONS ]
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SHOPIFY SYSTEMS */}
          <div 
            class={{
              'hero-panel': true,
              'panel-shopify': true,
              'active': this.activePanel === 'shopify',
              'inactive': this.activePanel === 'ai',
            }}
            onMouseEnter={() => this.handlePanelEnter('shopify')}
            onMouseLeave={() => this.handlePanelLeave()}
          >
            {/* Vector Shopping Cart Backdrop */}
            <div class="panel-backdrop-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.7">
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                <circle cx="9" cy="21" r="1" fill="currentColor" />
                <circle cx="20" cy="21" r="1" fill="currentColor" />
              </svg>
            </div>

            <div class="panel-content">
              <div class="text-block">
                <h2 class="panel-heading">
                  ENGINEER <br />
                  COMMERCE <br />
                  SYSTEMS.
                </h2>
                
                {/* Expanded text appearing in the open hover state */}
                <p class="panel-description">
                  HIGH-CONVERSION SHOPIFY STORES, HEADLESS LIQUID CODEBASES, CUSTOM EXTENSIONS, PIXEL-PERFECT SCHEMAS, AND STENCIL ARCHITECTURE DELIVERING SPEED, ACCESSIBILITY, AND DRY CODE PATTERNS.
                </p>
                
                <a href="#" class="foxy-cta-button" onClick={(e) => { e.preventDefault(); alert("Build Stores Clicked"); }}>
                  [ BUILD HIGH-CONVERSION SHOPIFY STORES ]
                </a>
              </div>
            </div>
          </div>
          
        </section>
        
      </div>
    );
  }
}
