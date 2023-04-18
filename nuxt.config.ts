// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    app: {
        baseURL: "/webrtc2midi/",
        head: {
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1 maximum-scale=1, user-scalable=no' },
            ]
        }
    },
    css: [
        "@/assets/pure.css",
        "@/assets/style.css",
    ]
});
