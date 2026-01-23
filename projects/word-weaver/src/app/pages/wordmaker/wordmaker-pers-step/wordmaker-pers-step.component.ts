import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  PronounService,
  ValidationService,
  selectSettingsLanguage,
} from "../../../core/core.module";
import { Pronoun } from "../../../../config/config";
import { Observable, Subject } from "rxjs";
import {
  actionChangeAgent,
  actionChangePatient,
} from "../../../core/wordmaker-selection/wordmaker-selection.actions";
import {
  State,
  WordmakerState,
} from "../../../core/wordmaker-selection/wordmaker-selection.model";
import { Store, select } from "@ngrx/store";
import { selectWordmaker } from "../../../core/wordmaker-selection/wordmaker-selection.selectors";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "ww-wordmaker-pers-step",
  templateUrl: "./wordmaker-pers-step.component.html",
  styleUrls: ["./wordmaker-pers-step.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WordmakerPersStepComponent implements OnDestroy, OnInit {
  @Output() selectedAgent = new EventEmitter<Pronoun>();
  @Output() selectedPatient = new EventEmitter<Pronoun>();

  pronouns$: Observable<Pronoun[]>;
  selection$: Observable<WordmakerState>;
  unsubscribe$ = new Subject<void>();
  lang$ = this.store.pipe(
    takeUntil(this.unsubscribe$),
    select(selectSettingsLanguage)
  );
  constructor(
    private pronounService: PronounService,
    private store: Store<State>,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.pronouns$ = this.pronounService.pronouns$;
    this.selection$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectWordmaker)
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onAgentSelect(pn) {
    this.store.dispatch(actionChangeAgent({ agent: pn }));
    this.selectedAgent.emit(pn);
  }

  onPatientSelect(pn) {
    this.store.dispatch(actionChangePatient({ patient: pn }));
    this.selectedPatient.emit(pn);
  }
}
