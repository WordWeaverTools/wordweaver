import { OverlayContainer } from "@angular/cdk/overlay";
import { TranslateService } from "@ngx-translate/core";
import { Actions } from "@ngrx/effects";
import { TestScheduler } from "rxjs/testing";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { environment } from "../../../environments/environment";

import {
  AnimationsService,
  AppState,
  LocalStorageService,
  NotificationService,
} from "../core.module";

import { SettingsEffects, SETTINGS_KEY } from "./settings.effects";
import { SettingsState, NIGHT_MODE_THEME } from "./settings.model";
import { actionSettingsChangeTheme } from "./settings.actions";
import { EveryVoiceService } from "@everyvoice/every-voice";

const scheduler = new TestScheduler((actual, expected) => {
  // @ts-ignore
  expect(actual).deep.equal(expected);
});

describe("SettingsEffects", () => {
  let router: any;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let overlayContainer: jasmine.SpyObj<OverlayContainer>;
  let animationsService: jasmine.SpyObj<AnimationsService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let tts: jasmine.SpyObj<EveryVoiceService>;
  let store: jasmine.SpyObj<Store<AppState>>;

  beforeEach(() => {
    router = {
      routerState: {
        snapshot: {},
      },
      events: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        pipe() {},
      },
    };
    localStorageService = jasmine.createSpyObj("LocalStorageService", [
      "setItem",
    ]);
    overlayContainer = jasmine.createSpyObj("OverlayContainer", [
      "getContainerElement",
    ]);
    animationsService = jasmine.createSpyObj("AnimationsService", [
      "updateRouteAnimationType",
    ]);
    translateService = jasmine.createSpyObj("TranslateService", ["use"]);
    notificationService = jasmine.createSpyObj("NotificationService", ["use"]);
    tts = jasmine.createSpyObj("EveryVoiceService", ["use"]);
    store = jasmine.createSpyObj("store", ["pipe"]);
  });

  it("should call methods on LocalStorageService for PERSIST action", () => {
    scheduler.run((helpers) => {
      const { cold } = helpers;

      const settings: SettingsState = {
        analytics: false,
        language: "en",
        pageAnimations: true,
        elementsAnimations: true,
        theme: "PURPLE-THEME--LIGHT",
        nightTheme: NIGHT_MODE_THEME,
        autoNightMode: false,
        stickyHeader: false,
        baseUrl: environment.base + environment.dataPrefix,
        testApi: false,
        colors: {
          primary: "rgb(255, 255, 255)",
          accent: "rgb(255, 255, 255)",
        },
        level: environment.config.level,
        highlight: environment.config.highlight,
        pageAnimationsDisabled: true,
        hour: 12,
      };
      store.pipe.and.returnValue(of(settings));
      const persistAction = actionSettingsChangeTheme({
        theme: "PURPLE-THEME--LIGHT",
      });
      const source = cold("a", { a: persistAction });
      const actions = new Actions(source);
      const effect = new SettingsEffects(
        actions,
        store,
        overlayContainer,
        localStorageService,
        animationsService,
        translateService,
        notificationService,
        tts
      );

      effect.persistSettings.subscribe(() => {
        expect(localStorageService.setItem).toHaveBeenCalledWith(
          SETTINGS_KEY,
          settings
        );
      });
    });
  });
});
