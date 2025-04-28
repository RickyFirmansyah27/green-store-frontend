import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from "@tanstack/vue-query";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient();

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
    contextSharing: true, // Memungkinkan berbagi context antar komponen
  });

  // Hydrate/dehydrate untuk SSR
  if (process.server) {
    nuxtApp.hook("app:rendered", () => {
      nuxtApp.payload.vueQueryState = dehydrate(queryClient);
    });
  }

  if (process.client) {
    hydrate(queryClient, nuxtApp.payload.vueQueryState);
  }
});