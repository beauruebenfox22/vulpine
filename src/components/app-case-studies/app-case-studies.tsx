import { Component, h } from '@stencil/core';
import { Router } from '../../';

@Component({
  tag: 'app-case-studies',
  styleUrl: 'app-case-studies.css',
  shadow: false,
})
export class AppCaseStudies {
  private cases = [
    {
      id: 'craft-and-berry',
      title: 'Craft & Berry',
      category: 'Shopify Re-theme / Custom Dev',
      metrics: ['+83% Conversion', '16-Hour Deploy'],
      span: 'tall',
      link: '/case-studies/craft-and-berry',
      type: 'ecommerce'
    },
    {
      id: 'project-b',
      title: 'Aura Financial',
      category: 'Fintech / Agentic AI Dashboard',
      metrics: ['1M+ Transactions', 'SOC2 Compliant'],
      span: 'wide',
      link: null,
      type: 'ai'
    },
    {
      id: 'project-c',
      title: 'Vektor Automotive',
      category: 'E-commerce / Shopify Plus',
      metrics: ['$2.4M GMV Increase', 'Custom 3D Configurator'],
      span: 'normal',
      link: null,
      type: 'ecommerce'
    },
    {
      id: 'project-d',
      title: 'Lumina Health',
      category: 'LLM Diagnostics App',
      metrics: ['4.9★ App Store', 'HIPAA Certified'],
      span: 'normal',
      link: null,
      type: 'ai'
    }
  ];

  private handleProjectClick = (e: Event, link: string | null) => {
    e.preventDefault();
    if (link) {
      Router.push(link);
    } else {
      const toastEl = document.querySelector('foxy-toast-container') as any;
      if (toastEl && toastEl.addToast) {
        toastEl.addToast('Case study data is currently classified and undergoing redaction. Check back soon.', 'info');
      }
    }
  };

  private renderIcon(type: string) {
    if (type === 'ecommerce') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="url(#emeraldGradient)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="cs-vector-icon">
          <defs>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#27c93f" />
              <stop offset="100%" stop-color="#121214" />
            </linearGradient>
          </defs>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      );
    }
    
    // AI / Engineering Icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="url(#crimsonGradient)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="cs-vector-icon">
        <defs>
          <linearGradient id="crimsonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c8102e" />
            <stop offset="100%" stop-color="#121214" />
          </linearGradient>
        </defs>
        <rect x="16" y="16" width="6" height="6" rx="1"/>
        <rect x="2" y="16" width="6" height="6" rx="1"/>
        <rect x="9" y="2" width="6" height="6" rx="1"/>
        <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/>
        <path d="M12 12V8"/>
      </svg>
    );
  }

  render() {
    return (
      <div class="case-studies-page">
        
        <header class="cs-header">
          <div class="cs-header-content">
            <div class="cs-badge">[ PROOF OF CONCEPT ]</div>
            <h1 class="cs-title">ENGINEERED<br />OUTCOMES.</h1>
            <p class="cs-subtitle">
              We don't just build software. We engineer high-performance systems that drive measurable business outcomes.
              Explore our recent deployments below.
            </p>
          </div>
        </header>

        <section class="cs-grid-container">
          <div class="cs-masonry">
            {this.cases.map(project => (
              <a
                href={project.link || '#'}
                onClick={(e) => this.handleProjectClick(e, project.link)}
                class={`cs-card span-${project.span} type-${project.type}`}
              >
                <div class="cs-card-image">
                  {/* Procedural grid overlay for visual texture */}
                  <div class="css-grid-texture"></div>
                  
                  {/* Vector Graphic */}
                  <div class="cs-vector-container">
                    {this.renderIcon(project.type)}
                  </div>
                </div>
                <div class="cs-card-overlay">
                  <div class="cs-card-meta">
                    <span class="cs-category">{project.category}</span>
                    <h3 class="cs-project-title">{project.title}</h3>
                  </div>
                  <div class="cs-card-metrics">
                    {project.metrics.map(metric => (
                      <span class="cs-metric-badge">{metric}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section class="cs-cta">
          <h2>READY TO DEPLOY?</h2>
          <foxy-cta url="/work-with-us">INITIATE PROJECT</foxy-cta>
        </section>

      </div>
    );
  }
}
