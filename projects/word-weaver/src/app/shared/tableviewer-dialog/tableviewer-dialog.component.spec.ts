import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { TranslateModule } from "@ngx-translate/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";

import { TableViewerDialogComponent } from "./tableviewer-dialog.component";
import { MatTooltip } from "@angular/material/tooltip";
import { type AppState } from "../../core/core.state";
import { initialState as settingsInitialState } from "../../core/settings/settings.reducer";
import { initialState as tableViewerInitialState } from "../../core/tableviewer-selection/tableviewer-selection.reducer";
import { initialState as wordMakerInitialState } from "../../core/wordmaker-selection/wordmaker-selection.reducer";

describe("TableViewerDialogComponent", () => {
  let component: TableViewerDialogComponent;
  let fixture: ComponentFixture<TableViewerDialogComponent>;
  let store: MockStore;

  beforeEach(async () => {
    const tb = TestBed.configureTestingModule({
      imports: [MatDialogModule, TranslateModule.forRoot(), MatTooltip],
      declarations: [TableViewerDialogComponent],
      providers: [
        provideMockStore<Omit<AppState, "router">>({
          initialState: {
            settings: settingsInitialState,
            tableviewer: tableViewerInitialState,
            wordmaker: wordMakerInitialState,
          },
        }),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    });
    console.log(tb);
    await tb.compileComponents();

    fixture = TestBed.createComponent(TableViewerDialogComponent);
    //store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
