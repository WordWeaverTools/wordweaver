import { createSelector } from "@ngrx/store";
import { selectSettingsState } from "../core.state";
import { SettingsState } from "./settings.model";

export const selectSettings = createSelector(
  selectSettingsState,
  (state: SettingsState) => state
);

export const selectSettingsStickyHeader = createSelector(
  selectSettings,
  (state: SettingsState) => state.stickyHeader
);

export const selectSettingsAnalytics = createSelector(
  selectSettings,
  (state: SettingsState) => state.analytics
);

export const selectSettingsLanguage = createSelector(
  selectSettings,
  (state: SettingsState) => state.language
);

export const selectSettingsBaseUrl = createSelector(
  selectSettings,
  (state: SettingsState) => state.baseUrl
);

export const selectTheme = createSelector(
  selectSettings,
  (settings) => settings.theme
);

export const selectThemeColors = createSelector(
  selectSettings,
  (settings) => settings.colors
);

export const selectPageAnimations = createSelector(
  selectSettings,
  (settings) => settings.pageAnimations
);

export const selectElementsAnimations = createSelector(
  selectSettings,
  (settings) => settings.elementsAnimations
);

export const selectAutoNightMode = createSelector(
  selectSettings,
  (settings) => settings.autoNightMode
);

export const selectTestApi = createSelector(
  selectSettings,
  (settings) => settings.testApi
);

export const selectNightTheme = createSelector(
  selectSettings,
  (settings) => settings.nightTheme
);

export const selectHour = createSelector(
  selectSettings,
  (settings) => settings.hour
);

export const selectTtsSettings = createSelector(
  selectSettings,
  (settings) => settings.ttsSettings
);

export const selectTtsSpeaker = createSelector(
  selectSettings,
  (settings) => settings.ttsSettings.speaker
);

export const selectIsNightHour = createSelector(
  selectAutoNightMode,
  selectHour,
  (autoNightMode, hour) => autoNightMode && (hour >= 21 || hour < 7)
);

export const selectEffectiveTheme = createSelector(
  selectTheme,
  selectNightTheme,
  selectIsNightHour,
  (theme, nightTheme, isNightHour) =>
    (isNightHour ? nightTheme : theme).toLowerCase()
);
