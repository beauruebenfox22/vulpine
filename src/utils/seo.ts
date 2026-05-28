export interface SEOOptions {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export function setSEO(options: SEOOptions) {
  // Guard against SSR / Node environments if Stencil isn't fully ready
  if (typeof document === 'undefined') {
    return;
  }

  // Set the standard document title
  document.title = options.title;

  // Helper to dynamically inject or update meta tags
  const setMeta = (attr: 'name' | 'property', attrValue: string, content: string) => {
    let tag = document.head.querySelector(`meta[${attr}="${attrValue}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, attrValue);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // Core SEO
  setMeta('name', 'description', options.description);

  // OpenGraph (Social Sharing for LinkedIn, Twitter, Slack, etc.)
  setMeta('property', 'og:title', options.title);
  setMeta('property', 'og:description', options.description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', 'Vulpine Digital');

  if (options.url) {
    setMeta('property', 'og:url', options.url);
  }
  
  if (options.image) {
    setMeta('property', 'og:image', options.image);
    setMeta('property', 'twitter:card', 'summary_large_image');
  }
}
