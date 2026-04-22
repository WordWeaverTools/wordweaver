import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { META_DATA } from "../../../config/config";
import { selectTableviewerState } from "../../core/core.state";
import { State } from "../../core/settings/settings.model";
import { actionChangeViewMode } from "../../core/tableviewer-selection/tableviewer-selection.actions";
import { TableviewerState } from "../../core/tableviewer-selection/tableviewer-selection.model";
import { selectTableViewerGridOrder } from "../../core/tableviewer-selection/tableviewer-selection.selectors";
import { GridOrderOptions } from "../../pages/tableviewer/conjugation-grid/conjugation-grid.component";

@Component({
  selector: "ww-tableviewer-dialog",
  templateUrl: "./tableviewer-dialog.component.html",
  styleUrls: ["./tableviewer-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableViewerDialogComponent implements OnInit {
  showDelay = new FormControl(600);
  hideDelay = new FormControl(200);
  tooltipPosition = "above";
  metaData = META_DATA;
  selection$: Observable<TableviewerState>;
  gridOrderTitles = ["Tabs", "Rows", "Columns"];
  gridOrder$;
  gridOrderValues: GridOrderOptions[];
  constructor(
    private dialogRef: MatDialogRef<TableViewerDialogComponent>,
    private store: Store<State>
  ) {
    this.gridOrder$ = this.store.pipe(select(selectTableViewerGridOrder));
    this.gridOrder$
      .pipe(take(1))
      .subscribe((x) => (this.gridOrderValues = [x.main, x.row, x.col])); // Initialize
  }

  ngOnInit(): void {
    this.selection$ = this.store.pipe(select(selectTableviewerState));
  }

  onSelecteViewMode(event) {
    this.store.dispatch(actionChangeViewMode({ view: event.value }));
  }

  exit() {
    this.dialogRef.close();
  }
}
