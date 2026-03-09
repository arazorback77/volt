// https://nuxt.com/docs/api/configuration/nuxt-config
// import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  srcDir: "app/",
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@clerk/nuxt",
    "@nuxt/ui",
  ],
  runtimeConfig: {
    apiSecret: "", // can be overridden by NUXT_API_SECRET environment variable
    motherduckToken: "", // can be overridden by NUXT_MOTHERDUCK_TOKEN environment variable
    oracleUrl: "", // can be overridden by NUXT_ORACLE_URL environment variable
    public: {
      apiBase: "", // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    },
  },

  vite: {
    // plugins: [tailwindcss()],
  },
  // nitro: {
  //   plugins: ["plugins/duckdb.ts"],
  // },
  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "neutral",
        "gofinvbrand",
        "gofhead",
        "gofbrand",
      ],
    },
  },
  content: {
    // database: {
    //   type: 'sqlite',
    //   filename: 'SQLITE_DB_LOCATION'
    // OR
    //   type: 'd1',
    //   bindingName: 'CF_BINDING_NAME'
    // },
    // renderer: {
    //   alias: {
    //     p: 'MyCustomParagraph'
    //   }
    // }
    build: {
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        },
        // Object syntax can be used to override default options
        remarkPlugins: {
          // Override remark-emoji options
          // 'remark-emoji': {
          //   options: {
          //     emoticon: true
          //   }
          // },
          // Disable remark-gfm
          // 'remark-gfm': false,
          // Add remark-oembed
          // 'remark-oembed': {
          // Options
        },
      },
      // rehypePlugins: {
      // 'rehype-figure': {
      // }
    },
    // highlight: {
    //   // Theme used in all color schemes.
    //   // theme: 'github-light',
    //   // OR
    //   // theme: {
    //   //   // Default theme (same as single string)
    //   //   default: 'github-light',
    //   //   // Theme used if `html.dark`
    //   //   dark: 'github-dark',
    //   //   // Theme used if `html.sepia`
    //   //   sepia: 'monokai'
    //   // },
    //   langs: [
    //     'c',
    //     'cpp',
    //     'java'
    //     // Read more about Shiki languages: https://shiki.style/guide/load-lang
    //     // JSON.parse(
    //     //   readFileSync('./shiki/languages/gdscript.tmLanguage.json', 'utf-8'),
    //     // ),
    //   ]
    // }
  },
  // transformers: [
  //   '~/transformers/title-suffix',
  // ],
  // }
  // }
});
