import { Component, State, h } from '@stencil/core';
import { Router } from "../../";
import { Route, match } from "stencil-router-v2";

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false,
})
export class AppRoot {
  @State() menuOpen: boolean = false;

  private toggleMenu = () => {
    this.menuOpen = !this.menuOpen;
  };

  private handleBrandClick = () => {
    Router.push("/");
    this.menuOpen = false;
  };

  private closeMenu = () => {
    this.menuOpen = false;
  };

  render() {
    return (
      <div class={{ 'vulpine-app': true, 'menu-open': this.menuOpen }}>

        {/* BRAND OVERLAY HEADER */}
        <header class="vulpine-nav-header">
          <div class="nav-brand" onClick={this.handleBrandClick} role="button" tabIndex={0}>
            <foxy-logo size="small"></foxy-logo>
            <span class="brand-text">VULPINE</span>
          </div>

          {/* SEXY ANIMATED HAMBURGER ICON */}
          <button
            class={{ 'foxy-burger-btn': true, 'is-open': this.menuOpen }}
            onClick={this.toggleMenu}
            aria-label="Toggle Menu"
            aria-expanded={this.menuOpen ? 'true' : 'false'}
          >
            <div class="burger-circle-glow"></div>
            <div class="burger-inner">
              <span class="burger-line line-1"></span>
              <span class="burger-line line-2"></span>
              <span class="burger-line line-3"></span>
            </div>
          </button>
        </header>

        {/* IMMERSIVE FULL-PAGE TAKEOVER NAVIGATION DIRECTORY */}
        <foxy-nav active={this.menuOpen} onMenuClose={this.closeMenu}></foxy-nav>

        {/* MAIN ROUTER CONTENT VIEWPORT */}
        <main class="vulpine-main">
          <Router.Switch>
            <Route path="/">
              <app-home />
            </Route>
            <Route path="/work-with-us">
              <app-work-with-us />
            </Route>
            <Route
              path={match("/profile/:name")}
              render={({ name }) => <app-profile name={name} />}
            />
            <Route
              path={match("/services/:type")}
              render={({ type }) => <app-services serviceType={type as any} />}
            />
          </Router.Switch>
        </main>

        <footer class="foxy-footer">
          <p class="foxy-footer-text">
            Copyright © 2026 logic layer or Shopify complexity. All rights reserved.
          </p>
        </footer>

      </div>
    );
  }
}
