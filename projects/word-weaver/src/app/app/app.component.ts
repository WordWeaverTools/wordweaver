import { Component, OnInit } from "@angular/core";
import { marker } from "@colsen1991/ngx-translate-extract-marker";
import { select, Store } from "@ngrx/store";
import browser from "browser-detect";
import { forkJoin, Observable, of } from "rxjs";
import { take, map, catchError } from "rxjs/operators";
import { META_DATA } from "../../config/config";
import {
  environment as env,
  environment,
} from "../../environments/environment";
import { AuthService } from "@auth0/auth0-angular";
import {
  LocalStorageService,
  routeAnimations,
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader,
  specialAnimations,
} from "../core/core.module";
import {
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeLanguage,
} from "../core/settings/settings.actions";

import {
  VerbService,
  OptionService,
  PronounService,
  ConjugationService,
} from "../core/core.module";
import { EveryVoiceService } from "@everyvoice/every-voice";

// wraps an observable to see if the observable was a success or not
const safeLoad = <T>(obs$: Observable<T>) =>
  obs$.pipe(
    map((data) => ({ status: "success" as const, data })),
    catchError((error) => of({ status: "error" as const, error }))
  );

@Component({
  selector: "ww-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [routeAnimations, specialAnimations],
  standalone: false,
})
export class AppComponent implements OnInit {
  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  // logo = require("../../assets/logo.png");
  logo = META_DATA.logo;
  languages = META_DATA.languages;
  navigation = [
    { link: "wordmaker", label: marker("ww.menu.wordmaker") },
    { link: "tableviewer", label: marker("ww.menu.tableviewer") },
    // { link: "info", label: marker("ww.menu.info") },
    { link: "about", label: marker("ww.menu.about") },
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: "settings", label: marker("ww.menu.settings") },
  ];
  metaData = META_DATA;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;
  requiresAuth: boolean;
  constructor(
    private store: Store,
    private storageService: LocalStorageService,
    private verbService: VerbService,
    private pronounService: PronounService,
    private optionService: OptionService,
    private conjugationService: ConjugationService,
    public tts: EveryVoiceService,
    public authService: AuthService
  ) {}

  private static isIEorEdgeOrSafari() {
    return ["ie", "edge", "safari"].includes(browser().name);
  }

  ngOnInit(): void {
    // Authentication
    this.requiresAuth = environment.ttsConfig.requiresAuth;
    if (this.requiresAuth) {
      this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
        this.tts.ttsEnabledAndAuthenticated$.next(isAuthenticated);
      });
    }

    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true,
        })
      );
    }

    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));

    forkJoin([
      safeLoad(this.conjugationService.conjugations$.pipe(take(1))),
      safeLoad(this.verbService.verbs$.pipe(take(1))),
      safeLoad(this.optionService.options$.pipe(take(1))),
      safeLoad(this.pronounService.pronouns$.pipe(take(1))),
    ]).subscribe((results) => {
      const [c, v, o, p] = results;
      if ([c, v, o, p].some((r) => r.status === "error")) {
        console.warn("Some observables failed:", results);
        // handle partial failure, maybe retry or show a warning
      } else {
        console.log("All data loaded successfully:", {
          conjugations: c,
          verbs: v,
          options: o,
          pronouns: p,
        });
      }
    });
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(actionSettingsChangeLanguage({ language }));
  }
}
