import { Component, Prop, Event, EventEmitter, h, Build } from '@stencil/core';

@Component({
  tag: 'foxy-pricing-modal',
  styleUrl: 'foxy-pricing-modal.css',
  shadow: false,
})
export class FoxyPricingModal {
  @Prop() isOpen: boolean = false;
  @Event() closePricing: EventEmitter<void>;

  private handleClose = () => {
    this.closePricing.emit();
  };

  private handleTriggerConcierge = () => {
    this.handleClose();
    if (Build.isBrowser) {
      window.dispatchEvent(new CustomEvent('foxy-open-concierge'));
    }
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
            
            {/* LEFT PANE: PAYMENT & SLAS */}
            <div class="pricing-left-pane scroll-pane">
              <h2 class="pane-title">FINANCIAL & SERVICE MATRICES</h2>
              
              <div class="info-section">
                <h3>01. DAY RATES & RETAINERS</h3>
                <p>Standard operating deployment is calculated at a baseline day rate. Specialized operations and rapid-deployment tasks are fully negotiable based on scope and required intelligence levels.</p>
                <div class="metric-box">
                  <span class="metric-label">BASE DAILY RATE</span>
                  <span class="metric-value">£450 / DAY</span>
                </div>
              </div>

              <div class="info-section">
                <h3>02. PROJECT-BASED DEPLOYMENT</h3>
                <p>For end-to-end tactical builds, we operate on a strictly structured financial milestone protocol to ensure mutual security.</p>
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
                <h3>03. SERVICE LEVEL AGREEMENTS (SLA)</h3>
                <div class="sla-grid">
                  <div class="sla-card">
                    <h4>VULPINE CORE</h4>
                    <span class="sla-badge">BRONZE</span>
                    <p>Standard hosting, weekly security patches, and 48-hour response matrix.</p>
                  </div>
                  <div class="sla-card">
                    <h4>VULPINE ADVANCED</h4>
                    <span class="sla-badge silver">SILVER</span>
                    <p>Priority rendering, daily backups, and 12-hour strategic response time.</p>
                  </div>
                  <div class="sla-card highlight">
                    <h4>VULPINE ELITE</h4>
                    <span class="sla-badge gold">GOLD</span>
                    <p>Dedicated architectural support, live monitoring, and instant critical response.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT PANE: ACCREDITATIONS & CTA */}
            <div class="pricing-right-pane">
              <div class="right-pane-content">
                <h4 class="manifest-title">ACCREDITATIONS & INTEL</h4>
                <ul class="accreditation-list">
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red-glow)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Registered ISO 27001 Security Protocols</span>
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red-glow)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>AWS Certified Solutions Architect</span>
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red-glow)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Google Cloud Partner Tier</span>
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red-glow)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Vercel Enterprise Agency</span>
                  </li>
                </ul>

                <div class="cta-wrapper">
                  <p>Ready to deploy your tactical assets?</p>
                  <button class="vulpine-btn red-glow" onClick={this.handleTriggerConcierge}>
                    INITIATE BRIEFING
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>

                <div class="manifest-decoration"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
