import { Component, State, h } from '@stencil/core';
import { setSEO } from '../../utils/seo';
import { triggerToast } from '../../utils/toast';

@Component({
  tag: 'app-contact',
  styleUrl: 'app-contact.css',
  shadow: false,
})
export class AppContact {
  @State() formName: string = '';
  @State() formEmail: string = '';
  @State() formSite: string = '';
  @State() formType: 'ai' | 'shopify' = 'ai';
  @State() formMessage: string = '';
  @State() isSubmitting: boolean = false;
  @State() isCapacityExpanded: boolean = false;

  componentWillLoad() {
    setSEO({
      title: 'Contact Vulpine | Escalate Your Engineering Challenges',
      description: 'Secure transmission line to Vulpine Digital. Escalate your Shopify and AI system architecture needs.',
      url: 'https://vulpine.digital/contact'
    });
  }

  private handleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.isSubmitting = true;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then(() => {
        this.isSubmitting = false;
        triggerToast('Transmission successful. Vulpine logic layer activated.', 'success');
        this.formName = '';
        this.formEmail = '';
        this.formSite = '';
        this.formMessage = '';
      })
      .catch((error) => {
        this.isSubmitting = false;
        triggerToast(error.toString(), 'alert');
      });
  };

  render() {
    return (
      <div class="contact-wrapper">
        <foxy-hero 
          headline="INITIATE PROTOCOL"
          subheadline="Escalate your engineering challenges to Vulpine."
        ></foxy-hero>

        <main class="contact-split-layout">
          
          {/* LEFT PANE: TELEMETRY & COMMS */}
          <section class="pane-telemetry">
            
            {/* Capacity Indicator: Server Rack */}
            <div class="capacity-module">
              <div 
                class="module-header" 
                onClick={() => { if (typeof window !== 'undefined' && window.innerWidth <= 1024) this.isCapacityExpanded = !this.isCapacityExpanded; }}
              >
                <h3>VULPINE CAPACITY // SYSTEM LOAD</h3>
                <span class="status-indicator">
                  2/5 ACTIVE
                  <span class="collapse-icon mobile-only">{this.isCapacityExpanded ? '▲' : '▼'}</span>
                </span>
              </div>
              <div class={`server-rack ${this.isCapacityExpanded ? 'expanded' : 'collapsed'}`}>
                
                {/* Slot 1: Shopify */}
                <div class="rack-slot occupied-shopify">
                  <div class="slot-lights">
                    <span class="blinker"></span>
                    <span class="blinker"></span>
                  </div>
                  <div class="slot-data">
                    <span class="slot-label">ENGAGEMENT: SHOPIFY_CORE</span>
                    <span class="slot-desc">[ Headless Architecture Build ]</span>
                  </div>
                </div>

                {/* Slot 2: AI */}
                <div class="rack-slot occupied-ai">
                  <div class="slot-lights">
                    <span class="blinker"></span>
                    <span class="blinker"></span>
                  </div>
                  <div class="slot-data">
                    <span class="slot-label">ENGAGEMENT: ORCHESTRATION</span>
                    <span class="slot-desc">[ Autonomous Agent Integration ]</span>
                  </div>
                </div>

                {/* Slots 3-5: Available */}
                <div class="rack-slot available">
                  <div class="slot-lights"><span class="blinker idle"></span></div>
                  <div class="slot-data"><span class="slot-label">SLOT 03 // AVAILABLE</span></div>
                </div>
                <div class="rack-slot available">
                  <div class="slot-lights"><span class="blinker idle"></span></div>
                  <div class="slot-data"><span class="slot-label">SLOT 04 // AVAILABLE</span></div>
                </div>
                <div class="rack-slot available">
                  <div class="slot-lights"><span class="blinker idle"></span></div>
                  <div class="slot-data"><span class="slot-label">SLOT 05 // AVAILABLE</span></div>
                </div>

              </div>
            </div>

            {/* Oversized Social Router */}
            <div class="social-router">
              <a href="#" class="social-touchpoint" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <span>LINKEDIN</span>
              </a>
              <a href="#" class="social-touchpoint" title="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span>GITHUB</span>
              </a>
              <a href="#" class="social-touchpoint" title="Twitter / X">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                <span>X_NET</span>
              </a>
              <a href="#" class="social-touchpoint" title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>INSTA</span>
              </a>
            </div>

            {/* Direct Comms */}
            <div class="direct-comms">
              <a href="mailto:operator@vulpine.dev" class="comm-link">[ EMAIL // operator@vulpine.dev ]</a>
              <a href="tel:+10000000000" class="comm-link">[ COMMS // +1 000-000-0000 ]</a>
            </div>

          </section>

          {/* RIGHT PANE: TRANSMISSION FORM */}
          <section class="pane-transmission">
            <div class="glass-form-panel">
              <div class="form-header">
                <h2>DATA TRANSMISSION</h2>
                <div class="secure-badge">
                  <span class="blinker secure"></span> 256-BIT ENCRYPTED
                </div>
              </div>

              <form class="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-recaptcha="true" onSubmit={this.handleSubmit}>
                <input type="hidden" name="form-name" value="contact" />
                
                <div class="input-group">
                  <label>OPERATOR NAME</label>
                  <input type="text" name="name" value={this.formName} onInput={(e: any) => this.formName = e.target.value} required placeholder="John Doe" />
                </div>

                <div class="input-group">
                  <label>RETURN COMM-LINK (EMAIL)</label>
                  <input type="email" name="email" value={this.formEmail} onInput={(e: any) => this.formEmail = e.target.value} required placeholder="john@company.com" />
                </div>

                <div class="input-group">
                  <label>CURRENT NODE (WEBSITE URL) <span class="optional">- OPTIONAL</span></label>
                  <input type="url" name="url" value={this.formSite} onInput={(e: any) => this.formSite = e.target.value} placeholder="https://" />
                </div>

                <div class="input-group">
                  <label class="radio-label">
                    ENQUIRY TRACK 
                    <span class="tooltip-icon" title="Anything that isn't strictly Shopify e-commerce falls under the AI track.">?</span>
                  </label>
                  <div class="radio-group">
                    <label class={`radio-btn ${this.formType === 'ai' ? 'active' : ''}`}>
                      <input type="radio" name="track" value="ai" checked={this.formType === 'ai'} onChange={() => this.formType = 'ai'} />
                      <span class="radio-visual"></span>
                      INTELLIGENT SYSTEMS (AI)
                    </label>
                    <label class={`radio-btn ${this.formType === 'shopify' ? 'active' : ''}`}>
                      <input type="radio" name="track" value="shopify" checked={this.formType === 'shopify'} onChange={() => this.formType = 'shopify'} />
                      <span class="radio-visual"></span>
                      COMMERCE SYSTEMS (SHOPIFY)
                    </label>
                  </div>
                </div>

                <div class="input-group">
                  <label>TRANSMISSION PAYLOAD</label>
                  <textarea name="message" rows={5} value={this.formMessage} onInput={(e: any) => this.formMessage = e.target.value} required placeholder="Describe your objective..."></textarea>
                </div>
                
                <div data-netlify-recaptcha="true" class="recaptcha-wrapper"></div>

                <button type="submit" class="transmit-btn" disabled={this.isSubmitting}>
                  {this.isSubmitting ? '[ INITIATING HANDSHAKE... ]' : '[ TRANSMIT DATA ]'}
                </button>
              </form>
            </div>
          </section>

        </main>
      </div>
    );
  }
}
