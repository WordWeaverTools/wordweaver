import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockStore } from "@ngrx/store/testing";
import { TranslateModule } from "@ngx-translate/core";

import { SharedModule } from "../../../shared/shared.module";
import { TableviewerVerbPanelComponent } from "./tableviewer-verb-panel.component";

describe("TableviewerVerbPanelComponent", () => {
  let component: TableviewerVerbPanelComponent;
  let fixture: ComponentFixture<TableviewerVerbPanelComponent>;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableviewerVerbPanelComponent],
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
    fixture = TestBed.createComponent(TableviewerVerbPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
