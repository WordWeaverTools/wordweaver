import { createAction, props } from "@ngrx/store";
import { AvailableLanguages, ThemeName } from "../../../config/config";
import { Speaker } from "@everyvoice/every-voice";

export const actionSettingsChangeLanguage = createAction(
  "[Settings] Change Language",
  props<{ language: AvailableLanguages }>()
);

export const actionSettingsChangeLevel = createAction(
  "[Settings] Change Level",
  props<{ checked: boolean; key: string }>()
);

export const actionSettingsChangeHighlight = createAction(
  "[Settings] Change Highlight",
  props<{ checked: boolean; key: string }>()
);

export const actionSettingsChangeTestApi = createAction(
  "[Settings] Change TestApi",
  props<{ testApi: boolean }>()
);

export const actionSettingsChangeTheme = createAction(
  "[Settings] Change Theme",
  props<{ theme: ThemeName }>()
);

export const actionSettingsChangeThemeColors = createAction(
  "[Settings] Change Theme Colors",
  props<{ primary: string; accent: string }>()
);

export const actionSettingsChangeBaseUrl = createAction(
  "[Settings] Change Base Url",
  props<{ baseUrl: string }>()
);

export const actionSettingsChangeAutoNightMode = createAction(
  "[Settings] Change Auto Night Mode",
  props<{ autoNightMode: boolean }>()
);

export const actionSettingsChangeStickyHeader = createAction(
  "[Settings] Change Sticky Header",
  props<{ stickyHeader: boolean }>()
);

export const actionSettingsChangeAnalytics = createAction(
  "[Settings] Change Analytics Opt-in",
  props<{ analytics: boolean }>()
);

export const actionSettingsChangeAnimationsPage = createAction(
  "[Settings] Change Animations Page",
  props<{ pageAnimations: boolean }>()
);

export const actionSettingsChangeAnimationsPageDisabled = createAction(
  "[Settings] Change Animations Page Disabled",
  props<{ pageAnimationsDisabled: boolean }>()
);

export const actionSettingsChangeAnimationsElements = createAction(
  "[Settings] Change Animations Elements",
  props<{ elementsAnimations: boolean }>()
);

export const actionSettingsChangeTtsDiffusionSteps = createAction(
  "[Settings] Change TTS Settings",
  props<{ diffusionSteps: number }>()
);

export const actionSettingsChangeTtsSpeaker = createAction(
  "[Settings] Change TTS Speaker",
  props<{ speaker: Speaker }>()
);

export const actionSettingsChangeHour = createAction(
  "[Settings] Change Hours",
  props<{ hour: number }>()
);
