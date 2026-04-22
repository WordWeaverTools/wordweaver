import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockStore } from "@ngrx/store/testing";
import { TranslateModule } from "@ngx-translate/core";

import { SharedModule } from "../../../shared/shared.module";
import { TableviewerConjPanelComponent } from "./tableviewer-conj-panel.component";

describe("TableviewerConjPanelComponent", () => {
  let component: TableviewerConjPanelComponent;
  let fixture: ComponentFixture<TableviewerConjPanelComponent>;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableviewerConjPanelComponent],
      imports: [
        SharedModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        MatInputModule,
        MatFormFieldModule,
        HttpClientTestingModule,
      ],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableviewerConjPanelComponent);
    component = fixture.componentInstance;
    component.header = {
      nativeElement: jasmine.createSpyObj("nativeElement", ["focus"]),
    };
    component.conjugateBtn = {
      nativeElement: jasmine.createSpyObj("nativeElement", ["focus"]),
    };
    fixture.detectChanges();
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  // it("should create", () => {
  //   expect(component).toBeTruthy();
  // });
});
