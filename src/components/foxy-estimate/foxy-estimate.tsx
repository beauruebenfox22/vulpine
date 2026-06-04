import { Component, State, h } from '@stencil/core';
import { triggerToast } from '../../utils/toast';

declare var grecaptcha: any;

@Component({
  tag: 'foxy-estimate',
  styleUrl: 'foxy-estimate.css',
  shadow: false,
})

export class FoxyEstimate {
  @State() projectDescription: string = '';
  @State() isEstimating: boolean = false;
  @State() estimateResult: string | null = null;
  @State() error: string | null = null;
  @State() isLimitReached: boolean = false;
  @State() isModalOpen: boolean = false;

  componentWillLoad() {
    if (typeof window !== 'undefined') {
      this.isLimitReached = sessionStorage.getItem('vulpine_estimate_used') === 'true';
      const storedEstimate = sessionStorage.getItem('vulpine_estimate_result');
      if (storedEstimate) {
        this.estimateResult = storedEstimate;
      }
    }
  }

  private handleInput = (event: Event) => {
    this.projectDescription = (event.target as HTMLTextAreaElement).value;
  };

  private async generateEstimate() {
    if (!this.projectDescription.trim()) return;

    this.isEstimating = true;
    this.error = null;
    this.estimateResult = null;

    try {
      let token = '';
      if (typeof window !== 'undefined' && typeof grecaptcha !== 'undefined') {
        token = await grecaptcha.execute('6Le3mwItAAAAAEXoBh-VDpPS1OkKYCoihCmGl6O8', { action: 'estimate' });
      }

      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectDescription: this.projectDescription,
          token
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate estimate.');
      }

      this.estimateResult = data.estimate;

      // Enforce the frontend session lock after a successful estimate
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('vulpine_estimate_used', 'true');
        sessionStorage.setItem('vulpine_estimate_result', this.estimateResult);
        this.isLimitReached = true;
      }
      triggerToast('System scope generated successfully.', 'success');
    } catch (err) {
      console.error(err);
      this.error = "Our AI system is currently resting. Please try again or contact us directly.";
      triggerToast('AI Engine encountered an error.', 'alert');
    } finally {
      this.isEstimating = false;
    }
  }

  // Parse basic markdown (bold, lists, headings) to keep it simple without adding heavy dependencies
  private formatEstimateText(text: string) {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '') return <br key={i} />;
      if (trimmed.includes('[Initiate Vulpine Concierge](foxy://open-concierge)')) {
        const parts = trimmed.split('[Initiate Vulpine Concierge](foxy://open-concierge)');
        return (
          <p key={i}>
            <span innerHTML={parts[0].replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')} />
            <button class="estimate-submit-btn" onClick={() => {
              this.isModalOpen = false;
              if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('foxy-open-concierge'));
            }} style={{ marginTop: '1.5rem', display: 'block', width: '100%' }}>
              INITIATE VULPINE CONCIERGE
            </button>
            {parts[1] && <span innerHTML={parts[1].replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')} />}
          </p>
        );
      }
      if (trimmed.startsWith('### ')) {
        return <h5 key={i} class="result-subheading" innerHTML={trimmed.substring(4).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')} />;
      }
      if (trimmed.startsWith('## ')) {
        return <h4 key={i} class="result-subheading" innerHTML={trimmed.substring(3).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')} />;
      }
      if (trimmed.startsWith('# ')) {
        return <h3 key={i} class="result-subheading" innerHTML={trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')} />;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return <li key={i} innerHTML={trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')} />;
      }
      return <p key={i} innerHTML={trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')} />;
    });
  }

  render() {
    return (
      <div class="foxy-estimate-container">
        <div class="estimate-header">
          <div class="pulse-indicator"></div>
          <h3>VULPINE CORE: SALES & SCOPING</h3>
        </div>

        <p class="estimate-instructions">
          Drop your project specifications, codebase bottlenecks, or e-com goals below. Vulpine will immediately map your requirements against our internal engineering metrics to generate a precise, zero-fluff cost and timeline estimation. No discovery meetings required.
        </p>

        <textarea
          class="estimate-input"
          placeholder="e.g., I need a custom headless Shopify frontend with an edge-deployed multi-agent customer service ecosystem..."
          value={this.projectDescription}
          onInput={this.handleInput}
          disabled={this.isEstimating || this.isLimitReached}
        ></textarea>

        {this.isLimitReached ? (
          <button class="estimate-submit-btn" onClick={() => this.isModalOpen = true}>
            GET IN TOUCH
          </button>
        ) : (
          <button
            class={{ 'estimate-submit-btn': true, 'is-loading': this.isEstimating }}
            onClick={() => this.generateEstimate()}
            disabled={this.isEstimating || this.projectDescription.trim().length === 0}
          >
            {this.isEstimating ? 'ANALYZING SCOPE...' : 'RUN ESTIMATOR PROCESS'}
          </button>
        )}

        {this.error && (
          <div class="estimate-error">
            {this.error}
          </div>
        )}

        {this.estimateResult && (
          <div class="estimate-result-box">
            <h4 class="result-heading">SYSTEM OUTPUT</h4>
            <div class="result-content">
              {this.formatEstimateText(this.estimateResult)}
            </div>
          </div>
        )}

        <foxy-modal
          isOpen={this.isModalOpen}
          modalTitle="SECURE TRANSMISSION"
          aiOutput={this.estimateResult || ''}
          onModalClose={() => this.isModalOpen = false}
        >
        </foxy-modal>
      </div>
    );
  }
}
