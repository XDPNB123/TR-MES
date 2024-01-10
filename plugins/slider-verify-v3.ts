import SliderVerify from "slider-verify-v3";
import "slider-verify-v3/lib/SliderVerify.css";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SliderVerify);
});
