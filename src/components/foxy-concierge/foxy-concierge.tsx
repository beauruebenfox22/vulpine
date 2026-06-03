import { Component, Prop, State, Event, EventEmitter, h, Watch, Build } from '@stencil/core';
import { triggerToast } from '../../utils/toast';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isSlot?: boolean;
}

@Component({
  tag: 'foxy-concierge',
  styleUrl: 'foxy-concierge.css',
  shadow: false,
})
export class FoxyConcierge {
  @Prop() isOpen: boolean = false;
  @Event() closeConcierge: EventEmitter<void>;

  @Watch('isOpen')
  handleOpenChange(newValue: boolean) {
    if (typeof document !== 'undefined') {
      if (newValue) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  @State() isLocked: boolean = false;
  @State() bookedDate: string = '';
  @State() bookedTime: string = '';

  @State() chatHistory: ChatMessage[] = [];
  @State() isThinking: boolean = false;
  @State() isBookingComplete: boolean = false;
  @State() chatInput: string = '';

  @Watch('isOpen')
  watchHandler(newValue: boolean) {
    if (Build.isBrowser) {
      if (newValue) {
        document.body.style.overflow = 'hidden';
        this.checkSessionStatus();
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  componentWillLoad() {
    this.checkSessionStatus();
  }

  private checkSessionStatus() {
    if (Build.isBrowser) {
      const locked = sessionStorage.getItem('vulpine_booking_locked');
      const bDate = sessionStorage.getItem('vulpine_booked_date');
      const bTime = sessionStorage.getItem('vulpine_booked_time');
      
      if (locked === 'true') {
        this.isLocked = true;
        this.bookedDate = bDate || '';
        this.bookedTime = bTime || '';
      } else {
        this.fetchAvailability();
      }
    }
  }

  private async fetchAvailability() {
    this.isThinking = true;
    this.chatHistory = [{ id: 'loading', sender: 'ai', text: 'Scanning calendar...' }];
    
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CHECK_AVAILABILITY' })
      });
      
      const data = await res.json();
      this.chatHistory = []; // clear loading

      const rawText = data.text || '';
      const newMessages: ChatMessage[] = [{ id: `ai-text-${Date.now()}`, sender: 'ai' as 'ai', text: rawText, isSlot: false }];
      this.chatHistory = [...this.chatHistory, ...newMessages];
    } catch (e) {
      console.error(e);
      this.chatHistory = [{ id: 'err', sender: 'ai' as 'ai', text: 'System Error: Unable to reach scheduling core.', isSlot: false }];
    }
    
    this.isThinking = false;
  }

  private handleClose = () => {
    this.closeConcierge.emit();
  };

  private handleSlotClick = (text: string) => {
    if (this.isLocked || this.isThinking) return;

    // Send the slot text as a chat message
    this.chatInput = text;
    this.handleChatSubmit();
  };

  private async handleChatSubmit(e?: Event) {
    if (e) e.preventDefault();
    if (!this.chatInput.trim() || this.isThinking) return;

    const userText = this.chatInput;
    this.chatInput = '';
    this.isThinking = true;

    this.chatHistory = [
      ...this.chatHistory,
      { id: Date.now().toString(), sender: 'user', text: userText }
    ];

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHAT',
          history: this.chatHistory.map(m => ({
            role: m.sender === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
          })),
          estimateContext: typeof window !== 'undefined' ? sessionStorage.getItem('vulpine_estimate_result') : null
        })
      });

      if (!res.ok) throw new Error("Failed to chat");
      
      const data = await res.json();
      
      this.chatHistory = [
        ...this.chatHistory,
        { id: Date.now().toString(), sender: 'ai', text: data.text }
      ];

      // Detect if booking was confirmed by the backend
      if (data.booked) {
        this.bookedDate = data.date;
        this.bookedTime = data.time;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('vulpine_booking_locked', 'true');
          sessionStorage.setItem('vulpine_booked_date', data.date);
          sessionStorage.setItem('vulpine_booked_time', data.time);
        }
        
        triggerToast('Transmission Secured to Google Calendar', 'success');
        this.isBookingComplete = true;
      }

    } catch (err) {
      console.error(err);
      triggerToast('Transmission Failed', 'alert');
      this.chatHistory = [
        ...this.chatHistory,
        { id: Date.now().toString(), sender: 'ai', text: 'Error: Failed to process message. Please try again.' }
      ];
    }
    
    this.isThinking = false;
  };

  // (Removed handleDetailsSubmit remainder)

  render() {
    const overlayClasses = {
      'concierge-overlay': true,
      'is-open': this.isOpen
    };

    return (
      <div class={overlayClasses}>
        <div class="concierge-container">
          
          {/* HEADER */}
          <div class="concierge-header">
            <div class="header-title">
              <div class="pulse-dot"></div>
              <h3>VULPINE_CONCIERGE</h3>
            </div>
            <button class="close-btn" onClick={this.handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* TWO-PANE LAYOUT */}
          <div class="concierge-body">
            
            {/* LEFT PANE: CHAT UI */}
            <div class="chat-pane">
              {this.isLocked ? (
                <div class="locked-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--red-core)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <h4>TRANSMISSION SECURED</h4>
                  <p>Your briefing is locked in for <strong>{this.bookedDate}</strong> at <strong>{this.bookedTime}</strong>.</p>
                  <p>Please check your inbox for the calendar invite.</p>
                </div>
              ) : (
                <div class="chat-wrapper">
                  <div class="chat-history">
                    {this.chatHistory.map(msg => {
                      // Inline slot rendering for AI messages
                      if (msg.sender === 'ai' && msg.text.includes('[SLOT:')) {
                        const parts = msg.text.split(/(\[SLOT:.*?\])/);
                        return (
                          <div class={`msg-bubble ${msg.sender}`}>
                            <span class="msg-sender">VULPINE</span>
                            <div class="msg-content">
                              {parts.filter((p: string) => p.trim() !== '').map((p: string) => {
                                if (p.startsWith('[SLOT:')) {
                                  return <div class="msg-slot" onClick={() => this.handleSlotClick(p)}>{p}</div>;
                                }
                                return <span>{p}</span>;
                              })}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div class={`msg-bubble ${msg.sender}`}>
                          <span class="msg-sender">{msg.sender === 'ai' ? 'VULPINE' : 'YOU'}</span>
                          <p>{msg.text}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* INPUT AREA */}
                  {!this.isBookingComplete && (
                    <div class="chat-input-area">
                      <form class="chat-input-form" onSubmit={(e) => this.handleChatSubmit(e)}>
                        <input 
                          type="text" 
                          placeholder={this.isThinking ? "VULPINE IS PROCESSING..." : "REPLY TO VULPINE..."} 
                          value={this.chatInput}
                          disabled={this.isThinking}
                          onInput={(e: any) => this.chatInput = e.target.value}
                        />
                        <button type="submit" disabled={this.isThinking || !this.chatInput.trim()}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT PANE: MANIFEST */}
            <div class="manifest-pane">
              <h4 class="manifest-title">BOOKING MANIFEST</h4>
              <div class="manifest-list">
                
                <div class="manifest-item">
                  <span class="manifest-label">STATUS</span>
                  <span class={`manifest-value ${this.isLocked ? 'status-locked' : 'status-pending'}`}>
                    {this.isLocked ? 'LOCKED' : 'PENDING'}
                  </span>
                </div>

                <div class="manifest-item">
                  <span class="manifest-label">DATE</span>
                  <span class="manifest-value">{this.bookedDate || '[ PENDING ]'}</span>
                </div>

                <div class="manifest-item">
                  <span class="manifest-label">TIME</span>
                  <span class="manifest-value">{this.bookedTime || '[ PENDING ]'}</span>
                </div>
              </div>

              <div class="manifest-decoration"></div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
