import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { TranslateModule } from "@ngx-translate/core";

import { SharedModule } from "../../../shared/shared.module";
import { TableviewerComponent } from "./tableviewer.component";

describe("TableviewerComponent", () => {
  let component: TableviewerComponent;
  let fixture: ComponentFixture<TableviewerComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TableviewerComponent],
      imports: [
        SharedModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
