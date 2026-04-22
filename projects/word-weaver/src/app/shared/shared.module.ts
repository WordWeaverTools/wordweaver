import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { AuthButtonComponent } from "./auth/auth.component";
import { UserProfileComponent } from "./profile/profile.component";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatExpansionModule } from "@angular/material/expansion";
// import { MatDatepickerModule } from "@angular/material/datepicker";
// import { MatNativeDateModule } from "@angular/material/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
// import { MatTabsModule } from "@angular/material/tabs";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import {
  MatLegacyPaginatorIntl as MatPaginatorIntl,
  MatLegacyPaginatorModule as MatPaginatorModule,
} from "@angular/material/legacy-paginator";
import { EveryVoiceModule } from "@everyvoice/every-voice";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacyRadioModule as MatRadioModule } from "@angular/material/legacy-radio";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { MatLegacySliderModule as MatSliderModule } from "@angular/material/legacy-slider";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
// import { MatDividerModule } from "@angular/material/divider";
// import { MatSliderModule } from "@angular/material/slider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import {
  FaIconLibrary,
  FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";
import {
  faFacebook,
  faGithub,
  faMediumM,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBook,
  faCaretDown,
  faCaretUp,
  faCheck,
  faEdit,
  faExclamationTriangle,
  faFilter,
  faHome,
  faKeyboard,
  faLanguage,
  faLightbulb,
  faMusic,
  faPaintBrush,
  faPlus,
  faSquare,
  faStream,
  faTasks,
  faTimes,
  faTrash,
  faWindowMaximize,
} from "@fortawesome/free-solid-svg-icons";
import {
  TranslateModule,
  TranslateParser,
  TranslateService,
} from "@ngx-translate/core";
import { NgxEchartsModule } from "ngx-echarts";
import { DownloadDialogComponent } from "./download-dialog/download-dialog.component";
import { LogoComponent } from "./logo/logo.component";
import { createCustomMatPaginatorIntl } from "./mat.paginator.i18n";
import { AnimateOnlyPipe } from "./pipes/animate-only/animate-only";
import { CapitalizePipe } from "./pipes/capitalize/capitalize";
import { DecapitalizePipe } from "./pipes/decapitalize/decapitalize";
import { RtlSupportDirective } from "./rtl-support/rtl-support.directive";
import { TableViewerDialogComponent } from "./tableviewer-dialog/tableviewer-dialog.component";
import { TierComponent } from "./tier/tier.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    // TTS support using the EveryVoice Angular module
    EveryVoiceModule.forChild(),
    MatButtonModule,
    MatButtonToggleModule,
    MatSelectModule,
    // MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatRadioModule,
    MatTabsModule,
    MatSliderModule,
    // MatDividerModule,
    MatTableModule,
    MatExpansionModule,
    MatPaginatorModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    FontAwesomeModule,
    ClipboardModule,
  ],
  declarations: [
    AuthButtonComponent,
    UserProfileComponent,
    LogoComponent,
    RtlSupportDirective,
    AnimateOnlyPipe,
    CapitalizePipe,
    DecapitalizePipe,
    DownloadDialogComponent,
    TableViewerDialogComponent,
    TierComponent,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      deps: [TranslateService, TranslateParser],
      useFactory: createCustomMatPaginatorIntl,
    },
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TranslateModule,

    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    // MatTabsModule,
    MatChipsModule,
    MatGridListModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatRadioModule,
    // MatDividerModule,
    // MatSliderModule,
    MatToolbarModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSliderModule,
    FontAwesomeModule,
    MatExpansionModule,
    ClipboardModule,

    DownloadDialogComponent,
    TableViewerDialogComponent,
    LogoComponent,
    TierComponent,
    RtlSupportDirective,

    AnimateOnlyPipe,
    CapitalizePipe,
    DecapitalizePipe,
  ],
})
export class SharedModule {
  constructor(faIconLibrary: FaIconLibrary) {
    faIconLibrary.addIcons(
      faGithub,
      faMediumM,
      faFacebook,
      faYoutube,
      faPlus,
      faEdit,
      faTrash,
      faHome,
      faTimes,
      faCaretUp,
      faCaretDown,
      faExclamationTriangle,
      faFilter,
      faTasks,
      faCheck,
      faMusic,
      faSquare,
      faLanguage,
      faPaintBrush,
      faLightbulb,
      faKeyboard,
      faWindowMaximize,
      faStream,
      faBook
    );
  }
}
