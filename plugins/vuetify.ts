// Vuetify
import { createVuetify } from "vuetify";
import * as directives from "vuetify/directives";
import * as components from "vuetify/components";
import * as labsComponents from "vuetify/labs/components";
// fa
import "@fortawesome/fontawesome-free/css/all.css";
import { aliases, fa } from "vuetify/iconsets/fa";
export default defineNuxtPlugin((nuxtApp) => {
  //
  const vuetify = createVuetify({
    ssr: true,
    directives,
    components: {
      ...components,
      ...labsComponents,
    },
    theme: {
      defaultTheme: "light",
    },
    icons: {
      defaultSet: "fa",
      aliases,
      sets: {
        fa,
      },
    },
  });
  //
  nuxtApp.vueApp.use(vuetify);
});
