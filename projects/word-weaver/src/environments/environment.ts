// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --configuration=ghpages` and `ng build --configuration=netlify` will use `environment.ghpages.ts` and `environment.netlify.ts` respectively.
// The list of which env maps to which file can be found in `.angular-cli.json`.
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
  availableSpeakers: [{ display: "test", slug: "test" }],
};

export const environment = {
  appName: "WordWeaver",
  envName: "DEV",
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
  test: false,
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
    fontAwesome: packageJson.dependencies["@fortawesome/fontawesome-free"],
    angularCli: packageJson.devDependencies["@angular/cli"],
    typescript: packageJson.devDependencies["typescript"],
  },
};
