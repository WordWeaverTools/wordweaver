import { Action, createReducer, on } from "@ngrx/store";
import { initialSettings } from "../../../config/config";
import { environment } from "../../../environments/environment";
import {
  actionSettingsChangeAnalytics,
  actionSettingsChangeAnimationsElements,
  actionSettingsChangeAnimationsPage,
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeAutoNightMode,
  actionSettingsChangeBaseUrl,
  actionSettingsChangeHighlight,
  actionSettingsChangeHour,
  actionSettingsChangeLanguage,
  actionSettingsChangeLevel,
  actionSettingsChangeStickyHeader,
  actionSettingsChangeTestApi,
  actionSettingsChangeTheme,
  actionSettingsChangeThemeColors,
  actionSettingsChangeTtsDiffusionSteps,
  actionSettingsChangeTtsSpeaker,
} from "./settings.actions";
import { NIGHT_MODE_THEME, SettingsState } from "./settings.model";

const initialBaseState: SettingsState = {
  analytics: !!environment.plausibleAnalyticsDataDomain,
  language: "en",
  theme: "PURPLE-THEME--LIGHT",
  autoNightMode: false,
  nightTheme: NIGHT_MODE_THEME,
  stickyHeader: true,
  pageAnimations: true,
  pageAnimationsDisabled: false,
  elementsAnimations: true,
  baseUrl: environment.base + environment.dataPrefix,
  testApi: false,
  colors: {
    primary: "rgb(255, 255, 255)",
    accent: "rgb(255, 255, 255)",
  },
  level: environment.config.level,
  highlight: environment.config.highlight,
  hour: new Date().getHours(),
  ttsSettings: {
    diffusionSteps: environment.ttsConfig.diffusionSteps,
    speaker: environment.ttsConfig.defaultSpeaker,
  },
};

export const initialState: SettingsState = {
  ...initialBaseState,
  ...initialSettings,
};

const reducer = createReducer(
  initialState,
  on(
    actionSettingsChangeAnalytics,
    actionSettingsChangeLanguage,
    actionSettingsChangeTheme,
    actionSettingsChangeAutoNightMode,
    actionSettingsChangeTestApi,
    actionSettingsChangeStickyHeader,
    actionSettingsChangeAnimationsPage,
    actionSettingsChangeAnimationsElements,
    actionSettingsChangeHour,
    actionSettingsChangeBaseUrl,
    (state, action) => ({ ...state, ...action })
  ),
  on(
    actionSettingsChangeAnimationsPageDisabled,
    (state, { pageAnimationsDisabled }) => ({
      ...state,
      pageAnimationsDisabled,
      pageAnimations: false,
    })
  ),
  on(actionSettingsChangeThemeColors, (state, action) => ({
    ...state,
    colors: {
      ...state.colors,
      ...{ primary: action.primary, accent: action.accent },
    },
  })),
  on(actionSettingsChangeTtsDiffusionSteps, (state, action) => ({
    ...state,
    ttsSettings: {
      ...state.ttsSettings,
      ...{ diffusionSteps: action.diffusionSteps },
    },
  })),
  on(actionSettingsChangeTtsSpeaker, (state, action) => ({
    ...state,
    ttsSettings: {
      ...state.ttsSettings,
      ...{ speaker: action.speaker },
    },
  })),
  on(actionSettingsChangeHighlight, (state, action) => {
    const newNestedState = {};
    newNestedState[action.key] = action.checked;
    return {
      ...state,
      highlight: { ...state.highlight, ...newNestedState },
    };
  }),
  on(actionSettingsChangeLevel, (state, action) => {
    const newNestedState = {};
    newNestedState[action.key] = action.checked;
    return {
      ...state,
      level: { ...state.level, ...newNestedState },
    };
  })
);

export const settingsReducer = (
  state: SettingsState | undefined,
  action: Action
) => reducer(state, action);
