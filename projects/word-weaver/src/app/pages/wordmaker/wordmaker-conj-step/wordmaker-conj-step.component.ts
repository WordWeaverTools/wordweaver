import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { switchMap, map, takeUntil } from "rxjs/operators";
import { WordmakerState } from "../../../core/wordmaker-selection/wordmaker-selection.model";
import { selectWordmaker } from "../../../core/wordmaker-selection/wordmaker-selection.selectors";
import { SettingsState, State } from "../../../core/settings/settings.model";
import { Store, select } from "@ngrx/store";
import { selectSettings } from "../../../core/settings/settings.selectors";
import { ConjugationService } from "../../../core/core.module";
import { TIERS } from "../../../../config/config";

@Component({
  selector: "ww-wordmaker-conj-step",
  templateUrl: "./wordmaker-conj-step.component.html",
  styleUrls: ["./wordmaker-conj-step.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WordmakerConjStepComponent implements OnDestroy, OnInit {
  settings$: Observable<SettingsState>;
  selection$: Observable<WordmakerState>;
  conjugation$: Observable<any>;
  unsubscribe$ = new Subject<void>();
  tiers = TIERS;
  constructor(
    private store: Store<State>,
    private conjugationService: ConjugationService
  ) {}

  ngOnInit(): void {
    this.settings$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectSettings)
    );
    this.selection$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectWordmaker)
    );
    this.conjugation$ = this.selection$.pipe(
      takeUntil(this.unsubscribe$),
      switchMap((selection) =>
        this.conjugationService.conjugations$.pipe(
          map((x) => this.conjugationService.filterConjugations(x, selection))
        )
      )
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
