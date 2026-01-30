import { enableProdMode, provideZoneChangeDetection } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

if (environment.production && environment.plausibleAnalyticsDataDomain) {
  const analysticsScript = document.createElement("script");
  analysticsScript.src = "https://plausible.io/js/script.js";
  analysticsScript.defer = true;
  analysticsScript.setAttribute(
    "data-domain",
    environment.plausibleAnalyticsDataDomain
  );
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(analysticsScript);
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    applicationProviders: [provideZoneChangeDetection()],
  })
  .catch((err) => console.error(err));
