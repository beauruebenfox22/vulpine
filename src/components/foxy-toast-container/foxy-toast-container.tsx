import { Component, h, State, Listen } from '@stencil/core';
import { ToastEventDetail } from '../../utils/toast';

@Component({
  tag: 'foxy-toast-container',
  styleUrl: 'foxy-toast-container.css',
  shadow: false,
})
export class FoxyToastContainer {
  @State() toasts: ToastEventDetail[] = [];

  @Listen('foxy-toast-triggered', { target: 'window' })
  handleToastTriggered(event: CustomEvent<ToastEventDetail>) {
    this.toasts = [...this.toasts, event.detail];
  }

  @Listen('foxy-toast-dismissed')
  handleToastDismissed(event: CustomEvent<string>) {
    this.toasts = this.toasts.filter(toast => toast.id !== event.detail);
  }

  render() {
    return (
      <div class="toast-stack-wrapper">
        {this.toasts.map(toast => (
          <foxy-toast
            key={toast.id}
            toastId={toast.id}
            message={toast.message}
            type={toast.type}
          ></foxy-toast>
        ))}
      </div>
    );
  }
}
