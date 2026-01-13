import {
  HIGHLIGHTS,
  LEVELS,
  META_DATA,
  TIERS,
  VALIDATION,
} from "../config/config";
import { EveryVoiceConfig } from "@everyvoice/every-voice";

const packageJson = require("../../../../package.json");

export const everyVoiceConfig: EveryVoiceConfig = {
  enableTTS: true,
  requiresAuth: false,
};

export const environment = {
  appName: "WordWeaver",
  envName: "PROD",
  ttsConfig: everyVoiceConfig,
  config: {
    tiers: TIERS,
    validation: VALIDATION,
    highlight: HIGHLIGHTS,
    level: LEVELS,
    meta: META_DATA,
  },
  plausibleAnalyticsDataDomain: "wordweavertools.github.io/wordweaver",
  production: true,
  test: false,
  base: "/wordweaver",
  dataPrefix: `/assets/data/fr/v1/`,
  dataTestPrefix: `/assets/data/fr/v2/`,
  usePrecompressedData: false, // Set to true only if deploying to Netlify or somewhere you can set the appropriate Content-Type: application/json & Content-Encoding: gzip response headers.
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies["@angular/core"],
    ngrx: packageJson.dependencies["@ngrx/store"],
    material: packageJson.dependencies["@angular/material"],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies["@ngx-translate/core"],
    fontAwesome:
      packageJson.dependencies["@fortawesome/fontawesome-free-webfonts"],
    angularCli: packageJson.devDependencies["@angular/cli"],
    typescript: packageJson.devDependencies["typescript"],
  },
};
