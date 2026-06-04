import { Component, Prop, Event, EventEmitter, h, Build, State } from '@stencil/core';

@Component({
  tag: 'foxy-pricing-modal',
  styleUrl: 'foxy-pricing-modal.css',
  shadow: false,
})
export class FoxyPricingModal {
  @Prop() isOpen: boolean = false;
  @Event() closePricing: EventEmitter<void>;

  @State() activeToken: 'day_rate' | 'project' | 'retainer' = 'project';

  private handleClose = () => {
    this.closePricing.emit();
  };

  private handleTriggerConcierge = () => {
    this.handleClose();
    if (Build.isBrowser) {
      window.dispatchEvent(new CustomEvent('foxy-open-concierge'));
    }
  };

  private setToken = (token: 'day_rate' | 'project' | 'retainer') => {
    this.activeToken = token;
  };

  render() {
    const overlayClasses = {
      'pricing-overlay': true,
      'is-open': this.isOpen
    };

    return (
      <div class={overlayClasses}>
        <div class="pricing-container">

          {/* HEADER */}
          <div class="pricing-header">
            <div class="header-title">
              <div class="pulse-dot"></div>
              <h3>TERMS & PROTOCOLS</h3>
            </div>
            <button class="close-btn" onClick={this.handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* TWO-PANE LAYOUT */}
          <div class="pricing-body">

            {/* LEFT PANE: TILES */}
            <div class="pricing-left-pane">
              <div class="tile-list">
                <button
                  class={`pricing-tile ${this.activeToken === 'day_rate' ? 'is-active' : ''}`}
                  onMouseEnter={() => this.setToken('day_rate')}
                  onClick={() => this.setToken('day_rate')}
                >
                  <div class="tile-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div class="tile-text">
                    <h4>DAY RATE</h4>
                    <span>Linear Sprint Cycles</span>
                  </div>
                </button>

                <button
                  class={`pricing-tile ${this.activeToken === 'project' ? 'is-active' : ''}`}
                  onMouseEnter={() => this.setToken('project')}
                  onClick={() => this.setToken('project')}
                >
                  <div class="tile-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  </div>
                  <div class="tile-text">
                    <h4>PROJECT</h4>
                    <span>Phase-Locked Deliverables</span>
                  </div>
                </button>

                <button
                  class={`pricing-tile ${this.activeToken === 'retainer' ? 'is-active' : ''}`}
                  onMouseEnter={() => this.setToken('retainer')}
                  onClick={() => this.setToken('retainer')}
                >
                  <div class="tile-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <div class="tile-text">
                    <h4>RETAINER</h4>
                    <span>Bandwidth Instances</span>
                  </div>
                </button>
              </div>
            </div>

            {/* RIGHT PANE: DYNAMIC CONTENT */}
            <div class="pricing-right-pane scroll-pane">
              {this.activeToken === 'day_rate' && (
                <div class="content-field">
                  <h2 class="pane-title">DAY RATE PROTOCOL</h2>
                  <div class="info-section">
                    <h3>01. AGILE DEPLOYMENT</h3>
                    <p>
                      Standard engineering engagements deploy at a fixed baseline daily rate. High-complexity operations, emergency optimizations, and rapid-response tasks scale dynamically based on architectural scope and required intelligence depth.
                    </p>
                    <div class="metric-box">
                      <span class="metric-label">BASE DAILY RATE</span>
                      <span class="metric-value">£250 / DAY</span>
                    </div>
                  </div>
                  <div class="info-section">
                    <h3>02. BEST USED FOR</h3>
                    <ul class="standard-list">
                      <li><strong>Isolated Feature Sprints:</strong> Rapid prototyping, standalone API integrations, or high-velocity micro-feature deployment.</li>
                      <li><strong>Codebase Rescue Operations:</strong> Emergency telemetry auditing, deep-tier bug hunting, and critical infrastructure stability patches.</li>
                      <li><strong>Architectural Scoping:</strong> Technical blueprinting, data-pipeline design, and custom AI ecosystem readiness analysis.</li>
                    </ul>
                  </div>
                  <div class="cta-wrapper">
                    <button class="vulpine-btn red-glow" onClick={this.handleTriggerConcierge}>
                      INITIATE BRIEFING
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                  </div>
                </div>
              )}

              {this.activeToken === 'project' && (
                <div class="content-field">
                  <h2 class="pane-title">PROJECT DEPLOYMENT</h2>
                  <div class="info-section">
                    <h3>01. MILESTONE MATRIX</h3>
                    <p>
                      For comprehensive, end-to-end builds, Vulpine enforces a strict, non-negotiable milestone matrix. Engineering resource allocation requires a mandatory 40% initialization protocol to lock your build window. Subsequent allocations are bound directly to verified milestone deployment phases, ensuring absolute transparency and mutual structural alignment throughout the sprint lifecycle.
                    </p>
                    <div class="split-visualizer">
                      <div class="split-bar initial">
                        <span class="split-percent">40%</span>
                        <span class="split-label">INITIATION</span>
                      </div>
                      <div class="split-bar mid">
                        <span class="split-percent">40%</span>
                        <span class="split-label">BETA DEPLOY</span>
                      </div>
                      <div class="split-bar final">
                        <span class="split-percent">20%</span>
                        <span class="split-label">HANDOVER</span>
                      </div>
                    </div>
                  </div>
                  <div class="info-section">
                    <h3>02. SCOPE LOCK</h3>
                    <p>
                      All projects are bound to a strict technical manifest. Any deviation or feature creep outside the agreed architecture pauses deployment and triggers an immediate architectural change request. This protocol aggressively protects your delivery timeline and our execution velocity.
                    </p>
                  </div>
                  <div class="cta-wrapper">
                    <button class="vulpine-btn red-glow" onClick={this.handleTriggerConcierge}>
                      INITIATE BRIEFING
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                  </div>
                </div>
              )}

              {this.activeToken === 'retainer' && (
                <div class="content-field">
                  <h2 class="pane-title">INTEGRATED INTELLIGENCE</h2>
                  <div class="info-section">
                    <h3>01. CORE RULES OF ENGAGEMENT</h3>
                    <p>
                      Every Vulpine retainer allocates raw engineering power directly to your business objectives under five baseline parameters:
                    </p>
                    <ul class="standard-list">
                      <li>
                        <strong>Cross-Functional Elasticity</strong>
                        Allocated hours can be deployed across any requirement—from debugging third-party integrations to architecting entirely new AI pipelines.
                      </li>
                      <li>
                        <strong>Asset Rollover</strong>
                        Unused engineering hours automatically roll over into the following monthly cycle.
                      </li>
                      <li>
                        <strong>Project Amortization</strong>
                        Active instances can be leveraged to distribute comprehensive end-to-end project build costs into predictable monthly installments.
                      </li>
                      <li>
                        <strong>Ecosystem Incentive</strong>
                        Securing a retainer at the initiation of a custom project applies a flat 10% reduction to the overall project contract cost.
                      </li>
                    </ul>
                  </div>
                  <div class="info-section">
                    <h3>02. SLA LATENCY & TELEMETRY WINDOWS</h3>
                    <p>
                      All response metrics operate within our Active Telemetry Window: <strong>08:00 to 22:00 GMT, 7 days a week.</strong> Requests logged within this window trigger immediate countdowns based on your instance tier. Requests filed after 22:00 GMT are securely queued, with SLA response timers initializing at 08:00 GMT the following morning.
                    </p>
                    <p>
                      Asymmetric Weekend Routing: Technical tasks executed between <strong>Friday 18:00 and Monday 08:00 GMT</strong> burn allocated retainer hours at an asymmetric 2x rate to maintain 365-day mission readiness.
                    </p>
                  </div>
                  <div class="info-section">
                    <h3>03. BANDWIDTH PROVISIONS [MAX CAPACITY: 5 TOTAL INSTANCES]</h3>
                    <div class="sla-grid">
                      <div class="sla-card">
                        <h4>VULPINE CORE</h4>
                        <span class="sla-badge">CORE</span>
                        <p>2 HRS / MO // 24-HR SLA // £250/mo</p>
                      </div>
                      <div class="sla-card">
                        <h4>VULPINE ADVANCED</h4>
                        <span class="sla-badge silver">ADVANCED</span>
                        <p>4 HRS / MO // 12-HR SLA // £400/mo</p>
                      </div>
                      <div class="sla-card highlight">
                        <h4>VULPINE ELITE</h4>
                        <span class="sla-badge gold">ELITE</span>
                        <p>8 HRS / MO // 6-HR SLA // £650/mo</p>
                      </div>
                    </div>
                  </div>
                  <div class="cta-wrapper">
                    <button class="vulpine-btn red-glow" onClick={this.handleTriggerConcierge}>
                      INITIATE BRIEFING
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }
}
