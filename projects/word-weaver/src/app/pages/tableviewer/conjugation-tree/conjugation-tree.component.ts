import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { EChartsOption, EChartsType } from "echarts";
import { merge as _merge } from "lodash";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { EveryVoiceService } from "@everyvoice/every-voice";
import {
  Conjugation,
  ConjugationMorphemeNameIndex,
  Tier,
  TIERS,
} from "../../../../config/config";
import {
  OptionService,
  PronounService,
  VerbService,
} from "../../../core/core.module";
import { selectThemeColors } from "../../../core/settings/settings.selectors";
import { TableviewerState } from "../../../core/tableviewer-selection/tableviewer-selection.model";

@Component({
  selector: "ww-conjugation-tree",
  templateUrl: "./conjugation-tree.component.html",
  styleUrls: ["./conjugation-tree.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ConjugationTreeComponent implements OnDestroy, OnInit {
  @Input() data$: Observable<Partial<TableviewerState>>;

  options$: Observable<EChartsOption | boolean>;
  defaultChartOption: EChartsOption;
  defaultSeries: any;
  selection$: Observable<TableviewerState>;
  unsubscribe$ = new Subject<void>();
  constructor(
    private store: Store,
    private optionService: OptionService,
    private pronounService: PronounService,
    private verbService: VerbService,
    private translate: TranslateService,
    private tts: EveryVoiceService
  ) {}

  ngOnInit(): void {
    this.defaultChartOption = {
      tooltip: {
        show: false,
        trigger: "item",
        triggerOn: "mousemove",
      },
      toolbox: {
        feature: {
          saveAsImage: { title: "save", show: false },
        },
      },
      legend: {
        top: "2%",
        left: "3%",
        orient: "vertical",
        data: [],
        borderColor: "#c23531",
      },
      series: [],
    };
    this.defaultSeries = {
      type: "tree",
      name: "",
      data: [],
      top: "0%",
      left: "12%",
      bottom: "25%",
      right: "20%",
      symbolSize: 7,
      initialTreeDepth: 0,
      lineStyle: {
        color: "#fff",
      },
      label: {
        normal: {
          position: "bottom",
          verticalAlign: "middle",
          align: "middle",
          color: "#fff",
        },
      },
      itemStyle: {
        borderColor: "#fff",
      },
      leaves: {
        label: {
          normal: {
            position: "top",
            verticalAlign: "middle",
            align: "middle",
          },
        },
        itemStyle: {
          borderColor: "#fff",
        },
      },
      expandAndCollapse: true,
      roam: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
    };
    this.options$ = this.data$.pipe(
      takeUntil(this.unsubscribe$),
      switchMap((selection) => {
        if (selection && selection.conjugations.length > 0) {
          return this.store.pipe(
            takeUntil(this.unsubscribe$),
            select(selectThemeColors),
            map((color) =>
              this.createChartData(selection, {
                primary: this.rgbToHex(color.primary),
                accent: this.rgbToHex(color.accent),
              })
            )
          );
        } else {
          return of(false);
        }
      })
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  rgbToHex = (rgb) => {
    const pattern = /\d+/g;
    const matches = rgb.match(pattern).slice(0, 3);
    const hex = "#";
    const hexMatches = matches.map((match) => {
      match = Number(match);
      let matchHex = Number(match).toString(16);
      if (matchHex.length < 2) {
        matchHex = "0" + matchHex;
      }
      return matchHex;
    });
    return hex + hexMatches.join("");
  };

  onChartInit(ec: EChartsType): void {
    ec.on("click", (params) => {
      const nodeData: any = params.data;
      const isLeaf = !nodeData.children || nodeData.children.length === 0;

      if (isLeaf) {
        this.tts.playSound$(nodeData.name, nodeData.name).subscribe({
          complete: () => console.log("Playback completed"),
          error: (err) => console.error("Playback error:", err),
        });
      }
    });
  }

  createChartData(tvState: Partial<TableviewerState>, color) {
    const chartOption = Object.assign({}, this.defaultChartOption);
    // Initialize series each time
    chartOption.series = [];
    const conjugations = tvState.conjugations;
    const order = tvState.standardTreeOrder;
    const depth = tvState.treeDepth;
    const data = [];
    const rootNodes = [];
    let node;
    // Populate and merge object node
    conjugations.forEach((conjugation) => {
      const v = this.translate.instant(
        "ww-data.verbs." +
          this.verbService.getVerb(conjugation.input.root)["tag"]
      );
      const t = this.translate.instant(
        "ww-data.options.items." +
          this.optionService.getOption(conjugation.input["option"])["tag"]
      );
      let p = "";
      if ("agent" in conjugation.input) {
        p = this.translate.instant(
          "ww-data.pronouns.agents." +
            this.pronounService.getPronoun(conjugation.input.agent)["tag"]
        );
        if ("patient" in conjugation.input) {
          p += " → ";
          p += this.translate.instant(
            "ww-data.pronouns.patients." +
              this.pronounService.getPronoun(conjugation.input.patient)["tag"]
          );
        }
      } else if ("patient" in conjugation.input) {
        p = this.translate.instant(
          "ww-data.pronouns.agents." +
            this.pronounService.getPronoun(conjugation.input["patient"])["tag"]
        );
      }
      const val = this.returnTierValue(conjugation.output);
      if (order) {
        node = _merge(node, { [v]: { [t]: { [p]: val } } });
      } else {
        node = _merge(node, { [v]: { [p]: { [t]: val } } });
      }
    });

    // Recursively format to echart Data
    Object.keys(node).forEach((firstTier) => {
      rootNodes.push(firstTier);
      const firstNode = { name: firstTier, children: [] };
      Object.keys(node[firstTier]).forEach((secondTier) => {
        const secondNode = { name: secondTier, children: [] };
        Object.keys(node[firstTier][secondTier]).forEach((thirdTier) => {
          const thirdNode = {
            name: thirdTier,
            children: [{ name: node[firstTier][secondTier][thirdTier] }],
          };
          secondNode["children"].push(thirdNode);
        });
        firstNode["children"].push(secondNode);
      });
      data.push(firstNode);
    });
    let top = 0;
    let initialTreeDepth = 0;
    if (rootNodes.length < 2) {
      initialTreeDepth = depth;
    } else {
      rootNodes.forEach((v) => {
        chartOption.legend["data"].push(v);
      });
    }
    for (const dataPoint of data) {
      top += 20;
      const ser = Object.assign({}, this.defaultSeries);
      ser.name = dataPoint.name;
      ser.data = [dataPoint];
      ser.top = top.toString() + "%";
      ser.lineStyle.color = color.primary;
      ser.label.normal.color = color.primary;
      ser.leaves.itemStyle.borderColor = color.accent;
      ser.itemStyle.borderColor = color.accent;
      ser.initialTreeDepth = initialTreeDepth;
      chartOption.series.push(ser);
    }
    return chartOption;
  }

  returnTierValue(conjugation: Conjugation, tier: Tier = TIERS[0]) {
    return (
      conjugation
        // filter empty
        .filter((x) => x[tier.key])
        // sort by position
        .sort(
          (a, b) =>
            a[ConjugationMorphemeNameIndex.position] -
            b[ConjugationMorphemeNameIndex.position]
        )
        // create strings
        .map((x) => x[tier.key])
        // join 'em
        .join(tier.separator)
    );
  }
}
