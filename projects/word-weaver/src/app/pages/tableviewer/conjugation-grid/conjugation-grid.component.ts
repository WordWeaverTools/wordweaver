import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { Conjugations, Tier, TIERS } from "../../../../config/config";
import {
  OptionService,
  PronounService,
  VerbService,
} from "../../../core/core.module";
import { SettingsState, State } from "../../../core/settings/settings.model";
import { selectSettings } from "../../../core/settings/settings.selectors";
import { selectTableviewerGridSlice } from "../../../core/tableviewer-selection/tableviewer-selection.selectors";

export type GridOrderOptions = "root" | "pn" | "option";
export interface GridOrder {
  main: GridOrderOptions;
  row: GridOrderOptions;
  col: GridOrderOptions;
}

@Component({
  selector: "ww-conjugation-grid",
  templateUrl: "./conjugation-grid.component.html",
  styleUrls: ["./conjugation-grid.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConjugationGridComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @Input() data$;
  @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;

  keys = Object.keys;
  displayTier = TIERS[0];
  tiers$: Observable<Tier[]>;
  settings$: Observable<SettingsState>;
  dataSources: MatTableDataSource<Conjugations>[];
  uniqueCol: string[];
  uniqueMain: string[];
  displayedColumns: string[];
  unsubscribe$ = new Subject<void>();
  currentTab = 0;
  constructor(
    private store: Store<State>,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private optionService: OptionService,
    private pronounService: PronounService,
    private verbService: VerbService
  ) {}

  ngOnInit(): void {
    this.settings$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectSettings)
    );
    this.tiers$ = this.settings$.pipe(
      takeUntil(this.unsubscribe$),
      map((settings) => TIERS.filter((tier) => settings.level[tier.name]))
    );
    this.data$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((data) => {
        if (data) {
          this.uniqueCol = data.uniqueCol;
          this.uniqueMain = data.uniqueMain;
          this.dataSources = data.structuredData.map(() => {
            const dataSource = new MatTableDataSource<Conjugations>();
            return dataSource;
          });
          this.displayedColumns = ["placeholder", ...this.uniqueCol];
          this.cdr.detectChanges();
        }
      });
  }

  ngAfterViewInit(): void {
    this.data$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((data) => {
        console.log(data);
        if (data) {
          data.structuredData.forEach((x, i) => {
            this.dataSources[i].paginator = this.paginators.toArray()[i]; // Currently not working for n>1
            this.dataSources[i].data = x;
          });
          this.currentTab = 0;
        }
      });
  }

  getTranslation$(term, type) {
    return this.store.pipe(
      select(selectTableviewerGridSlice),
      takeUntil(this.unsubscribe$),
      map((gridState) => {
        if (gridState.gridOrder[type] === "root") {
          return this.translate.instant(
            "ww-data.verbs." + this.verbService.getVerb(term)["tag"]
          );
        } else if (gridState.gridOrder[type] === "pn") {
          const pnSplit = term.split("→");
          if (pnSplit.length === 2) {
            return (
              this.translate.instant(
                "ww-data.pronouns.agents." +
                  this.pronounService.getPronoun(pnSplit[0].trim())["tag"]
              ) +
              " → " +
              this.translate.instant(
                "ww-data.pronouns.patients." +
                  this.pronounService.getPronoun(pnSplit[1].trim())["tag"]
              )
            );
          } else {
            return this.translate.instant(
              "ww-data.pronouns.agents." +
                this.pronounService.getPronoun(term)["tag"]
            );
          }
        } else if (gridState.gridOrder[type] === "option") {
          return this.translate.instant(
            "ww-data.options.items." + this.optionService.getOption(term)["tag"]
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onTabChange(event) {
    this.currentTab = event.index;
  }
}
