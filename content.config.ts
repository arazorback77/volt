import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: 'blog/**/*.md'
        }),
        content: defineCollection({
            type: 'page',
            source: 'all/**/*.md'
        }),
        docs: defineCollection({
            type: 'page',
            source: {
                repository: 'https://github.com/nuxt/content',
                include: 'docs/content/**',
            },
        }),
        // tabledata: defineCollection({
        //     type: 'data',
        //     source: 'tabledata/**.csv',
        //     schema: z.object({
        //         name: z.string(),
        //         email: z.string(),
        //         avatar: z.string()
        //     })
        // })
    }
})
