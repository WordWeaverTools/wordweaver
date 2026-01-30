import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Option } from "../../../../config/config";
import {
  OptionService,
  selectSettingsLanguage,
} from "../../../core/core.module";
import { actionChangeOptions } from "../../../core/tableviewer-selection/tableviewer-selection.actions";
import { State } from "../../../core/tableviewer-selection/tableviewer-selection.model";
import { selectTableViewerOption } from "../../../core/tableviewer-selection/tableviewer-selection.selectors";
import { OptionsByType } from "../../../core/option/option.service";

@Component({
  selector: "ww-tableviewer-temp-panel",
  templateUrl: "./tableviewer-temp-panel.component.html",
  styleUrls: ["./tableviewer-temp-panel.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TableviewerTempPanelComponent implements OnDestroy, OnInit {
  possibleOptions$: Observable<Option[]>;
  possibleOptionsByType$: Observable<OptionsByType[]>;
  selection$: Observable<Option[]>;
  unsubscribe$ = new Subject<void>();
  lang$ = this.store.pipe(
    takeUntil(this.unsubscribe$),
    select(selectSettingsLanguage)
  );
  constructor(
    public optionService: OptionService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.possibleOptions$ = this.optionService.options$.pipe(
      takeUntil(this.unsubscribe$)
    );
    this.possibleOptionsByType$ = this.optionService.optionsByType$.pipe(
      takeUntil(this.unsubscribe$)
    );
    // populate with store's selection
    this.selection$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectTableViewerOption)
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onOptionSelect(options) {
    this.store.dispatch(actionChangeOptions({ option: options.value }));
  }
}
