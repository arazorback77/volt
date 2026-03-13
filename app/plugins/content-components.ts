/**
 * content-components.ts
 *
 * Nuxt Content의 localComponents (XlsxTable, Gof, XDataTable)를
 * MDC 태그 이름(XlsxTable 등)으로 Vue 전역 컴포넌트에 등록한다.
 *
 * 이유: Nuxt 4 auto-import는 app/components/content/XlsxTable.vue를
 * 'ContentXlsxTable'로 등록하지만, MDC 렌더러는 ::XlsxTable → resolveComponent("XlsxTable")를
 * 호출하므로 'ContentXlsxTable'을 찾지 못한다.
 * #content/components에서 올바른 이름으로 가져와 등록하면 <MDC> 내에서도 동작한다.
 */
import { defineAsyncComponent } from "vue";
import { Gof, XDataTable, XlsxTable } from "#content/components";

export default defineNuxtPlugin((nuxtApp) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nuxtApp.vueApp.component("XlsxTable", defineAsyncComponent(XlsxTable as any));
  nuxtApp.vueApp.component("Gof", defineAsyncComponent(Gof as any));
  nuxtApp.vueApp.component("XDataTable", defineAsyncComponent(XDataTable as any));
});
