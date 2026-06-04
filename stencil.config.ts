import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // serviceWorker: null, // Commented out to enable service workers in production
      baseUrl: 'https://vulpine.digital/',
      copy: [
        { src: 'sitemap.xml' }
      ]
    },
  ],
};
