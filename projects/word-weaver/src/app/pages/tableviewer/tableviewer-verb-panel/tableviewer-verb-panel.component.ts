import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { debounceTime, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { Verb } from "../../../../config/config";
import { selectSettingsLanguage, VerbService } from "../../../core/core.module";
import { actionChangeVerbs } from "../../../core/tableviewer-selection/tableviewer-selection.actions";
import { State } from "../../../core/tableviewer-selection/tableviewer-selection.model";
import { selectTableViewerRoot } from "../../../core/tableviewer-selection/tableviewer-selection.selectors";

@Component({
  selector: "ww-tableviewer-verb-panel",
  templateUrl: "./tableviewer-verb-panel.component.html",
  styleUrls: ["./tableviewer-verb-panel.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TableviewerVerbPanelComponent implements OnDestroy, OnInit {
  verbs$: Observable<Verb[]> = this.verbService.verbs$;
  checkboxGroup: FormGroup = new FormGroup({});
  viewableVerbs$: Observable<Verb[]>;
  selection$: Observable<Verb[]>;
  searchField: FormControl;
  verbForm: FormGroup;
  unsubscribe$ = new Subject<void>();
  lang$ = this.store.pipe(
    takeUntil(this.unsubscribe$),
    select(selectSettingsLanguage)
  );
  constructor(
    private translate: TranslateService,
    public verbService: VerbService,
    private fb: FormBuilder,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.searchField = new FormControl();
    this.verbForm = this.fb.group({ search: this.searchField });
    // Get Verbs
    this.verbs$
      .pipe(
        takeUntil(this.unsubscribe$),
        // Create checkbox group
        tap((verbs) =>
          verbs.map((verb) =>
            this.checkboxGroup.addControl(verb["tag"], new FormControl(false))
          )
        ),
        // Subscribe to checkbox valuechanges
        tap((x) =>
          this.checkboxGroup.valueChanges
            .pipe(
              takeUntil(this.unsubscribe$),
              // Filter checked checkboxes
              map((checkboxes) =>
                Object.keys(checkboxes).filter((k) => checkboxes[k])
              ),
              // Convert tag to full Verb
              map((verbTags) =>
                verbTags.map((verbTag) => this.verbService.getVerb(verbTag))
              ),
              // Dispatch action to store
              tap((selectedVerbs) => this.onVerbSelect(selectedVerbs))
            )
            .subscribe()
        )
      )
      .subscribe((x) => {
        // change viewable verbs
        this.viewableVerbs$ = this.searchField.valueChanges.pipe(
          takeUntil(this.unsubscribe$),
          debounceTime(200),
          switchMap((term) => this.getEntriesFrom$(term))
        );
      });
    // populate with store's selection
    this.selection$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectTableViewerRoot)
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onVerbSelect(verbs) {
    this.store.dispatch(actionChangeVerbs({ root: verbs }));
  }

  onVerbDeselect(verb) {
    this.checkboxGroup.controls[verb.tag].setValue(false);
  }

  selectedRoot(selection: Verb[], root: string) {
    return selection.map((x) => x.tag).indexOf(root) > 0;
  }

  getEntriesFrom$(term: string) {
    term = term.toLowerCase();
    return this.verbService.verbs$.pipe(
      map((verbs) => verbs.filter((v) => this.filterEntries(v, term)))
    );
  }

  filterEntries(v: Verb, term) {
    return (
      this.translate
        .instant("ww-data.verbs." + v.tag)
        .toLowerCase()
        .indexOf(term.toLowerCase()) > -1
    );
  }
}
