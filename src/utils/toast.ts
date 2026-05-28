export type ToastType = 'alert' | 'success' | 'info';

export interface ToastEventDetail {
  id: string;
  message: string;
  type: ToastType;
}

/**
 * Triggers a global toast notification that can be intercepted by the foxy-toast-container.
 */
export const triggerToast = (message: string, type: ToastType = 'info') => {
  if (typeof window !== 'undefined') {
    const detail: ToastEventDetail = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type
    };
    
    const event = new CustomEvent('foxy-toast-triggered', {
      detail,
      bubbles: true,
      composed: true
    });
    
    window.dispatchEvent(event);
  }
};
