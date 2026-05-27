import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';
import { Router } from "../../";


@Component({
  tag: 'foxy-nav',
  styleUrl: 'foxy-nav.css',
  shadow: false,
})
export class FoxyNav {
  @Prop() active: boolean = false;
  @Event() menuClose: EventEmitter<void>;

  @State() hoveredSubmenu: 'ai' | 'shopify' | null = null;
  @State() contactName: string = '';
  @State() contactDetails: string = '';
  @State() debateTopic: string = 'Quantum Supremacy';
  @State() debateAgents: string = '5';
  @State() debating: boolean = false;

  private handleClose = () => {
    this.menuClose.emit();
    this.hoveredSubmenu = null;
  };

  private setSubmenu = (menu: 'ai' | 'shopify' | null) => {
    this.hoveredSubmenu = menu;
  };

  private navigateToService = (track: 'ai' | 'shopify', anchor?: string) => {
    const path = `/services/${track}${anchor ? '#' + anchor : ''}`;
    Router.push(path);
    this.handleClose();
  };


  private triggerDebate = () => {
    if (this.debating) return;
    this.debating = true;
    setTimeout(() => {
      this.debating = false;
      alert(`Debate on "${this.debateTopic}" with ${this.debateAgents} Gemini Agents completed!`);
    }, 3500);
  };

  private handleEscalate = (e: Event) => {
    e.preventDefault();
    if (!this.contactName.trim()) {
      alert("Please enter a name.");
      return;
    }
    alert(`Escalation request sent for ${this.contactName}. Initiating connection protocol...`);
    this.contactName = '';
    this.contactDetails = '';
    this.handleClose();
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
    ].filter(Boolean).join(' ');

    const shopifyTriggerClasses = [
      'directory-item',
      'has-sub',
      this.hoveredSubmenu === 'shopify' ? 'is-focused' : '',
      this.hoveredSubmenu === 'ai' ? 'is-dimmed' : '',
    ].filter(Boolean).join(' ');

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
                  onClick={(e) => { e.preventDefault(); this.navigateToService('ai'); }}
                  onMouseEnter={() => this.setSubmenu('ai')}
                >
                  <span class="directory-num">01 //</span> AI ENGINEERING
                </a>

                <a
                  href="#"
                  class={shopifyTriggerClasses}
                  onClick={(e) => { e.preventDefault(); this.navigateToService('shopify'); }}
                  onMouseEnter={() => this.setSubmenu('shopify')}
                >
                  <span class="directory-num">02 //</span> SHOPIFY ENGINEERING
                </a>

                <a
                  href="#"
                  class="directory-item highlight"
                  onClick={(e) => { e.preventDefault(); alert("Gemini Case Studies Clicked"); this.handleClose(); }}
                  onMouseEnter={() => this.setSubmenu(null)}
                >
                  <span class="directory-num">03 //</span> CASE STUDIES
                </a>

                <a
                  href="/about"
                  class="directory-item"
                  onClick={(e) => { e.preventDefault(); Router.push('/about'); this.handleClose(); }}
                  onMouseEnter={() => this.setSubmenu(null)}
                >
                  <span class="directory-num">04 //</span> ABOUT
                </a>

                <a
                  href="/work-with-us"
                  class="directory-item"
                  onClick={(e) => { e.preventDefault(); Router.push('/work-with-us'); this.handleClose(); }}
                  onMouseEnter={() => this.setSubmenu(null)}
                >
                  <span class="directory-num">05 //</span> WORK WITH US
                </a>

                <a
                  href="/contact"
                  class="directory-item"
                  onClick={(e) => { e.preventDefault(); Router.push('/contact'); this.handleClose(); }}
                  onMouseEnter={() => this.setSubmenu(null)}
                >
                  <span class="directory-num">06 //</span> CONTACT
                </a>

                <a
                  href="/blog"
                  class="directory-item"
                  onClick={(e) => { e.preventDefault(); Router.push('/blog'); this.handleClose(); }}
                  onMouseEnter={() => this.setSubmenu(null)}
                >
                  <span class="directory-num">07 //</span> BLOG
                </a>

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

                  {/* BENTO BOX A1: AI DEBATE TEAM */}
                  <div class="nav-bento-box bento-debate">
                    <h3 class="bento-box-heading">AI DEBATE TEAM LOGIC <span class="badge">(GEMINI)</span></h3>

                    <div class="bento-debate-fields">
                      <div class="bento-form-group">
                        <label>TOPIC:</label>
                        <div class="bento-select-wrapper">
                          <select
                            onChange={(e: any) => this.debateTopic = e.target.value}
                            disabled={this.debating}
                          >
                            <option value="Quantum Supremacy" selected={this.debateTopic === 'Quantum Supremacy'}>[ Quantum Supremacy ]</option>
                            <option value="AGI Ethics" selected={this.debateTopic === 'AGI Ethics'}>[ AGI Ethics ]</option>
                            <option value="Shopify Liquid vs Headless" selected={this.debateTopic === 'Shopify Liquid vs Headless'}>[ Headless vs Liquid ]</option>
                            <option value="Autonomous Agents" selected={this.debateTopic === 'Autonomous Agents'}>[ Autonomous Agents ]</option>
                          </select>
                        </div>
                      </div>

