import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'foxy-logo',
  styleUrl: 'foxy-logo.css',
  shadow: false,
})
export class FoxyLogo {
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  render() {
    return (
      <div class={`foxy-logo-container size-${this.size}`}>
        <div class="foxy-logo-glow"></div>
        <img
          src="/assets/logo.png"
          alt="Volpine Logo"
          class="foxy-logo-image"
          draggable={false}
        />
      </div>
    );
  }
}
