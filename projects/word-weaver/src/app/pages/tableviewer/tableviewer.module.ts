import { NgModule } from "@angular/core";
import { NgxEchartsModule } from "ngx-echarts";
import { SharedModule } from "../../shared/shared.module";
import { ConjugationGridComponent } from "./conjugation-grid/conjugation-grid.component";
import { ConjugationListComponent } from "./conjugation-list/conjugation-list.component";
import { ConjugationTreeComponent } from "./conjugation-tree/conjugation-tree.component";
import { TableviewerConjPanelComponent } from "./tableviewer-conj-panel/tableviewer-conj-panel.component";
import { TableviewerPersPanelComponent } from "./tableviewer-pers-panel/tableviewer-pers-panel.component";
import { TableviewerRoutingModule } from "./tableviewer-routing.module";
import { TableviewerTempPanelComponent } from "./tableviewer-temp-panel/tableviewer-temp-panel.component";
import { TableviewerVerbPanelComponent } from "./tableviewer-verb-panel/tableviewer-verb-panel.component";
import { TableviewerComponent } from "./tableviewer/tableviewer.component";

@NgModule({
  declarations: [
    TableviewerComponent,
    TableviewerConjPanelComponent,
    TableviewerPersPanelComponent,
    TableviewerTempPanelComponent,
    TableviewerVerbPanelComponent,
    ConjugationTreeComponent,
    ConjugationGridComponent,
    ConjugationListComponent,
  ],
  imports: [
    SharedModule,
    TableviewerRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts/index.common"),
    }),
  ],
})
export class TableviewerModule {}