                      <div class="bento-form-group">
                        <label>AGENTS:</label>
                        <div class="bento-select-wrapper">
                          <select
                            onChange={(e: any) => this.debateAgents = e.target.value}
                            disabled={this.debating}
                          >
                            <option value="3" selected={this.debateAgents === '3'}>[ 3 ]</option>
                            <option value="5" selected={this.debateAgents === '5'}>[ 5 ]</option>
                            <option value="8" selected={this.debateAgents === '8'}>[ 8 ]</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <p class="bento-box-description">
                      Gemini orchestration logic deployed for dynamic AI agent debate.
                    </p>

                    <div class="bento-debate-action">
                      <button
                        class={`bento-debate-btn ${this.debating ? 'is-debating' : ''}`}
                        onClick={this.triggerDebate}
                        disabled={this.debating}
                      >
                        {this.debating ? 'DEBATING...' : 'DEBATE!'}
                      </button>

                      <div class={`bento-visualizer ${this.debating ? 'active' : ''}`}>
                        <div class="visualizer-wave">
                          <span class="wave-bar bar-1"></span>
                          <span class="wave-bar bar-2"></span>
                          <span class="wave-bar bar-3"></span>
                          <span class="wave-bar bar-4"></span>
                          <span class="wave-bar bar-5"></span>
                        </div>
                        <span class="visualizer-status-text">{this.debating ? 'computing' : 'idle'}</span>
                      </div>
                    </div>
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

                  {/* BENTO BOX A3: CONTACT/LEAD ESCALATION */}
                  <div class="nav-bento-box bento-contact">
                    <h3 class="bento-box-heading">READY TO ESCALATE?</h3>
                    <p class="bento-box-subtitle">
                      Tell me about the logic layer or Shopify complexity you need solved.
                    </p>

                    <form onSubmit={this.handleEscalate} class="escalation-form">
                      <div class="form-group-field">
                        <input
                          type="text"
                          placeholder="[ NAME ]"
                          value={this.contactName}
                          onInput={(e: any) => this.contactName = e.target.value}
                          required
                        />
                      </div>
                      <div class="form-group-field">
                        <textarea
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
                  <span class="takeover-label">// RECONSTRUCTING GRID ... [ BRANCH: AI_ENGINEERING ]</span>
                  <h3 class="takeover-heading">INTELLIGENT SYSTEMS</h3>
                </div>

                <div class="takeover-link-grid">
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('ai', 'gemini-orchestration'); }}>
                    <span class="item-num">02.A</span>
                    <span class="item-label">GEMINI_ORCHESTRATION</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('ai', 'autonomous-agents'); }}>
                    <span class="item-num">02.B</span>
                    <span class="item-label">AUTONOMOUS_AGENTS</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('ai', 'secure-sdk-bridges'); }}>
                    <span class="item-num">02.C</span>
                    <span class="item-label">SECURE_SDK_BRIDGES</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('ai', 'logic-layer-integration'); }}>
                    <span class="item-num">02.D</span>
                    <span class="item-label">LOGIC_LAYER_INTEGRATION</span>
                    <span class="item-arrow">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* STAGE C: SHOPIFY ENGINEERING TAKEOVER */}
            <div class="stage-container stage-shopify">
              <div class="takeover-content">
                <div class="takeover-header">
                  <span class="takeover-label">// RECONSTRUCTING GRID ... [ BRANCH: SHOPIFY_ENGINEERING ]</span>
                  <h3 class="takeover-heading">COMMERCE SYSTEMS</h3>
                </div>

                <div class="takeover-link-grid">
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('shopify', 'headless-architecture'); }}>
                    <span class="item-num">03.A</span>
                    <span class="item-label">HEADLESS_ARCHITECTURE</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('shopify', 'platform-re-engineering'); }}>
                    <span class="item-num">03.B</span>
                    <span class="item-label">PLATFORM_RE-ENGINEERING</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('shopify', 'custom-app-development'); }}>
                    <span class="item-num">03.C</span>
                    <span class="item-label">CUSTOM_APP_DEVELOPMENT</span>
                    <span class="item-arrow">→</span>
                  </a>
                  <a href="#" class="takeover-link-item" onClick={(e) => { e.preventDefault(); this.navigateToService('shopify', 'extensibility-engines'); }}>
                    <span class="item-num">03.D</span>
                    <span class="item-label">EXTENSIBILITY_ENGINES</span>
                    <span class="item-arrow">→</span>
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
