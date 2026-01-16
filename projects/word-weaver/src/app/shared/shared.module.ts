import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { AuthButtonComponent } from "./auth/auth.component";
import { UserProfileComponent } from "./profile/profile.component";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
// import { MatDatepickerModule } from "@angular/material/datepicker";
// import { MatNativeDateModule } from "@angular/material/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
// import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { EveryVoiceModule } from "@everyvoice/every-voice";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
// import { MatDividerModule } from "@angular/material/divider";
// import { MatSliderModule } from "@angular/material/slider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
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
