import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-work-with-us',
  styleUrl: 'app-work-with-us.css',
  shadow: false,
})
export class AppWorkWithUs {
  render() {
    return (
      <div class="mission-control-wrapper">
        
        {/* Reusable Hero Component */}
        <foxy-hero 
          headline="WORK WITH US"
          subheadline="We operate where logic layers meet commerce. Fully embedded, specialized remote, or on-site accelerators."
        ></foxy-hero>

        {/* Dashboard Grid */}
        <main class="dashboard-grid">
          
          {/* Widget 1: Vectors of Engagement */}
          <article class="dashboard-widget widget-vectors">
            <div class="widget-header">
              <span class="widget-id">SYS.01</span>
              <h3>VECTORS OF ENGAGEMENT</h3>
            </div>
            <div class="widget-body">
              <div class="vector-animation">
                {/* Rotating SVG Nodes */}
                <svg viewBox="0 0 100 100" class="node-svg">
                  <circle cx="50" cy="50" r="40" class="node-ring" />
                  <circle cx="50" cy="10" r="4" class="node-point" />
                  <circle cx="85" cy="70" r="4" class="node-point" />
                  <circle cx="15" cy="70" r="4" class="node-point" />
                  <line x1="50" y1="50" x2="50" y2="10" class="node-link" />
                  <line x1="50" y1="50" x2="85" y2="70" class="node-link" />
                  <line x1="50" y1="50" x2="15" y2="70" class="node-link" />
                  <circle cx="50" cy="50" r="8" class="node-core" />
                </svg>
              </div>
              <ul class="data-list">
                <li>
                  <strong>Embedded:</strong> Integrating directly into your internal teams and repos.
                </li>
                <li>
                  <strong>Remote:</strong> Project-based, independent, high-polish delivery.
                </li>
                <li>
                  <strong>On-Site:</strong> Intensive, unblocking, highly collaborative workshops.
                </li>
              </ul>
            </div>
          </article>

          {/* Widget 2: Pricing Models */}
          <article class="dashboard-widget widget-pricing">
            <div class="widget-header">
              <span class="widget-id">SYS.02</span>
              <h3>COMMERCE MODELS</h3>
            </div>
            <div class="widget-body">
              <div class="pricing-animation">
                <div class="bar-chart">
                  <div class="bar" style={{"--fill": "40%"}}></div>
                  <div class="bar" style={{"--fill": "40%"}}></div>
                  <div class="bar" style={{"--fill": "20%"}}></div>
                </div>
              </div>
              <ul class="data-list">
                <li>
                  <strong>Retainer:</strong> Ongoing, dedicated engineering bandwidth.
                </li>
                <li>
                  <strong>Project Cost:</strong> Phased deployment (40% upfront, 40% mid, 20% handover).
                </li>
                <li>
                  <strong>Pay-as-you-go:</strong> Flexible day rate based on complexity.
                </li>
              </ul>
            </div>
          </article>

          {/* Widget 3: Target Demographics */}
          <article class="dashboard-widget widget-demographics">
            <div class="widget-header">
              <span class="widget-id">SYS.03</span>
              <h3>TARGET PROFILES</h3>
            </div>
            <div class="widget-body">
              <div class="radar-animation">
                <svg viewBox="0 0 100 100" class="radar-svg">
                  <circle cx="50" cy="50" r="45" class="radar-grid" />
                  <circle cx="50" cy="50" r="30" class="radar-grid" />
                  <circle cx="50" cy="50" r="15" class="radar-grid" />
                  <line x1="50" y1="0" x2="50" y2="100" class="radar-axis" />
                  <line x1="0" y1="50" x2="100" y2="50" class="radar-axis" />
                  <path d="M 50 50 L 95 50 A 45 45 0 0 0 50 5 L 50 50" class="radar-sweep" />
                  <circle cx="70" cy="30" r="3" class="radar-blip" />
                  <circle cx="35" cy="65" r="3" class="radar-blip" style={{"animation-delay": "1s"}} />
                </svg>
              </div>
              <p class="widget-text">
                We partner with upstarts, SME merchants, and bold business owners. We want clients willing to take risks, break conventions, and innovate relentlessly.
              </p>
            </div>
          </article>

          {/* Widget 4: The Vulpine Edge */}
          <article class="dashboard-widget widget-edge">
            <div class="widget-header">
              <span class="widget-id">SYS.04</span>
              <h3>THE VULPINE EDGE</h3>
            </div>
            <div class="widget-body">
              <div class="core-animation">
                <div class="hex-core">
                   <div class="hex-pulse"></div>
                </div>
              </div>
              <p class="widget-text">
                We specialize in the unconventional. While others build bloat, we use narrow, specialized tech like Stencil and Gemini to defy industry norms. AI-first, Client-first.
              </p>
            </div>
          </article>

          {/* Widget 5: AI Estimator (Master Console) */}
          <article class="dashboard-widget widget-estimator">
             <div class="widget-header">
              <span class="widget-id">SYS.MASTER</span>
              <h3>AI ESTIMATOR CONSOLE</h3>
            </div>
            <div class="widget-body estimator-body">
              <foxy-estimate></foxy-estimate>
            </div>
          </article>

        </main>
      </div>
    );
  }
}
