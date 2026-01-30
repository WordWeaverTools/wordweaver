import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Option, TIERS } from "../../../../config/config";
import {
  OptionService,
  ConjugationService,
  selectSettingsLanguage,
} from "../../../core/core.module";
import { Observable, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { actionChangeOption } from "../../../core/wordmaker-selection/wordmaker-selection.actions";
import {
  WordmakerState,
  State,
} from "../../../core/wordmaker-selection/wordmaker-selection.model";
import { selectWordmaker } from "../../../core/wordmaker-selection/wordmaker-selection.selectors";
import { META_DATA } from "../../../../config/config";
import { OptionsByType } from "../../../core/option/option.service";

@Component({
  selector: "ww-wordmaker-temp-step",
  templateUrl: "./wordmaker-temp-step.component.html",
  styleUrls: ["./wordmaker-temp-step.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WordmakerTempStepComponent implements OnDestroy, OnInit {
  @Output() selectedTemp = new EventEmitter<Option>();

  selection$: Observable<WordmakerState>;
  unsubscribe$ = new Subject<void>();
  conjugatedOptions$: Observable<any>;
  possibleOptions$: Observable<Option[]>;
  possibleOptionsByType$: Observable<OptionsByType[]>;
  displayTier: string = META_DATA.wordmaker.tempView;
  lang$ = this.store.pipe(
    takeUntil(this.unsubscribe$),
    select(selectSettingsLanguage)
  );
  constructor(
    public optionService: OptionService,
    private store: Store<State>,
    private conjugationService: ConjugationService
  ) {}

  ngOnInit(): void {
    this.selection$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectWordmaker)
    );
    this.possibleOptions$ = this.optionService.options$.pipe(
      takeUntil(this.unsubscribe$)
    );
    this.possibleOptionsByType$ = this.optionService.optionsByType$.pipe(
      takeUntil(this.unsubscribe$)
    );
    this.conjugatedOptions$ = this.selection$.pipe(
      takeUntil(this.unsubscribe$),
      // See all options, despite selection
      map((selection) => {
        const newSelection = { ...selection, ...{ option: null } };
        return newSelection;
      }),
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

  returnOptionTierFromName() {
    const selectedTier = TIERS.filter((x) => x.name === this.displayTier);
    return selectedTier[0];
  }

  onAffOptSelect(ao) {
    this.store.dispatch(actionChangeOption({ option: ao }));
    this.selectedTemp.emit(ao);
  }

  onChipClick(tag) {
    this.returnAffoptFromTag$(tag).subscribe((t) => {
      this.onAffOptSelect(t);
    });
  }

  returnAffoptFromTag$(tag) {
    return this.optionService.options$.pipe(
      map((affopts) => {
        const pickedAffixOption = affopts.filter((ao) => ao["tag"] === tag)[0];
        return pickedAffixOption;
      })
    );
  }

  returnAffoptFromGloss$(gloss) {
    return this.optionService.options$.pipe(
      map((affopts) => {
        const pickedAffixOption = affopts.filter(
          (ao) => ao["gloss"] === gloss
        )[0];
        return pickedAffixOption;
      })
    );
  }
}
