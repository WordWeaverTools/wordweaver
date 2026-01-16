import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule } from "@ngx-translate/core";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

import {
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader,
} from "../core/core.module";
import { SharedModule } from "../shared/shared.module";

import { AppComponent } from "./app.component";
import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

describe("AppComponent", () => {
  let store: MockStore;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [provideMockStore()],
      declarations: [AppComponent],
    }).compileComponents();
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectSettingsStickyHeader, true);
    store.overrideSelector(selectSettingsLanguage, "en");
    store.overrideSelector(selectEffectiveTheme, "default");
  }));

  // it("should create the app", waitForAsync(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));
});
