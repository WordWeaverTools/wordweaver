import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockStore } from "@ngrx/store/testing";
import { TranslateModule } from "@ngx-translate/core";

import { SharedModule } from "../../../shared/shared.module";
import { TableviewerConjPanelComponent } from "./tableviewer-conj-panel.component";
import { type AppState } from "../../../core/core.state";
import { initialState as settingsInitialState } from "../../../core/settings/settings.reducer";
import { initialState as tableViewerInitialState } from "../../../core/tableviewer-selection/tableviewer-selection.reducer";
import { initialState as wordMakerInitialState } from "../../../core/wordmaker-selection/wordmaker-selection.reducer";

describe("TableviewerConjPanelComponent", () => {
  let component: TableviewerConjPanelComponent;
  let fixture: ComponentFixture<TableviewerConjPanelComponent>;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TableviewerConjPanelComponent],
      imports: [
        SharedModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        MatInputModule,
        MatFormFieldModule,
      ],
      providers: [
        provideMockStore<Omit<AppState, "router">>({
          initialState: {
            settings: settingsInitialState,
            tableviewer: tableViewerInitialState,
            wordmaker: wordMakerInitialState,
          },
        }),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
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
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  // it("should create", () => {
  //   expect(component).toBeTruthy();
  // });
});
