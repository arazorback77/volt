export default defineAppConfig({
  ui: {
    colors: {
      primary: "emerald",
      neutral: "zinc",
      gof: "bluegrey",
      gofinv: "bluegrey",
      gofhead: "bluegrey",
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
      slots: {
        // root: 'relative flex gap-1.5 [&>div]:min-w-0',
        // list: 'isolate min-w-0',
        label: "text-(--gofhead-inv)",
        // label: 'w-full flex items-center gap-1.5 font-semibold text-xs/5 text-(--ui-text-highlighted) px-2.5 py-1.5',
        // item: "min-w-0",
        // link: "group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-[calc(var(--ui-radius)*1.5)] focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
        // linkLeadingIcon: "shrink-0 size-5",
        // linkLeadingAvatar: "shrink-0",
        // linkLeadingAvatarSize: "2xs",
        // linkTrailing: "ms-auto inline-flex gap-1.5 items-center",
        // linkTrailingBadge: "shrink-0",
        // linkTrailingBadgeSize: "sm",
        // linkTrailingIcon:
        //   "size-5 transform shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200",
        // linkLabel: "truncate",
        linkLabelExternalIcon: "text-(--gofhead-inv)",
        // linkLabelExternalIcon: 'inline-block size-3 align-top text-(--ui-text-dimmed)',
        // childList: "",
        // childItem: "",
        // childLink:
        //   "group size-full px-3 py-2 rounded-[calc(var(--ui-radius)*1.5)] flex items-start gap-2 text-start",
        // childLinkWrapper: "flex flex-col items-start",
        // childLinkIcon: "size-5 shrink-0",
        // childLinkLabel: "font-semibold text-sm relative inline-flex",
        // childLinkLabelExternalIcon: 'inline-block size-3 align-top text-(--ui-text-dimmed)',
        childLinkLabelExternalIcon: "text-(--gofhead-inv)",
        // childLinkDescription: 'text-sm text-(--ui-text-muted)',
        childLinkDescription: "text-(--gofhead-inv)",
        // separator: 'px-2 h-px bg-(--ui-border)',
        separator: "bg-(--gofhead-accent)",
        // viewportWrapper: "absolute top-full left-0 flex w-full",
        viewport: "bg-gray-900 ring-(--gofhead) z-100",
        // viewport: 'relative overflow-hidden bg-(--ui-bg) shadow-lg rounded-[calc(var(--ui-radius)*1.5)] ring ring-(--ui-border) h-(--reka-navigation-menu-viewport-height) w-full transition-[width,height,left] duration-200 origin-[top_center] data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
        // content: "absolute top-0 left-0 w-full",
        // indicator:
        // "absolute data-[state=visible]:animate-[fade-in_100ms_ease-out] data-[state=hidden]:animate-[fade-out_100ms_ease-in] data-[state=hidden]:opacity-0 bottom-0 z-[1] w-(--reka-navigation-menu-indicator-size) translate-x-(--reka-navigation-menu-indicator-position) flex h-2.5 items-end justify-center overflow-hidden transition-[translate,width] duration-200",
        // arrow: 'relative top-[50%] size-2.5 rotate-45 border border-(--ui-border) bg-(--ui-bg) z-[1] rounded-[calc(var(--ui-radius)/2)]'
        arrow: "border-(--gofhead-accent) bg-(--ui-gof)",
      },
      variants: {
        active: {
          true: {
            childLink: "bg-(--gofhead-accent) text-(--gofhead-inv)",
            childLinkIcon: "text-(--gofhead-inv)",
          },
          false: {
            link: "text-(--gofhead-inv)",
            linkLeadingIcon: "text-(--gofhead-inv)",
            childLink:
              "hover:bg-(--gofhead-accent)/50 text-(--gofhead-inv) hover:text-(--gofhead-inv)",
            childLinkIcon:
              "text-(--gofhead-inv) group-hover:text-(--gofhead-inv)",
          },
        },
      },
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
