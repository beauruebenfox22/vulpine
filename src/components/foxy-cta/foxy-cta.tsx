import { Component, Prop, h } from '@stencil/core';
import { Router } from '../../';

@Component({
  tag: 'foxy-cta',
  styleUrl: 'foxy-cta.css',
  shadow: false,
})
export class FoxyCta {
  @Prop() url: string = '#';

  private handleClick = (e: Event) => {
    // If it's a valid internal route, we prevent default and use Router.push
    // If it's an external link, we can just let the anchor behave normally, but for now we assume internal.
    if (this.url && this.url.startsWith('/')) {
      e.preventDefault();
      Router.push(this.url);
    }
  };

  render() {
    return (
      <a href={this.url} onClick={this.handleClick} class="foxy-cta">
        <span class="cta-bracket left">[</span>
        <div class="cta-core">
          <span class="cta-text"><slot></slot></span>
        </div>
        <span class="cta-bracket right">]</span>
        <div class="cta-laser-line"></div>
      </a>
    );
  }
}
