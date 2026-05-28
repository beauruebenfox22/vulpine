import { Component, h, Prop, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'foxy-toast',
  styleUrl: 'foxy-toast.css',
  shadow: false,
})
export class FoxyToast {
  @Prop() toastId: string;
  @Prop() message: string;
  @Prop() type: 'alert' | 'success' | 'info';

  @Event({ bubbles: true, composed: true, eventName: 'foxy-toast-dismissed' }) dismissed: EventEmitter<string>;

  @State() isClosing: boolean = false;
  private timeoutId: any;
  private remainingTime: number = 5000;
  private startTime: number;

  // Tiny base64 notification "pop" sound
  private sound = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

  componentDidLoad() {
    // Attempt to play sound (may be blocked by browser autoplay policies without user interaction)
    this.sound.volume = 0.5;
    this.sound.play().catch(() => {});

    this.startTimer();
  }

  disconnectedCallback() {
    this.clearTimer();
  }

  private startTimer = () => {
    // Only alert types are non-dismissable by default? 
    // Wait, requirement: "All dismissable aside from alert, 5 second dispaly time". 
    // So alert also has 5s display time? Or alert stays forever until... wait, "dismissable" usually means user can click an X.
    if (this.type === 'alert') {
      // Actually if alert is not dismissible by user, does it auto-dismiss? Yes, 5 sec.
    }
    
    this.startTime = Date.now();
    this.timeoutId = setTimeout(() => {
      this.triggerClose();
    }, this.remainingTime);
  };

  private clearTimer = () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  };

  private handleMouseEnter = () => {
    this.clearTimer();
    this.remainingTime -= (Date.now() - this.startTime);
  };

  private handleMouseLeave = () => {
    this.startTimer();
  };

  private triggerClose = () => {
    this.isClosing = true;
    // Wait for animation to finish before removing from DOM
    setTimeout(() => {
      this.dismissed.emit(this.toastId);
    }, 400); 
  };

  render() {
    const isAlert = this.type === 'alert';
    
    return (
      <div 
        class={{
          'toast-card': true,
          [`toast-${this.type}`]: true,
          'is-closing': this.isClosing
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div class="toast-content">
          <span class="toast-icon">
            {this.type === 'success' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            {this.type === 'alert' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
            {this.type === 'info' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
          </span>
          <span class="toast-message">{this.message}</span>
        </div>
        
        {!isAlert && (
          <button class="toast-close-btn" onClick={this.triggerClose} aria-label="Dismiss notification">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>
    );
  }
}
