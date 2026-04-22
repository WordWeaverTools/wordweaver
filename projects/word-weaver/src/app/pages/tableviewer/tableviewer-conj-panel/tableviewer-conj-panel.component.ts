import { Clipboard } from "@angular/cdk/clipboard";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { saveAs } from "file-saver-es";
import { FormControl } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { marker } from "@colsen1991/ngx-translate-extract-marker";
import { select, Store } from "@ngrx/store";
import { EChartsOption } from "echarts";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, from, of, Observable, Subject, zip } from "rxjs";
import { map, switchMap, take, takeUntil } from "rxjs/operators";
import {
  ConjugationService,
  NotificationService,
  ROUTE_ANIMATIONS_ELEMENTS,
} from "../../../core/core.module";
import { actionSettingsChangeThemeColors } from "../../../core/settings/settings.actions";
import { SettingsState, State } from "../../../core/settings/settings.model";
import { selectSettings } from "../../../core/settings/settings.selectors";
import {
  actionChangeGridOrder,
  actionChangeTreeViewDepth,
  actionConjugationEvent,
  actionToggleTreeViewOrder,
} from "../../../core/tableviewer-selection/tableviewer-selection.actions";
import { TableviewerState } from "../../../core/tableviewer-selection/tableviewer-selection.model";
import {
  selectTableviewer,
  selectTableviewerGridSlice,
  selectTableviewerListSlice,
  selectTableViewerLoading,
  selectTableviewerTreeSlice,
} from "../../../core/tableviewer-selection/tableviewer-selection.selectors";
import { TableViewerDialogComponent } from "../../../shared/tableviewer-dialog/tableviewer-dialog.component";
import { GridOrderOptions } from "../conjugation-grid/conjugation-grid.component";
import { environment } from "../../../../environments/environment";
import {
  AlignmentType,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { utils, write } from "xlsx";

@Component({
  selector: "ww-tableviewer-conj-panel",
  templateUrl: "./tableviewer-conj-panel.component.html",
  styleUrls: ["./tableviewer-conj-panel.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableviewerConjPanelComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  // Elements
  @ViewChild("header") header;
  @ViewChild("conjugate") conjugateBtn;
  // Basic config
  settings$: Observable<SettingsState>;
  selection$: Observable<TableviewerState>;
  gridDataState$: Observable<Partial<TableviewerState>>;
  listDataState$: Observable<Partial<TableviewerState>>;
  treeDataState$: Observable<Partial<TableviewerState>>;
  showDelay = new FormControl(600);
  hideDelay = new FormControl(200);
  tooltipPosition = "above";
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  // Non-reactive states
  loading$: Observable<boolean>;
  showToolbar = true;
  // Reactive conjugation triggers
  showExplorer$ = new BehaviorSubject<boolean>(false);
  manualConjugation$ = new Subject<any>();
  order$ = new BehaviorSubject<boolean>(true);
  depth$ = new BehaviorSubject<number>(1);
  conjugationTrigger$: Observable<any>;
  chartResponse$: Observable<EChartsOption | any>;
  gridData$: Observable<any>;
  listData$: Observable<any>;
  treeData$: Observable<any>;
  tiers = environment.config.tiers;
  unsubscribe$ = new Subject<void>();
  constructor(
    private store: Store<State>,
    private notificationService: NotificationService,
    private conjugationService: ConjugationService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    // populate with store's selection
    this.settings$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectSettings)
    );
    this.selection$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectTableviewer)
    );
    this.listDataState$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectTableviewerListSlice)
    );
    this.gridDataState$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectTableviewerGridSlice)
    );
    this.treeDataState$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectTableviewerTreeSlice)
    );
    this.loading$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectTableViewerLoading)
    );

    this.gridData$ = this.gridDataState$.pipe(
      takeUntil(this.unsubscribe$),
      map((gridState) => {
        if (gridState.view === "grid" && gridState.conjugations.length > 0) {
          return this.conjugationService.restructureData(
            gridState.conjugations,
            gridState.gridOrder
          );
        } else {
          return false;
        }
      })
    );

    this.listData$ = this.listDataState$.pipe(
      takeUntil(this.unsubscribe$),
      map((listState) => {
        if (listState.view === "list" && listState.conjugations.length > 0) {
          return listState.conjugations;
        } else {
          return false;
        }
      })
    );

    this.treeData$ = this.treeDataState$.pipe(
      takeUntil(this.unsubscribe$),
      map((treeState) => {
        const conjugationsLength = treeState.conjugations.length;
        if (treeState.view === "tree" && conjugationsLength > 0) {
          if (conjugationsLength > 50) {
            this.notificationService.translated(
              marker(
                "ww.pages.tableviewer.notifications.treeviewer-length.error"
              ),
              { value: conjugationsLength },
              "error"
            );
          }
          return treeState;
        } else {
          return false;
        }
      })
    );
  }

  ngAfterViewInit() {
    // Extremely hacky way of getting ngx-echarts to style graph nodes and edges properly with themes.
    // This should be changed once ngx-echarts is updated to handle this internally.
    const primary = getComputedStyle(
      this.header.nativeElement
    ).getPropertyValue("color");
    const accent = getComputedStyle(
      this.conjugateBtn._elementRef.nativeElement
    ).getPropertyValue("background-color");
    this.store.dispatch(actionSettingsChangeThemeColors({ primary, accent }));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onChangeTreeDepth(event) {
    this.store.dispatch(actionChangeTreeViewDepth({ treeDepth: event.value }));
  }

  onToggleTreeOrder() {
    this.store.dispatch(
      actionToggleTreeViewOrder({ name: "standardTreeOrder" })
    );
  }

  onSwapGridOrder(row: GridOrderOptions, col: GridOrderOptions) {
    this.gridData$.pipe(take(1)).subscribe((gridData) => {
      if (gridData.uniqueRow.length > 80) {
        this.notificationService.translated(
          marker("ww.pages.tableviewer.notifications.gridOrder.limit-error"),
          { value: gridData.uniqueRow.length },
          "error"
        );
      } else {
        this.store.dispatch(
          actionChangeGridOrder({
            name: "gridOrder",
            partial: {
              col: row,
              row: col,
            },
          })
        );
      }
    });
  }

  onManualConjugation(event) {
    this.store.dispatch(actionConjugationEvent(event));
  }

  showSettings() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "30vw";
    this.dialog.open(TableViewerDialogComponent, dialogConfig);
  }

  translateDataForGrid(data, gridState, dataType: "col" | "row" = "row") {
    return data.map((rowOrCol) => {
      if (gridState.gridOrder[dataType] === "option") {
        return this.translate.instant("ww-data.options.items." + rowOrCol);
      } else if (gridState.gridOrder[dataType] === "pn") {
        if (rowOrCol.indexOf("→") > -1) {
          const pns = rowOrCol.split("→");
          return (
            this.translate.instant("ww-data.pronouns.agents." + pns[0].trim()) +
            " → " +
            this.translate.instant("ww-data.pronouns.patients." + pns[1].trim())
          );
        } else {
          return this.translate.instant("ww-data.pronouns.agents." + rowOrCol);
        }
      }
    });
  }

  download() {
    this.selection$
      .pipe(
        take(1),
        switchMap((selection) => {
          let data;
          if (selection.view === "grid") {
            data = this.gridData$;
          } else if (selection.view === "list") {
            data = this.listData$;
          } else {
            throw new Error("Proper view not selected for download");
          }
          return zip(of(selection.view), data);
        }),
        switchMap((downloadData) => {
          const view = downloadData[0];
          const data: any = downloadData[1];
          // If grid view, export an xlsx file
          if (view === "grid") {
            return this.store.pipe(
              select(selectTableviewerGridSlice),
              take(1),
              switchMap((gridState) => {
                // Create a new workbook
                const wb = utils.book_new();
                // Translate Columns synchronously
                const translatedCols = this.translateDataForGrid(
                  data["uniqueCol"],
                  gridState,
                  "col"
                );
                // Translate Rows synchronously
                const translatedRows = this.translateDataForGrid(
                  data["uniqueRow"],
                  gridState,
                  "row"
                );
                // Translate Verbs synchronously
                const translatedVerbs = data["uniqueMain"].map((verb) =>
                  this.translate.instant("ww-data.verbs." + verb)
                );
                // Iterate through each verb
                translatedVerbs.forEach((verb: any, verbIndex) => {
                  // Create the columns
                  const ws = utils.aoa_to_sheet([["", ...translatedCols]]);
                  // Add the data by joining the first tier only. multi-tier outputs are not supported in grid view.
                  const tier = this.tiers[0];
                  // for each row
                  const formattedData = translatedRows.map((row, rowIndex) => [
                    // the first item is the row 'header'
                    row,
                    // subsequent row values are equal to joining each conjugation 'morpheme' by the tier-0 separator
                    ...data["uniqueCol"].map((col: any) => {
                      if (col in data["structuredData"][verbIndex][rowIndex]) {
                        return [
                          data["structuredData"][verbIndex][rowIndex][col][
                            "output"
                          ]
                            .map((morpheme) => morpheme[tier.key])
                            .join(tier["separator"]),
                        ];
                      } else {
                        return [];
                      }
                    }),
                  ]);
                  // Append the data onto the worksheet
                  utils.sheet_add_aoa(ws, formattedData, { origin: "A2" });
                  // Append the worksheet labelled by the verb onto the workbook
                  utils.book_append_sheet(wb, ws, verb);
                });
                const wbout = write(wb, { bookType: "xlsx", type: "array" });
                // return a zip including the xlsx blob
                return zip(
                  of(view),
                  of(
                    new Blob([new Uint8Array(wbout)], {
                      type: "application/octet-stream",
                    })
                  )
                );
              })
            );
            // Else if list view, export a docx file
          } else if (view === "list") {
            const content = [];
            const emptyParagraph = new Paragraph({ children: [] });
            data.forEach((conjugation) => {
              this.tiers.forEach((tier, index) => {
                content.push(
                  // Create custom indent strategy - first tier is numbered and subsequent tiers are indented
                  new Paragraph({
                    indent: index === 0 ? null : { left: 720 },
                    numbering:
                      index === 0
                        ? { reference: "custom-numbering", level: 0 }
                        : null,
                    children: [
                      new TextRun({
                        text: conjugation["output"]
                          // filter empty morphemes
                          .filter((morpheme) => morpheme[tier.key])
                          // join morphemes by the tier-declared separator
                          .map((morpheme) => morpheme[tier.key])
                          .join(tier.separator),
                        bold: index === 0,
                      }),
                    ],
                  })
                );
              });
              // Add empty paragraph for new line
              content.push(emptyParagraph);
            });
            const doc = new Document({
              numbering: {
                config: [
                  {
                    reference: "custom-numbering",
                    levels: [
                      {
                        level: 0,
                        format: LevelFormat.DECIMAL,
                        text: "%1.",
                        alignment: AlignmentType.START,
                        style: {
                          paragraph: {
                            indent: { left: 720, hanging: 720 },
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              sections: [{ children: content }],
            });
            return zip(of(view), from(Packer.toBlob(doc)));
          }
        })
      )
      .subscribe(
        (response) => {
          if (response[0] === "list") {
            saveAs(response[1], "conjugations.docx");
          } else if (response[0] === "grid") {
            saveAs(response[1], "conjugations.xlsx");
          }
        },
        (error) => {
          throw error;
        }
      );
  }

  copyLink() {
    this.selection$.pipe(take(1)).subscribe((selection) => {
      const params = this.conjugationService.createRequestQueryArgs(selection);
      // Add other relevant params
      params.append("view", selection["view"]);
      params.append("depth", selection["treeDepth"].toString());
      params.append(
        "grid-order",
        [
          selection["gridOrder"]["main"],
          selection["gridOrder"]["row"],
          selection["gridOrder"]["col"],
        ].join(",")
      );
      const result = this.clipboard.copy(
        window["location"]["href"].split("?")[0] + "?" + params.toString()
      );
      if (result) {
        this.notificationService.translated(
          marker("ww.pages.tableviewer.notifications.copy.success"),
          {},
          "success"
        );
      } else {
        this.notificationService.translated(
          marker("ww.pages.tableviewer.notifications.copy.error"),
          {},
          "error"
        );
      }
    });
  }

  updateToast(success?, code = 200) {
    if (success) {
      this.notificationService.translated(
        marker("ww.pages.tableviewer.notifications.download.success"),
        {},
        "success"
      );
    } else {
      this.notificationService.translated(
        marker("ww.pages.tableviewer.notifications.download.error"),
        {},
        "error"
      );
    }
  }
}
