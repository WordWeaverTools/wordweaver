import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";
import { take } from "rxjs/operators";
import { TableviewerViewModes } from "../../../../config/config";
import {
  OptionService,
  PronounService,
  VerbService,
} from "../../../core/core.module";
import {
  actionChangeAgents,
  actionChangeGridOrder,
  actionChangeOptions,
  actionChangePatients,
  actionChangeTreeViewDepth,
  actionChangeVerbs,
  actionChangeViewMode,
  actionConjugationEvent,
} from "../../../core/tableviewer-selection/tableviewer-selection.actions";
import { TableviewerTreeDepth } from "../../../core/tableviewer-selection/tableviewer-selection.model";
import { GridOrderOptions } from "../conjugation-grid/conjugation-grid.component";

@Component({
  selector: "ww-tableviewer",
  templateUrl: "./tableviewer.component.html",
  styleUrls: ["./tableviewer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TableviewerComponent implements OnInit {
  @ViewChild("conjPanel") conjPanel;
  cols: number;
  rows: number;
  conjrowspan: number;
  conjcolspan: number;
  quarterrowspan: number;
  halfrowspan: number;
  fullrowspan: number;
  breakpoint = 1100;
  useTestAPI = false;
  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     this.conjPanel.conjugate();
  //   }
  // }
  constructor(
    private optionService: OptionService,
    private pronounService: PronounService,
    private route: ActivatedRoute,
    private store: Store,
    private verbService: VerbService
  ) {
    // CombineLatest to avoid race condition between pronoun, verb and options services and query params
    // This initializes the view from query params
    combineLatest([
      this.pronounService.pronouns$,
      this.verbService.verbs$,
      this.optionService.options$,
      this.route.queryParams.pipe(take(1)),
    ])
      .pipe(take(1))
      .subscribe((value) => {
        const params = value[3];
        if (params) {
          if ("agent" in params) {
            const agents = this.paramToArray(params.agent);
            this.store.dispatch(
              actionChangeAgents({
                agent: agents
                  .map((x) => this.pronounService.getPronoun(x))
                  .filter((x) => x),
              })
            );
          }
          if ("patient" in params) {
            const patients = this.paramToArray(params.patient);
            this.store.dispatch(
              actionChangePatients({
                patient: patients
                  .map((x) => this.pronounService.getPronoun(x))
                  .filter((x) => x),
              })
            );
          }
          if ("option" in params) {
            const options = this.paramToArray(params.option);
            this.store.dispatch(
              actionChangeOptions({
                option: options
                  .map((x) => this.optionService.getOption(x))
                  .filter((x) => x),
              })
            );
          }
          if ("root" in params) {
            const roots = this.paramToArray(params.root);
            this.store.dispatch(
              actionChangeVerbs({
                root: roots
                  .map((x) => this.verbService.getVerb(x))
                  .filter((x) => x),
              })
            );
          }
          if ("view" in params) {
            const viewMode: TableviewerViewModes = this.pluckFirstParam(
              params.view
            );
            console.log(viewMode);
            this.store.dispatch(
              actionChangeViewMode({
                view: viewMode,
              })
            );
          }
          if ("depth" in params) {
            const treeDepth: TableviewerTreeDepth = this.pluckFirstParam(
              params.depth
            );
            this.store.dispatch(
              actionChangeTreeViewDepth({
                treeDepth,
              })
            );
          }
          if ("grid-order" in params) {
            const gridOrder: GridOrderOptions[] = this.processGridParam(
              params["grid-order"]
            );
            this.store.dispatch(
              actionChangeGridOrder({
                name: "gridOrder",
                partial: {
                  main: gridOrder[0],
                  row: gridOrder[1],
                  col: gridOrder[2],
                },
              })
            );
          }
        }
        if (Object.keys(params).length > 0) {
          this.store.dispatch(actionConjugationEvent({ eventType: "query" }));
        }
      });
  }

  ngOnInit() {
    this.cols = window.innerWidth <= this.breakpoint ? 3 : 12;
    this.rows = window.innerWidth <= this.breakpoint ? 1 : 5;
    this.conjcolspan = window.innerWidth <= this.breakpoint ? 3 : 9;
    this.conjrowspan = window.innerWidth <= this.breakpoint ? 3 : 5;
  }

  onResize(event) {
    this.cols = event.target.innerWidth <= this.breakpoint ? 3 : 12;
    this.rows = window.innerWidth <= this.breakpoint ? 1 : 5;
    this.conjcolspan = window.innerWidth <= this.breakpoint ? 3 : 9;
    this.conjrowspan = window.innerWidth <= this.breakpoint ? 3 : 5;
  }

  processGridParam(param): GridOrderOptions[] {
    if (Array.isArray(param)) {
      param = param[0];
    }
    param = param.split(",");
    return param;
  }

  paramToArray(param) {
    if (!Array.isArray(param)) {
      return [param];
    } else {
      return param;
    }
  }

  pluckFirstParam(param) {
    if (Array.isArray(param)) {
      return param[0];
    } else {
      return param;
    }
  }

  conjugate() {
    this.conjPanel.conjugate();
  }
}
