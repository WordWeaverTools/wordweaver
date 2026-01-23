import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Conjugations, TIERS } from "../../../../config/config";
import { SettingsState, State } from "../../../core/settings/settings.model";
import { selectSettings } from "../../../core/settings/settings.selectors";

@Component({
  selector: "ww-conjugation-list",
  templateUrl: "./conjugation-list.component.html",
  styleUrls: ["./conjugation-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ConjugationListComponent implements OnDestroy, OnInit {
  @Input() data$: Observable<Conjugations>;

  settings$: Observable<SettingsState>;
  tiers = TIERS;
  // selection$: Observable<TableviewerState>;
  unsubscribe$ = new Subject<void>();
  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.settings$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectSettings)
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // TODO: This is currently used for determining whether gridData is an error. This is fragile, and errors should be handled differently.
  isString(val) {
    return typeof val === "string";
  }

  isL2Showing(levels): boolean {
    const l2Tiers = TIERS.filter((x) => x.options.language === "L2");
    return l2Tiers && l2Tiers.some((x) => levels[x.name]);
  }
}
