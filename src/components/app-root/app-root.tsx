import { Component, State, h } from '@stencil/core';
import { Router } from "../../";
import { Route, match } from "stencil-router-v2";
import { initThemeStore } from '../../store/theme';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false,
})
export class AppRoot {
  @State() menuOpen: boolean = false;
  @State() drilldownActive: boolean = false;

  componentWillLoad() {
    initThemeStore();
  }

  private handleDrilldownChange = (e: CustomEvent<boolean>) => {
    this.drilldownActive = e.detail;
  };

  private toggleMenu = () => {
    if (this.drilldownActive) {
      // If we're in a drilldown, clicking the "X" acts as a back button
      const navEl = document.querySelector('foxy-nav') as any;
      if (navEl && typeof navEl.resetDrilldown === 'function') {
        navEl.resetDrilldown();
      }
    } else {
      this.menuOpen = !this.menuOpen;
    }
  };

  private handleBrandClick = () => {
    Router.push("/");
    this.menuOpen = false;
  };

  private closeMenu = () => {
    this.menuOpen = false;
    this.drilldownActive = false; // Reset drilldown state when completely closing
  };

  render() {
    const isShopifyRoute = Router.activePath && Router.activePath.includes('/services/shopify');

    return (
      <div class={{ 'vulpine-app': true, 'menu-open': this.menuOpen, 'theme-shopify': isShopifyRoute }}>

        {/* BRAND OVERLAY HEADER */}
        <header class="vulpine-nav-header">
          <div class="nav-brand" onClick={this.handleBrandClick} role="button" tabIndex={0}>
            <foxy-logo size="small"></foxy-logo>
            <span class="brand-text">VULPINE</span>
          </div>

          <div class="nav-center-action">
            <foxy-business-card></foxy-business-card>
          </div>

          <div class="nav-actions">
            {/* SEXY ANIMATED HAMBURGER ICON */}
            <button
              class={{ 
                'foxy-burger-btn': true, 
                'is-open': this.menuOpen && !this.drilldownActive,
                'is-back': this.drilldownActive 
              }}
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
          </div>
        </header>

        {/* IMMERSIVE FULL-PAGE TAKEOVER NAVIGATION DIRECTORY */}
        <foxy-nav 
          active={this.menuOpen} 
          onMenuClose={this.closeMenu}
          onDrilldownChange={this.handleDrilldownChange}
        ></foxy-nav>

        {/* MAIN ROUTER CONTENT VIEWPORT */}
        <main class="vulpine-main">
          <Router.Switch>
            <Route path="/">
              <app-home />
            </Route>
            <Route path="/about">
              <app-about />
            </Route>
            <Route path="/work-with-us">
              <app-work-with-us />
            </Route>
            <Route path="/contact">
              <app-contact />
            </Route>
            <Route
              path={match("/profile/:name")}
              render={({ name }) => <app-profile name={name} />}
            />
            <Route path="/blog">
              <app-blog />
            </Route>
            <Route
              path={match("/blog/:slug")}
              render={({ slug }) => <app-blog initialSlug={slug} />}
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

        {/* GLOBAL NOTIFICATION SYSTEM */}
        <foxy-toast-container></foxy-toast-container>

      </div>
    );
  }
}
