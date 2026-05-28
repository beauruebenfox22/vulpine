import { Component, h, State } from '@stencil/core';
import { triggerToast } from '../../utils/toast';

@Component({
  tag: 'foxy-business-card',
  styleUrl: 'foxy-business-card.css',
  shadow: false,
})
export class FoxyBusinessCard {
  @State() isHovered: boolean = false;

  private handleAction = async (action: string) => {
    if (action === 'ADD_TO_WALLET') {
      triggerToast('Wallet API integration pending Google Developer approval.', 'info');
      return;
    }

    if (action === 'SHARE_CARD') {
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: 'Vulpine Digital',
            text: 'Ruben Fox | Operator at Vulpine Digital',
            url: window.location.origin
          });
          triggerToast('Business card shared successfully.', 'success');
        } catch (err) {
          if (err.name !== 'AbortError') {
            // Fallback for failure (e.g. download vcf)
            this.downloadVCard();
          }
        }
      } else {
        // Fallback for unsupported browsers
        this.downloadVCard();
      }
    }
  };

  private downloadVCard = () => {
    if (typeof window !== 'undefined') {
      triggerToast('Downloading contact card...', 'success');
      const a = document.createElement('a');
      a.href = '/assets/vulpine.vcf';
      a.download = 'vulpine.vcf';
      a.click();
    }
  };

  render() {
    return (
      <div 
        class="card-wrapper"
        onMouseEnter={() => this.isHovered = true}
        onMouseLeave={() => this.isHovered = false}
      >
        <button class="btn-card">
          <span class="btn-text">GET CARD</span>
        </button>

        <div class={{ 'card-dropdown': true, 'is-open': this.isHovered }}>
          <button class="dropdown-btn" onClick={() => this.handleAction('SHARE_CARD')}>
            <span class="dropdown-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
            </span>
            SHARE CARD
          </button>
          
          <button class="dropdown-btn" onClick={() => this.handleAction('ADD_TO_WALLET')}>
            <span class="dropdown-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM1 10h22M15 14h.01"/></svg>
            </span>
            ADD CARD TO WALLET
          </button>
        </div>
      </div>
    );
  }
}
