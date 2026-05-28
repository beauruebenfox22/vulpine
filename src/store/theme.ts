import { createStore } from '@stencil/store';

// Check sessionStorage for existing preference, default to 'dark'
const initialMode = typeof window !== 'undefined' && sessionStorage.getItem('vulpine-theme') === 'light' ? 'light' : 'dark';

const { state, onChange } = createStore({
  mode: initialMode
});

// Watch for changes and update the DOM and sessionStorage
onChange('mode', value => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vulpine-theme', value);
    
    // Toggle the theme class on the body
    if (value === 'light') {
      document.body.classList.add('vulpine-light');
    } else {
      document.body.classList.remove('vulpine-light');
    }
  }
});

// Export a helper to explicitly initialize on load
export const initThemeStore = () => {
  if (typeof window !== 'undefined' && state.mode === 'light') {
    document.body.classList.add('vulpine-light');
  }
};

export default state;
