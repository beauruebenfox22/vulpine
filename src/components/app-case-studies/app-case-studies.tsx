import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-case-studies',
  styleUrl: 'app-case-studies.css',
  shadow: false,
})
export class AppCaseStudies {
  private cases = [
    {
      id: 'project-a',
      title: 'Neon Catalyst',
      category: 'Web Application / Next.js',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      metrics: ['+140% Conversion', '-50% Load Time'],
      span: 'tall'
    },
    {
      id: 'project-b',
      title: 'Aura Financial',
      category: 'Fintech / Dashboard UI',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      metrics: ['1M+ Transactions', 'SOC2 Compliant'],
      span: 'wide'
    },
    {
      id: 'project-c',
      title: 'Vektor Automotive',
      category: 'E-commerce / Shopify Plus',
      image: 'https://images.unsplash.com/photo-1503375894014-a95d714b1424?auto=format&fit=crop&w=800&q=80',
      metrics: ['$2.4M GMV Increase', 'Custom 3D Configurator'],
      span: 'normal'
    },
    {
      id: 'project-d',
      title: 'Lumina Health',
      category: 'Mobile App / React Native',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      metrics: ['4.9★ App Store', 'HIPAA Certified'],
      span: 'normal'
    }
  ];

  render() {
    return (
      <div class="case-studies-page">
        
        <header class="cs-header">
          <div class="cs-header-content">
            <div class="cs-badge">[ PROOF OF CONCEPT ]</div>
            <h1 class="cs-title">ENGINEERED<br/>OUTCOMES.</h1>
            <p class="cs-subtitle">
              We don't just build software. We engineer high-performance systems that drive measurable business outcomes. 
              Explore our recent deployments below.
            </p>
          </div>
        </header>

        <section class="cs-grid-container">
          <div class="cs-masonry">
            {this.cases.map(project => (
              <div class={`cs-card span-${project.span}`}>
                <div class="cs-card-image" style={{ backgroundImage: `url(${project.image})` }}></div>
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
              </div>
            ))}
          </div>
        </section>
        
        {/* Call to Action */}
        <section class="cs-cta">
          <h2>READY TO DEPLOY?</h2>
          <stencil-route-link url="/contact" class="vulpine-btn-primary">
            <span class="btn-text">INITIATE PROJECT</span>
            <span class="btn-glow"></span>
          </stencil-route-link>
        </section>

      </div>
    );
  }
}
