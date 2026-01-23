import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

import { DownloadDialogComponent } from "./download-dialog.component";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TranslateModule } from "@ngx-translate/core";

describe("DownloadDialogComponent", () => {
  let component: DownloadDialogComponent;
  let fixture: ComponentFixture<DownloadDialogComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let store: MockStore;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadDialogComponent],
      imports: [MatDialogModule, MatSnackBarModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadDialogComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
