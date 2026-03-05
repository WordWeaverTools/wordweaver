import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

import {
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader,
} from "../core/core.module";
import { SharedModule } from "../shared/shared.module";

import { AppComponent } from "./app.component";
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { routes } from "../app-routing.module";
import { type AppState } from "../core/core.state";
import { initialState as settingsInitialState } from "../core/settings/settings.reducer";
import { initialState as tableViewerInitialState } from "../core/tableviewer-selection/tableviewer-selection.reducer";
import { initialState as wordMakerInitialState } from "../core/wordmaker-selection/wordmaker-selection.reducer";

describe("AppComponent", () => {
  let store: MockStore;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [SharedModule, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        provideRouter(routes),
        provideMockStore<Omit<AppState, "router">>({
          initialState: {
            settings: settingsInitialState,
            tableviewer: tableViewerInitialState,
            wordmaker: wordMakerInitialState,
          },
        }),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
  }));

  // it("should create the app", waitForAsync(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));
});
