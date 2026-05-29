import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { triggerToast } from '../../utils/toast';

@Component({
  tag: 'foxy-modal',
  styleUrl: 'foxy-modal.css',
  shadow: false,
})
export class FoxyModal {
  @Prop() isOpen: boolean = false;
  @Prop() modalTitle: string = '';
  @Prop() aiOutput: string = '';
  @Event() modalClose: EventEmitter<void>;

  private handleClose = () => {
    this.modalClose.emit();
  }

  private handleLeadSubmit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString()
    })
    .then(() => {
       this.handleClose();
       triggerToast('Estimate secured and sent to Vulpine successfully!', 'success');
    })
    .catch((error) => {
       triggerToast(error.toString(), 'alert');
    });
  }

  // Prevent clicks inside the modal from bubbling up to the overlay
  private stopPropagation = (e: Event) => {
    e.stopPropagation();
  }

  render() {
    return (
      <div class={{ 'foxy-modal-overlay': true, 'is-open': this.isOpen }} onClick={this.handleClose}>
        <div class="foxy-modal-container" onClick={this.stopPropagation}>
          <div class="foxy-modal-header">
            <h4>{this.modalTitle}</h4>
            <button class="foxy-modal-close" onClick={this.handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="foxy-modal-content">
            <slot></slot>
            <form class="capture-form" name="estimate-lead" method="POST" data-netlify="true" data-netlify-recaptcha="true" onSubmit={this.handleLeadSubmit}>
              <input type="hidden" name="form-name" value="estimate-lead" />
              <textarea name="ai-output" style={{ display: 'none' }} value={this.aiOutput}></textarea>
              
              <div class="capture-form-group">
                <label htmlFor="name">IDENTIFIER (NAME)</label>
                <input type="text" id="name" name="name" required placeholder="Enter your name" autocomplete="name" tabIndex={1} />
              </div>
              <div class="capture-form-group">
                <label htmlFor="email">CONTACT LINK (EMAIL)</label>
                <input type="email" id="email" name="email" required placeholder="Enter your email address" autocomplete="email" tabIndex={2} />
              </div>
              
              <div data-netlify-recaptcha="true" class="recaptcha-wrapper" style={{ marginTop: '1rem' }}></div>

              <button type="submit" class="capture-submit-btn">INITIATE HANDSHAKE</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
