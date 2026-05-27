import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'foxy-hero',
  styleUrl: 'foxy-hero.css',
  shadow: false,
})
export class FoxyHero {
  @Prop() headline: string;
  @Prop() subheadline: string;

  render() {
    return (
      <header class="mission-header">
        <div class="header-content">
          <h1 class="mission-title">{this.headline}</h1>
          {this.subheadline && (
            <h2 class="mission-subtitle">{this.subheadline}</h2>
          )}
        </div>
        <div class="header-scanline"></div>
      </header>
    );
  }
}
