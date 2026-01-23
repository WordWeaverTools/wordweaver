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

describe("WordmakerConjStepComponent", () => {
  let component: WordmakerConjStepComponent;
  let fixture: ComponentFixture<WordmakerConjStepComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WordmakerConjStepComponent],
      imports: [SharedModule, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
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
