import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedModule } from "../../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { WordmakerHomeComponent } from "./wordmaker-home.component";

describe("WordmakerHomeComponent", () => {
  let component: WordmakerHomeComponent;
  let fixture: ComponentFixture<WordmakerHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WordmakerHomeComponent],
      imports: [SharedModule, NoopAnimationsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordmakerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
