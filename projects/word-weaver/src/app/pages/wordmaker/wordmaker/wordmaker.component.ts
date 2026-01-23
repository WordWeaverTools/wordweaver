import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from "@angular/core";
import { ValidationService } from "../../../core/core.module";
import { BehaviorSubject, Observable, Subject, zip } from "rxjs";
import { selectWordmaker } from "../../../core/wordmaker-selection/wordmaker-selection.selectors";
import {
  WordmakerState,
  State,
} from "../../../core/wordmaker-selection/wordmaker-selection.model";
import { Store, select } from "@ngrx/store";
import { marker } from "@colsen1991/ngx-translate-extract-marker";
import { actionChangeStep } from "../../../core/wordmaker-selection/wordmaker-selection.actions";
import { distinctUntilKeyChanged, take, takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "ww-wordmaker",
  templateUrl: "./wordmaker.component.html",
  styleUrls: ["./wordmaker.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WordmakerComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild("stepper") private stepper;

  loading;
  isLinear = true;
  verbLabel = new BehaviorSubject<string>(
    marker("ww.pages.wordmaker.steps.verb.question")
  );
  persLabel = new BehaviorSubject<string>(
    marker("ww.pages.wordmaker.steps.pers.question")
  );
  tempLabel = new BehaviorSubject<string>(
    marker("ww.pages.wordmaker.steps.temp.question")
  );
  selection$: Observable<WordmakerState>;
  unsubscribe$ = new Subject<void>();
  constructor(
    private store: Store<State>,
    private validationService: ValidationService,
    private translationService: TranslateService
  ) {}
  ngOnInit(): void {
    this.selection$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectWordmaker)
    );
    // Step 1: Labels
    this.selection$.subscribe((x) => {
      if (x.root) {
        this.verbLabel.next("ww-data.verbs." + x.root.tag);
      } else {
        this.verbLabel.next("ww.pages.wordmaker.steps.verb.question");
      }
      // TODO: This needs to be refactored to be language agnostic
      if (x.agent || x.patient) {
        let label = "";
        if (x.agent && x.patient) {
          zip(
            this.translationService.get(
              "ww-data.pronouns.agents." + x.agent.tag
            ),
            this.translationService.get(
              "ww-data.pronouns.patients." + x.patient.tag
            )
          )
            .pipe(take(1))
            .subscribe(([optType, optItem]) =>
              this.persLabel.next(optType + " → " + optItem)
            );
        } else {
          if (x.agent) {
            label = "ww-data.pronouns.agents." + x.agent.tag;
          } else if (x.patient) {
            label = "ww-data.pronouns.patients." + x.patient.tag;
          } else {
            label = "ww.pages.wordmaker.steps.pers.question";
          }
          this.persLabel.next(label);
        }
      } else {
        this.persLabel.next("ww.pages.wordmaker.steps.pers.question");
      }
      if (x.option) {
        if ("type" in x.option) {
          zip(
            this.translationService.get(
              "ww-data.options.types." + x.option.type
            ),
            this.translationService.get(
              "ww-data.options.items." + x.option["tag"]
            )
          )
            .pipe(take(1))
            .subscribe(([optType, optItem]) =>
              this.tempLabel.next(optType + " - " + optItem)
            );
        } else {
          this.translationService
            .get("ww-data.options.items." + x.option["tag"])
            .pipe(take(1))
            .subscribe((opt) => this.tempLabel.next(opt));
        }
      } else {
        this.tempLabel.next("ww.pages.wordmaker.steps.temp.question");
      }
    });
  }

  onStepChange(s) {
    this.store.dispatch(actionChangeStep({ step: s }));
  }

  ngAfterViewInit() {
    this.stepper.selectionChange
      .pipe(
        takeUntil(this.unsubscribe$),
        distinctUntilKeyChanged("selectedIndex")
      )
      .subscribe((x) => this.onStepChange(x.selectedIndex));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  randomX(x) {
    return x[Math.floor(Math.random() * (x.length - 1) + 1)];
  }

  onVerbSelect($event) {
    this.stepper.next(1);
  }

  onPatientSelect($event) {
    this.selection$.pipe(take(1)).subscribe((selection) => {
      if (
        this.validationService.validate(
          "validation",
          "selection",
          "patients",
          selection
        )
      ) {
        this.stepper.next();
      }
    });
  }

  onAgentSelect($event) {
    this.selection$.pipe(take(1)).subscribe((selection) => {
      if (
        this.validationService.validate(
          "validation",
          "selection",
          "agents",
          selection
        )
      ) {
        this.stepper.next();
      }
    });
  }

  onTempSelect($event) {
    this.stepper.next();
  }
}
