import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: 'BARE Docs',
    description:
      'Documentation for backend-ai-starter-recipes — AI agent rules, skills, and workflows for Node.js backends.',
    base: '/backend-ai-starter-recipes/',
    outDir: '.vitepress/dist',

    themeConfig: {
      logo: '/logo.svg',

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/1-the-problem', activeMatch: '/guide/' },
        { text: 'Community', link: '/community/contributing' },
        {
          text: 'GitHub',
          link: 'https://github.com/JeelVankhede/backend-ai-starter-recipes',
        },
      ],

      sidebar: {
        '/guide/': [
          {
            text: 'Start here',
            items: [
              { text: 'The problem', link: '/guide/1-the-problem' },
              { text: 'How it works', link: '/guide/2-how-it-works' },
              { text: 'Installation', link: '/guide/3-installation' },
              { text: 'Usage', link: '/guide/4-usage' },
              { text: 'Understanding the output', link: '/guide/5-the-output' },
              { text: 'Recommended workflow', link: '/guide/6-workflow' },
            ],
          },
        ],
        '/community/': [
          {
            text: 'Community',
            items: [{ text: 'Contributing & support', link: '/community/contributing' }],
          },
        ],
      },

      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/JeelVankhede/backend-ai-starter-recipes',
        },
      ],

      editLink: {
        pattern:
          'https://github.com/JeelVankhede/backend-ai-starter-recipes/edit/main/website/:path',
        text: 'Edit this page on GitHub',
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © Jeel Vankhede',
      },

      search: {
        provider: 'local',
      },

      outline: {
        level: [2, 3],
      },
    },

    mermaid: {
      theme: 'default',
    },
  }),
);
