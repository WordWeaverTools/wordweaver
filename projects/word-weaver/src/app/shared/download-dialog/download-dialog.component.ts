import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { marker } from "@colsen1991/ngx-translate-extract-marker";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { saveAs } from "file-saver-es";
import { combineLatest, Observable, of } from "rxjs";
import { catchError, map, switchMap, take } from "rxjs/operators";
import { TIERS } from "../../../config/config";
import {
  ConjugationService,
  NotificationService,
} from "../../core/core.module";
import { selectTableviewerState } from "../../core/core.state";
import { actionSettingsChangeLevel } from "../../core/settings/settings.actions";
import { SettingsState, State } from "../../core/settings/settings.model";
import { selectSettings } from "../../core/settings/settings.selectors";
import { actionChangeLoading } from "../../core/tableviewer-selection/tableviewer-selection.actions";
import { TableviewerState } from "../../core/tableviewer-selection/tableviewer-selection.model";

@Component({
  selector: "ww-download-dialog",
  templateUrl: "./download-dialog.component.html",
  styleUrls: ["./download-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadDialogComponent implements OnInit {
  objectkeys = Object.keys;
  settings$: Observable<SettingsState>;
  selection$: Observable<TableviewerState>;
  selectionAndSettings$: Observable<[TableviewerState, SettingsState]>;
  fileTypes = {
    list: ["docx"],
    grid: ["xlsx"],
  };
  fileTypes$: Observable<string[]>;
  showDelay = new FormControl(600);
  hideDelay = new FormControl(200);
  tooltipPosition = "above";
  form: FormGroup = new FormGroup({
    ftype: new FormControl("csv", [Validators.required]),
    headers: new FormControl(false),
    heading: new FormControl(""),
  });
  constructor(
    private dialogRef: MatDialogRef<DownloadDialogComponent>,
    private store: Store<State>,
    private http: HttpClient,
    private notificationService: NotificationService,
    private conjugationService: ConjugationService,
    private translate: TranslateService
  ) {
    this.translate
      .get(
        marker(
          "ww.pages.tableviewer.dialog.download.settings.heading.placeholder"
        )
      )
      .subscribe((x) => this.form.controls.heading.setValue(x));
  }

  ngOnInit(): void {
    this.selection$ = this.store.pipe(select(selectTableviewerState));
    this.settings$ = this.store.pipe(select(selectSettings));
    this.selectionAndSettings$ = combineLatest([
      this.selection$,
      this.settings$,
    ]);
    this.fileTypes$ = this.selection$.pipe(
      map((selection) => this.fileTypes[selection.view])
    );
  }

  onLevelSelect({ checked }, key: string) {
    this.store.dispatch(actionSettingsChangeLevel({ checked, key }));
  }

  download() {
    this.selectionAndSettings$
      .pipe(
        take(1),
        switchMap(([selection, appSettings]) => {
          const queryArgs =
            this.conjugationService.createRequestQueryArgs(selection);
          if (queryArgs) {
            this.store.dispatch(actionChangeLoading({ loading: true }));
            const tiers = TIERS.filter((x) => appSettings.level[x.name]);
            const settings = {
              heading: this.form.controls.heading.value,
              headers: this.form.controls.headers.value,
            };
            return this.http
              .post(
                appSettings?.baseUrl +
                  `files?file-type=${this.form.controls.ftype.value}&` +
                  queryArgs.toString(),
                { tiers, settings },
                { responseType: "blob" }
              )
              .pipe(
                catchError((err) => {
                  this.notificationService.translated(
                    marker("ww.pages.tableviewer.notifications.download.error"),
                    {},
                    "error"
                  );
                  return of(err);
                })
              );
          }
        })
      )
      .subscribe((x: Blob) => {
        saveAs(x, `conjugations.${this.form.controls.ftype.value}`);
        this.store.dispatch(actionChangeLoading({ loading: false }));
      });
  }

  exit() {
    this.dialogRef.close();
  }
}
