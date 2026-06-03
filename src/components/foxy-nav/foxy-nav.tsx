import { Component, Prop, State, Event, EventEmitter, Method, h } from '@stencil/core';
import { Router } from "../../";
import themeStore from '../../store/theme';
import { triggerToast } from '../../utils/toast';


@Component({
  tag: 'foxy-nav',
  styleUrl: 'foxy-nav.css',
  shadow: false,
})
export class FoxyNav {
  @Prop() active: boolean = false;
  @Event() menuClose: EventEmitter<void>;
  @Event() drilldownChange: EventEmitter<boolean>;
  @Event() openDebate: EventEmitter<void>;

  @State() hoveredSubmenu: 'ai' | 'shopify' | null = null;
  @State() contactName: string = '';
  @State() contactDetails: string = '';
  @State() debateTopic: string = 'Quantum Supremacy';
  @State() debateAgents: string = '5';
  @State() debating: boolean = false;

  private toggleTheme = (mode: 'dark' | 'light', e: Event) => {
    e.preventDefault();
    themeStore.mode = mode;
  };

  private handleClose = () => {
    this.menuClose.emit();
    this.setSubmenu(null);
  };

  @Method()
  async resetDrilldown() {
    this.setSubmenu(null);
  }

  private setSubmenu = (menu: 'ai' | 'shopify' | null) => {
    if (this.hoveredSubmenu !== menu) {
      this.hoveredSubmenu = menu;
      this.drilldownChange.emit(menu !== null);
    }
  };

