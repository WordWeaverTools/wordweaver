import { enableProdMode } from "@angular/core";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { platformBrowser } from "@angular/platform-browser";

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

platformBrowser()
  .bootstrapModule(AppModule, {})
  .catch((err) => console.error(err));
