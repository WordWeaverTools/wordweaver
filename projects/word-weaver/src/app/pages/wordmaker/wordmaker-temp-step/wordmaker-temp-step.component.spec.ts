import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedModule } from "../../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideMockStore } from "@ngrx/store/testing";

import { WordmakerTempStepComponent } from "./wordmaker-temp-step.component";
import { type AppState } from "../../../core/core.state";
import { initialState as settingsInitialState } from "../../../core/settings/settings.reducer";
import { initialState as tableViewerInitialState } from "../../../core/tableviewer-selection/tableviewer-selection.reducer";
import { initialState as wordMakerInitialState } from "../../../core/wordmaker-selection/wordmaker-selection.reducer";

describe("WordmakerTempStepComponent", () => {
  let component: WordmakerTempStepComponent;
  let fixture: ComponentFixture<WordmakerTempStepComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WordmakerTempStepComponent],
      imports: [SharedModule, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore<Omit<AppState, "router">>({
          initialState: {
            settings: settingsInitialState,
            tableviewer: tableViewerInitialState,
            wordmaker: wordMakerInitialState,
          },
        }),
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordmakerTempStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
