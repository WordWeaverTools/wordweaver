import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedModule } from "../../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockStore } from "@ngrx/store/testing";

import { WordmakerConjStepComponent } from "./wordmaker-conj-step.component";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { type AppState } from "../../../core/core.state";
import { initialState as settingsInitialState } from "../../../core/settings/settings.reducer";
import { initialState as tableViewerInitialState } from "../../../core/tableviewer-selection/tableviewer-selection.reducer";
import { initialState as wordMakerInitialState } from "../../../core/wordmaker-selection/wordmaker-selection.reducer";

describe("WordmakerConjStepComponent", () => {
  let component: WordmakerConjStepComponent;
  let fixture: ComponentFixture<WordmakerConjStepComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WordmakerConjStepComponent],
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
    fixture = TestBed.createComponent(WordmakerConjStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
