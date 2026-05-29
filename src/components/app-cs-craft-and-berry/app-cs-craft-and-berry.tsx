import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-cs-craft-and-berry',
  styleUrl: 'app-cs-craft-and-berry.css',
  shadow: false,
})
export class AppCsCraftAndBerry {
  render() {
    return (
      <div class="case-study-detail">

        {/* HERO SECTION */}
        <header class="csd-hero">
          <div class="csd-hero-content">
            <h1 class="csd-hero-title">CRAFT & BERRY</h1>
            <div class="csd-metadata-bar">
              <span class="meta-item"><span class="meta-label">TYPE:</span> SHOPIFY RE-THEME & POS</span>
              <span class="meta-item"><span class="meta-label">COMPLEXITY:</span> LOW-FRICTION / RAPID DEPLOY</span>
              <span class="meta-item"><span class="meta-label">OWNER:</span> MARK</span>
            </div>

            <div class="csd-tags-terminal">
              <div class="terminal-header">
                <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
                <span class="terminal-title">~/vulpine/stack</span>
              </div>
              <div class="terminal-body">
                <code> load_modules ["Shopify", "Stencil", "Agentic Development", "Custom Theme", "UI/UX Design"]</code>
                <code class="success"> ALL MODULES LOADED SUCCESSFULLY.</code>
              </div>
            </div>
          </div>
        </header>

        {/* THE CRUCIBLE (CHALLENGE VS DELIVERY) */}
        <section class="csd-crucible">
          <div class="crucible-grid">
            <div class="crucible-card challenge-card">
              <div class="card-glitch-border"></div>
              <h3 class="crucible-heading">[ THE FRICTION ]</h3>
              <ul class="crucible-list">
                <li><span class="bullet">×</span> Fragmented technical literacy across the core team.</li>
                <li><span class="bullet">×</span> Complex Point of Sale (POS) integrations required.</li>
                <li><span class="bullet">×</span> Urgent deployment cycles demanded partial, iterative releases over standard full-launches.</li>
                <li><span class="bullet">×</span> Strict 16-hour deadline for initial Christmas rollout.</li>
              </ul>
            </div>

            <div class="crucible-card delivery-card">
              <div class="card-glitch-border"></div>
              <h3 class="crucible-heading">[ THE ENGINEERED OUTCOME ]</h3>
              <ul class="crucible-list">
                <li><span class="bullet success">✓</span> Christmas deadline hit precisely within the 16-hour constraint.</li>
                <li><span class="bullet success">✓</span> Delivered a standout, highly performant new theme architecture.</li>
                <li><span class="bullet success">✓</span> Achieved an 83% increase in conversion rates.</li>
                <li><span class="bullet success">✓</span> Drastically reduced overhead costs by eliminating redundant, heavy apps.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* TECHNICAL SPOTLIGHT */}
        <section class="csd-tech-spotlight">
          <div class="spotlight-content">
            <h2 class="spotlight-title">ARCHITECTURE SPOTLIGHT</h2>
            <p class="spotlight-desc">
              We engineered a fully configurable "New In" carousel utilizing Stencil's shadow DOM bridging with the Shopify Storefront API.
              Additionally, we built a highly customized, event-driven Wishlist component backed by a global toast notification system, completely eliminating the need for third-party subscriptions.
            </p>
          </div>

          {/* CUSTOM CSS DOM TREE ARTICULATION */}
          <div class="spotlight-graphic">
            <div class="css-tree-container">
              <div class="tree-node root">
                <span class="node-tag">SHOPIFY STOREFRONT API</span>
              </div>
              <div class="tree-branches">
                <div class="branch-path"></div>
                <div class="branch-group">
                  <div class="tree-node child component">
                    <span class="node-tag">&lt;foxy-carousel /&gt;</span>
                    <span class="node-meta">Dynamic Product Feed</span>
                  </div>
                  <div class="tree-node child component">
                    <span class="node-tag">&lt;foxy-wishlist /&gt;</span>
                    <span class="node-meta">Event-Driven State</span>
                  </div>
                </div>
              </div>
              <div class="tree-branches sub">
                <div class="branch-path"></div>
                <div class="tree-node child child-deep service">
                  <span class="node-tag">Global Toast Bus</span>
                  <span class="node-meta">pub/sub events</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE HUMAN ELEMENT */}
        <section class="csd-human-element">
          <div class="human-grid">
            <div class="human-testimonial">
              <div class="stars">★★★★★</div>
              <blockquote class="review-quote">
                "[PLACEHOLDER CONTENT] The technical intervention completely transformed our online presence.
                The speed is unmatched, and the custom wishlist functionality drives our retention perfectly."
              </blockquote>
              <div class="review-author">
                <span class="author-name">MARK</span>
                <span class="author-title">OWNER, CRAFT & BERRY</span>
              </div>
            </div>

            <div class="human-context">
              <h3 class="context-heading">THE PARTNERSHIP</h3>
              <p class="context-body">
                Mark is the ideal client—a local business owner unafraid to challenge convention and try new approaches.
                What started as a frantic 16-hour sprint for a Christmas deadline evolved into a robust, ongoing technical support contract.
                Through transparency and rapid iteration, we built immense trust and a genuine friendship.
              </p>
              <div class="context-badge">ONGOING RETAINER ACTIVE</div>
            </div>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section class="cs-cta">
          <h2>READY TO ENGINEER YOUR OUTCOME?</h2>
          <foxy-cta url="/contact">INITIATE ESCALATION</foxy-cta>
        </section>

      </div>
    );
  }
}
