import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { TranslateModule } from "@ngx-translate/core";

import { SharedModule } from "../../../shared/shared.module";
import { WordmakerConjStepComponent } from "../wordmaker-conj-step/wordmaker-conj-step.component";
import { WordmakerPersStepComponent } from "../wordmaker-pers-step/wordmaker-pers-step.component";
import { WordmakerTempStepComponent } from "../wordmaker-temp-step/wordmaker-temp-step.component";
import { WordmakerVerbStepComponent } from "../wordmaker-verb-step/wordmaker-verb-step.component";
import { WordmakerComponent } from "./wordmaker.component";

describe("WordmakerComponent", () => {
  let component: WordmakerComponent;
  let fixture: ComponentFixture<WordmakerComponent>;
  let store: MockStore;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        WordmakerComponent,
        WordmakerConjStepComponent,
        WordmakerTempStepComponent,
        WordmakerVerbStepComponent,
        WordmakerPersStepComponent,
      ],
      imports: [SharedModule, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordmakerComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
