import { CommonModule } from "@angular/common";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { ErrorHandler, NgModule, Optional, SkipSelf } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  FaIconLibrary,
  FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";
import {
  faGithub,
  faInstagram,
  faMediumM,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faBed,
  faCog,
  faMusic,
  faPlayCircle,
  faPowerOff,
  faRocket,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { EffectsModule } from "@ngrx/effects";
import {
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { AnimationsService } from "./animations/animations.service";
import {
  routeAnimations,
  ROUTE_ANIMATIONS_ELEMENTS,
  specialAnimations,
} from "./animations/route.animations";
import { ConjugationService } from "./conjugation/conjugation.service";
import {
  AppState,
  metaReducers,
  reducers,
  selectRouterState,
} from "./core.state";
import { AppErrorHandler } from "./error-handler/app-error-handler.service";
import { HttpErrorInterceptor } from "./http-interceptors/http-error.interceptor";
import { LocalStorageService } from "./local-storage/local-storage.service";
import { NotificationService } from "./notifications/notification.service";
import { OptionService } from "./option/option.service";
import { PronounService } from "./pronoun/pronoun.service";
import { CustomSerializer } from "./router/custom-serializer";
import { SettingsEffects } from "./settings/settings.effects";
import {
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader,
} from "./settings/settings.selectors";
import { TableviewerEffects } from "./tableviewer-selection/tableviewer-selection.effects";
import { ValidationService } from "./validation/validation.service";
import { VerbService } from "./verb/verb.service";
import { WordmakerEffects } from "./wordmaker-selection/wordmaker-selection.effects";
import { provideAuth0 } from "@auth0/auth0-angular";

export {
  routeAnimations,
  specialAnimations,
  AppState,
  LocalStorageService,
  ROUTE_ANIMATIONS_ELEMENTS,
  AnimationsService,
  selectRouterState,
  NotificationService,
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader,
  OptionService,
  PronounService,
  ConjugationService,
  ValidationService,
  VerbService,
};

export interface ITranslationResource {
  prefix: string;
  suffix: string;
}

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private resources: ITranslationResource[]
  ) {}

  public getTranslation(lang: string): Observable<any> {
    const requests = this.resources.map((resource) => {
      const path = resource.prefix + lang + resource.suffix;
      return this.http.get(path).pipe(
        catchError((res) => {
          console.error("Could not find translation file:", path);
          return of({});
        })
      );
    });
    return forkJoin(requests).pipe(
      map((response) =>
        response.reduce((result, currentObject) => {
          for (const key in currentObject) {
            if (currentObject.hasOwnProperty(key)) {
              result[key] = currentObject[key];
            }
          }
          return result;
        }, {})
      )
    );
  }
}

export const httpLoaderFactory = (http: HttpClient) =>
  new MultiTranslateHttpLoader(http, [
    // These are the UI-specific i18n assets
    {
      prefix: environment.base + "/assets/i18n/",
      suffix: ".json",
    },
    // These are the data-specific i18n assets
    {
      prefix: environment.base + environment.dataPrefix + "i18n/",
      suffix: ".json",
    },
  ]);

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,

    // material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,

    // ngrx
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      SettingsEffects,
      TableviewerEffects,
      WordmakerEffects,
    ]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: "Word Weaver",
        }),

    // 3rd party
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [],
  providers: [
    ConjugationService,
    OptionService,
    PronounService,
    VerbService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    provideAuth0({
      domain: environment.ttsConfig.domain,
      clientId: environment.ttsConfig.clientId,
      authorizationParams: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: `${window.location.origin}/auth-callback`,
        audience: environment.ttsConfig.audience,
      },
      skipRedirectCallback: true,
    }),
  ],
  exports: [
    // angular
    FormsModule,

    // material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,

    // 3rd party
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    faIconLibrary: FaIconLibrary
  ) {
    if (parentModule) {
      throw new Error("CoreModule is already loaded. Import only in AppModule");
    }
    faIconLibrary.addIcons(
      faBed,
      faCog,
      faBars,
      faRocket,
      faPowerOff,
      faUserCircle,
      faPlayCircle,
      faGithub,
      faMediumM,
      faMusic,
      faTwitter,
      faInstagram,
      faYoutube
    );
  }
}
