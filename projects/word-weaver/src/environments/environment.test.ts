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
  apiUrl: "https://unbq-sgile-text-to-speech.hf.space",
  enableTTS: true,
  requiresAuth: true,
  developmentBearerToken: "",
  middlewareEndpoint: "http://localhost:3000/tts",
  domain: "unbq-everyvoice.ca.auth0.com",
  clientId: "7jLB2de2XqEGsAbXLEnUjB49P35r8gQH",
  audience: "https://unbq.everyvoice.middleware.ca",
  defaultSpeaker: { display: "Tina", slug: "tina" },
  diffusionSteps: 3,
};

export const environment = {
  appName: "WordWeaver",
  envName: "TEST",
  ttsConfig: everyVoiceConfig,
  config: {
    tiers: TIERS,
    validation: VALIDATION,
    highlight: HIGHLIGHTS,
    level: LEVELS,
    meta: META_DATA,
  },
  plausibleAnalyticsDataDomain: "",
  production: false,
  test: true,
  base: "",
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
