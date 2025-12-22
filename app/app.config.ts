export default defineAppConfig({
  ui: {
    colors: {
      primary: "emerald",
      secondary: "slate",
      info: "blue",
      success: "green",
      warning: "yellow",
      error: "red",
      neutral: "zinc",
      gofbrand: "lime",
      gofinvbrand: "indigo",
      gofhead: "rose",
    },
    button: {
      slots: {
        base: "font-bold cursor-pointer",
      },
    },
    avatar: {
      slots: {
        root: "inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-full align-middle bg-(--bluegrey-fg)",
        image: "h-full w-full rounded-[inherit] object-cover",
        fallback: "font-medium leading-none text-(--ui-text-muted) truncate",
        icon: "text-(--ui-text-muted) shrink-0",
      },
    },
    dashboardSidebar: {
      slots: {
        root: "min-w-25",
      },
    },
    navigationMenu: {
      slots: {},
    },
    modal: {
      slots: {
        overlay: "bg-(--ui-bg-elevated)/50",
        header: "flex items-center gap-1.5 p-2 sm:px-6 min-h-16",
      },
      variants: {
        fullscreen: {
          false: {
            // content: "sm:max-w-xl",
            content: "w-4/5 max-w-4/5 h-4/5 min-h-4/5 bg-gray-900",
          },
        },
      },
    },
    tree: {
      slots: {
        // root: "relative isolate",
        // item: "",
        listWithChildren: "ms-4.5",
        // listWithChildren: "ms-4.5 border-s border-(--ui-border)",
        // itemWithChildren: "ps-1.5 -ms-px",
        // link: "relative group w-full flex items-center text-sm before:absolute before:inset-y-px before:inset-x-0 before:z-[-1] before:rounded-[calc(var(--ui-radius)*1.5)] focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
        // linkLeadingIcon: "shrink-0",
        // linkLabel: "truncate",
        // linkTrailing: "ms-auto inline-flex gap-1.5 items-center",
        // linkTrailingIcon:
        // "shrink-0 transform transition-transform duration-200 group-data-expanded:rotate-180",
      },
    },
  },
  shadcnDocs: {
    site: {
      name: "shadcn-docs-nuxt",
      description:
        "Beautifully designed Nuxt Content template built with shadcn-vue. Customizable. Compatible. Open Source.",
    },
    theme: {
      customizable: true,
      color: "zinc",
      radius: 0.5,
    },
    header: {
      title: "shadcn-docs-starter",
      showTitle: true,
      darkModeToggle: true,
      languageSwitcher: {
        enable: false,
        triggerType: "icon",
        dropdownType: "select",
      },
      logo: {
        light: "/logo.svg",
        dark: "/logo-dark.svg",
      },
      nav: [],
      links: [
        {
          icon: "lucide:github",
          to: "https://github.com/ZTL-UwU/shadcn-docs-nuxt",
          target: "_blank",
        },
      ],
    },
    aside: {
      useLevel: true,
      collapse: false,
    },
    main: {
      breadCrumb: true,
      showTitle: true,
    },
    footer: {
      credits: "Copyright © 2024",
      links: [
        {
          icon: "lucide:github",
          to: "https://github.com/ZTL-UwU/shadcn-docs-nuxt",
          target: "_blank",
        },
      ],
    },
    toc: {
      enable: true,
      links: [
        {
          title: "Star on GitHub",
          icon: "lucide:star",
          to: "https://github.com/ZTL-UwU/shadcn-docs-nuxt",
          target: "_blank",
        },
        {
          title: "Create Issues",
          icon: "lucide:circle-dot",
          to: "https://github.com/ZTL-UwU/shadcn-docs-nuxt/issues",
          target: "_blank",
        },
      ],
    },
    search: {
      enable: true,
      inAside: false,
    },
  },
});
