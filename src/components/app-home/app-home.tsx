import { Component, State, h } from '@stencil/core';
import { setSEO } from '../../utils/seo';

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
    setSEO({
      title: 'Vulpine Digital | Autonomous AI & Shopify Engineering',
      description: 'We build bulletproof commerce architectures and autonomous AI agents. Less vibing, more velocity.',
      url: 'https://vulpine.digital/'
    });

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

  private handlePanelClick(panel: 'ai' | 'shopify', e: Event) {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      if (this.activePanel === panel) {
        this.activePanel = null;
      } else {
        this.activePanel = panel;
        // Scroll into view after transition starts
        setTimeout(() => {
          (e.currentTarget as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }

  private handlePanelEnter(panel: 'ai' | 'shopify') {
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      this.activePanel = panel;
    }
  }

  private handlePanelLeave() {
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      this.activePanel = null;
    }
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
        <h1 class="sr-only">Vulpine Digital - AI & Commerce Engineering</h1>

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
            onClick={(e) => this.handlePanelClick('ai', e)}
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
                  TREND <br />
                  DEFYING AI.
                </h2>

                {/* Expanded text appearing in the open hover state (as in homepage_open.png) */}
                <p class="panel-description">
                  We don’t do AI buzzword bingo. We build the actual tech. From fine-tuned models and agentic orchestration to rapid-fire traditional software, Vulpine has the raw machinery to ship what others just PowerPoint about. Less vibing, more velocity.
                </p>

                <a href="/services/applied-ai" class="foxy-cta-button">
                  [ Deploy the tech... ]
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
            onClick={(e) => this.handlePanelClick('shopify', e)}
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
                  UNHINGED <br />
                  SHOPIFY.
                </h2>

                {/* Expanded text appearing in the open hover state */}
                <p class="panel-description">
                  Our roots. Our playground. And hell, we make it look good. Shopify has never had this much sex appeal. From unhinged custom themes to show-stopping features that actually convert, we build bulletproof e-com architecture that lasts. If you want a basic template, go elsewhere. If you want to dominate, you need Vulpine.
                </p>

                <a href="/services/shopify" class="foxy-cta-button">
                  [ See the appeal... ]
                </a>
              </div>
            </div>
          </div>

        </section>

      </div>
    );
  }
}