  private handleDesktopHover = (menu: 'ai' | 'shopify' | null) => {
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      this.setSubmenu(menu);
    }
  };

  private navigateToService = (track: 'ai' | 'shopify', anchor?: string) => {
    const path = `/services/${track}${anchor ? '#' + anchor : ''}`;
    Router.push(path);
    this.handleClose();
  };

  private handleEscalate = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.contactName.trim()) {
      triggerToast("Please enter a name.", 'alert');
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then(() => {
        triggerToast(`Escalation request sent for ${this.contactName}. Initiating connection protocol...`, 'success');
        this.contactName = '';
        this.contactDetails = '';
        this.handleClose();
      })
      .catch((error) => {
        triggerToast(error.toString(), 'alert');
      });
  };

  render() {
    const rootClasses = [
      'foxy-nav-takeover',
      this.active ? 'is-active' : '',
      this.hoveredSubmenu !== null ? 'takeover-stage-active' : '',
      this.hoveredSubmenu === 'ai' ? 'hover-ai' : '',
      this.hoveredSubmenu === 'shopify' ? 'hover-shopify' : '',
    ].filter(Boolean).join(' ');

    const aiTriggerClasses = [
      'directory-item',
      'has-sub',
      this.hoveredSubmenu === 'ai' ? 'is-focused' : '',
      this.hoveredSubmenu === 'shopify' ? 'is-dimmed' : '',
      Router.activePath?.includes('/services/ai') ? 'highlight' : '',
    ].filter(Boolean).join(' ');

    const shopifyTriggerClasses = [
      'directory-item',
      'has-sub',
      this.hoveredSubmenu === 'shopify' ? 'is-focused' : '',
      this.hoveredSubmenu === 'ai' ? 'is-dimmed' : '',
      Router.activePath?.includes('/services/shopify') ? 'highlight' : '',
    ].filter(Boolean).join(' ');

    const isPathActive = (path: string) => Router.activePath === path || Router.activePath?.startsWith(`${path}/`);

    return (
      <div class={rootClasses}>
        {/* BACKDROP CONSTELATION ANIMATION */}
        {this.active && <foxy-constellation class="nav-constellation-bg"></foxy-constellation>}

        {/* DIAGONAL TRANSITION BACKGROUND SECTORS */}
        <div class="nav-bg-sector-left"></div>
        <div class="nav-bg-sector-right"></div>

        {/* NAVIGATION TAKEOVER CONTAINER GRID */}
        <div class="nav-takeover-grid">

          {/* COLUMN 1: DIRECTORY LINKS */}
          <div class="nav-grid-col col-directory">
            <div class="col-inner">
              <nav class="directory-list">

                <a
                  href="#"
                  class={aiTriggerClasses}
                  onClick={(e) => { e.preventDefault(); this.setSubmenu('ai'); }}
                  onMouseEnter={() => this.handleDesktopHover('ai')}
                >
                  <span class="directory-num">01 //</span> AI ENGINEERING
                </a>

                <a
                  href="#"
                  class={shopifyTriggerClasses}
                  onClick={(e) => { e.preventDefault(); this.setSubmenu('shopify'); }}
                  onMouseEnter={() => this.handleDesktopHover('shopify')}
                >
                  <span class="directory-num">02 //</span> SHOPIFY ENGINEERING
                </a>

                <a
                  href="/case-studies"
                  class={`directory-item ${isPathActive('/case-studies') ? 'highlight' : ''}`}
                  onClick={(e) => { e.preventDefault(); Router.push('/case-studies'); this.handleClose(); }}
                  onMouseEnter={() => this.handleDesktopHover(null)}
                >
                  <span class="directory-num">03 //</span> CASE STUDIES
                </a>

                <a
                  href="/about"
                  class={`directory-item ${isPathActive('/about') ? 'highlight' : ''}`}
                  onClick={(e) => { e.preventDefault(); Router.push('/about'); this.handleClose(); }}
                  onMouseEnter={() => this.handleDesktopHover(null)}
                >
                  <span class="directory-num">04 //</span> ABOUT
                </a>

                <a
                  href="/work-with-us"
                  class={`directory-item ${isPathActive('/work-with-us') ? 'highlight' : ''}`}
                  onClick={(e) => { e.preventDefault(); Router.push('/work-with-us'); this.handleClose(); }}
                  onMouseEnter={() => this.handleDesktopHover(null)}
                >
                  <span class="directory-num">05 //</span> WORK WITH US
                </a>

                <a
                  href="/contact"
                  class={`directory-item ${isPathActive('/contact') ? 'highlight' : ''}`}
                  onClick={(e) => { e.preventDefault(); Router.push('/contact'); this.handleClose(); }}
                  onMouseEnter={() => this.handleDesktopHover(null)}
                >
                  <span class="directory-num">06 //</span> CONTACT
                </a>

                <a
                  href="/blog"
                  class={`directory-item ${isPathActive('/blog') ? 'highlight' : ''}`}
                  onClick={(e) => { e.preventDefault(); Router.push('/blog'); this.handleClose(); }}
                  onMouseEnter={() => this.handleDesktopHover(null)}
                >
                  <span class="directory-num">07 //</span> BLOG
                </a>

                {/* MOBILE FLOATING THEME TOGGLE & ORCHESTRATION TRIGGER */}
                <div class="nav-theme-toggle-mobile">
                  <button
                    class={`theme-btn ${themeStore.mode === 'dark' ? 'is-active' : ''}`}
                    onClick={(e) => this.toggleTheme('dark', e)}
                  >
                    DARK
                  </button>
                  <button
                    class={`theme-btn ${themeStore.mode === 'light' ? 'is-active' : ''}`}
                    onClick={(e) => this.toggleTheme('light', e)}
                  >
                    LIGHT
                  </button>
                  <button
                    class="theme-btn orchestration-trigger-btn"
                    onClick={(e) => { e.preventDefault(); this.openDebate.emit(); this.handleClose(); }}
                  >
                    ORCHESTRATE
                  </button>
                </div>

              </nav>
            </div>
          </div>

          {/* DYNAMIC SHIFT CONTAINER FOR MIDDLE AND RIGHT COLUMNS */}
          <div class="nav-grid-stage-wrapper">

            {/* STAGE A: DEFAULT STATE BENTO GRID (BLOG, DEBATE, CONTACT) */}
            <div class="stage-container stage-default">

              {/* MIDDLE BENTO PANEL COLUMN */}
              <div class="nav-grid-col col-bento-middle">
                <div class="col-inner">

                  {/* BENTO BOX A1: NEW BLOG POST PLACEMENT (Replaced Debate) */}
                  <div class="nav-bento-box bento-performance">
                    <h3 class="bento-box-heading">THE EDGE ORCHESTRATION LAYER</h3>
                    <span class="bento-box-meta">MAY 2026</span>

                    <div class="bento-dom-tree">
                      <div class="dom-node root-node">NETLIFY EDGE</div>
                      <div class="dom-branches">
                        <div class="dom-line"></div>
                        <div class="dom-branch-group">
                          <div class="dom-node child-node">AGENT A</div>
                          <div class="dom-node child-node">AGENT B</div>
                        </div>
                      </div>
                    </div>

                    <p class="bento-box-description">
                      How we utilize edge networks to facilitate high-speed, multi-agent AI debates.
                    </p>

                    <a href="#" class="bento-action-link" onClick={(e) => { e.preventDefault(); triggerToast("Orchestration Article Clicked", 'info'); this.handleClose(); }}>
                      [ READ ARTICLE ]
                    </a>
                  </div>

                  {/* BENTO BOX A2: LIGHT DOM PERFORMANCE */}
                  <div class="nav-bento-box bento-performance">
                    <h3 class="bento-box-heading">LIGHT DOM FOR HEAVY ENGINEERING</h3>
                    <span class="bento-box-meta">OCT 2026</span>

                    {/* DOM Tree Diagram visualization in Light DOM */}
                    <div class="bento-dom-tree">
                      <div class="dom-node root-node">HOST</div>
                      <div class="dom-branches">
                        <div class="dom-line"></div>
                        <div class="dom-branch-group">
                          <div class="dom-node child-node">LIGHT DOM</div>
                          <div class="dom-node child-node">LIGHT DOM</div>
                        </div>
                      </div>
                    </div>

                    <p class="bento-box-description">
                      Optimizing Stencil apps for speed and accessibility, not trends.
                    </p>

                    <a href="#" class="bento-action-link" onClick={(e) => { e.preventDefault(); alert("DOM Article Clicked"); this.handleClose(); }}>
                      [ READ ARTICLE ]
                    </a>
                  </div>

                </div>
              </div>

              {/* RIGHT COLUMN: LEAD ESCALATION */}
              <div class="nav-grid-col col-bento-right">
                <div class="col-inner">

                  {/* DESKTOP THEME TOGGLE & ORCHESTRATION TRIGGER */}
                  <div class="nav-theme-toggle-desktop">
                    <button
                      class={`theme-btn ${themeStore.mode === 'dark' ? 'is-active' : ''}`}
                      onClick={(e) => this.toggleTheme('dark', e)}
                    >
                      [ DARK MODE ]
                    </button>
                    <button
                      class={`theme-btn ${themeStore.mode === 'light' ? 'is-active' : ''}`}
                      onClick={(e) => this.toggleTheme('light', e)}
                    >
                      [ LIGHT MODE ]
                    </button>
                    <button
                      class="theme-btn orchestration-trigger-btn"
                      onClick={(e) => { e.preventDefault(); this.openDebate.emit(); this.handleClose(); }}
                    >
                      [ MULTI-AGENT ORCHESTRATION ]
                    </button>
                  </div>

                  {/* BENTO BOX A3: CONTACT/LEAD ESCALATION */}
                  <div class="nav-bento-box bento-contact">
                    <h3 class="bento-box-heading">READY TO ESCALATE?</h3>
                    <p class="bento-box-subtitle">
                      Tell me about the logic layer or Shopify complexity you need solved.
                    </p>

                    <form name="escalate" method="POST" data-netlify="true" onSubmit={this.handleEscalate} class="escalation-form">
                      <input type="hidden" name="form-name" value="escalate" />

                      <div class="form-group-field">
                        <input
                          type="text"
                          name="name"
                          placeholder="[ NAME ]"
                          value={this.contactName}
                          onInput={(e: any) => this.contactName = e.target.value}
                          required
                        />
                      </div>
                      <div class="form-group-field">
                        <textarea
                          name="details"
                          placeholder="[ PROJECT DETAILS (TEXTAREA) ]"
                          rows={4}
                          value={this.contactDetails}
                          onInput={(e: any) => this.contactDetails = e.target.value}
                          required
                        ></textarea>
                      </div>



                      <button type="submit" class="escalation-submit-btn">
                        [ ESCALATE PROJECT ]
                      </button>
                    </form>

                    {/* Foxy geometric star footer decoration */}
                    <div class="contact-decoration-star"></div>
                  </div>

                </div>
              </div>

            </div>

            {/* STAGE B: AI ENGINEERING TAKEOVER */}
            <div class="stage-container stage-ai">
              <div class="takeover-content">
                <div class="takeover-header">
                  <h3 class="takeover-heading">INTELLIGENT SYSTEMS</h3>
                </div>

                <div class="takeover-link-grid">
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('ai', 'agentic-engineering'); }}>
                    <span class="item-num">02.A</span>
                    <span class="item-label">AGENTIC ENGINEERING</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('ai', 'multi-agent-orchestration'); }}>
                    <span class="item-num">02.B</span>
                    <span class="item-label">MULTI-AGENT ORCHESTRATION</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('ai', 'token-architecture-efficiency'); }}>
                    <span class="item-num">02.C</span>
                    <span class="item-label">TOKEN ARCHITECTURE</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('ai', 'llm-fine-tuning-rag'); }}>
                    <span class="item-num">02.D</span>
                    <span class="item-label">LLM FINE-TUNING & RAG</span>
                    <span class="item-arrow">→</span>
                  </a>

                  <a href="#" class="takeover-explore-btn" onClick={(e) => { e.preventDefault(); this.navigateToService('ai'); }}>
                    [ EXPLORE FULL ARCHITECTURE &rarr; ]
                  </a>
                </div>
              </div>
            </div>

            {/* STAGE C: SHOPIFY ENGINEERING TAKEOVER */}
            <div class="stage-container stage-shopify">
              <div class="takeover-content">
                <div class="takeover-header">
                  <h3 class="takeover-heading">COMMERCE SYSTEMS</h3>
                </div>

                <div class="takeover-link-grid">
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('shopify', 'headless-shopify'); }}>
                    <span class="item-num">03.A</span>
                    <span class="item-label">HEADLESS SHOPIFY</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('shopify', 'checkout-extensibility'); }}>
                    <span class="item-num">03.B</span>
                    <span class="item-label">CHECKOUT EXTENSIBILITY</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('shopify', 'build-migrate'); }}>
                    <span class="item-num">03.C</span>
                    <span class="item-label">BUILD & MIGRATE</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('shopify', 'custom-apps'); }}>
                    <span class="item-num">03.D</span>
                    <span class="item-label">CUSTOM APPLICATIONS</span>
                    <span class="item-arrow">→</span>
                  </a>

                  <a href="#" class="takeover-explore-btn" onClick={(e) => { e.preventDefault(); this.navigateToService('shopify'); }}>
                    [ EXPLORE FULL PLATFORM &rarr; ]
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>



      </div>
    );
  }
}
