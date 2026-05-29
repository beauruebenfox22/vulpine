import { Component, State, h } from '@stencil/core';

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

  componentWillLoad() {
    if (typeof window !== 'undefined') {
      this.isLimitReached = sessionStorage.getItem('vulpine_estimate_used') === 'true';
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
        this.isLimitReached = true;
      }
    } catch (err) {
      console.error(err);
      this.error = "Our AI system is currently resting. Please try again or contact us directly.";
    } finally {
      this.isEstimating = false;
    }
  }

  // Parse basic markdown (bold, lists, headings) to keep it simple without adding heavy dependencies
  private formatEstimateText(text: string) {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '') return <br key={i} />;
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
          <h3>AI ESTIMATE ENGINE</h3>
        </div>

        <p class="estimate-instructions">
          Describe your problem, idea, or desired service below. Our AI uses current Vulpine metrics to provide an instant high-level cost and time scope.
        </p>

        <textarea
          class="estimate-input"
          placeholder="e.g. I need a custom Shopify storefront with an AI product recommendation engine integrated via API..."
          value={this.projectDescription}
          onInput={this.handleInput}
          disabled={this.isEstimating || this.isLimitReached}
        ></textarea>

        <button
          class={{ 'estimate-submit-btn': true, 'is-loading': this.isEstimating, 'is-locked': this.isLimitReached }}
          onClick={() => this.generateEstimate()}
          disabled={this.isEstimating || this.projectDescription.trim().length === 0 || this.isLimitReached}
        >
          {this.isLimitReached ? '[ SYSTEM LIMIT REACHED. CONTACT OPERATOR. ]' : (this.isEstimating ? 'ANALYZING SCOPE...' : 'GENERATE ESTIMATE')}
        </button>

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
      </div>
    );
  }
}
