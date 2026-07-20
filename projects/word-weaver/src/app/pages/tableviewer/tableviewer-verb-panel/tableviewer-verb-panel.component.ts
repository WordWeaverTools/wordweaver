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
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
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
              distinctUntilChanged(
                (prev, curr) =>
                  prev.length === curr.length &&
                  prev.every((v, i) => v?.tag === curr[i]?.tag)
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
      select(selectTableViewerRoot),
      tap((selection) => {
        const selected = new Set((selection ?? []).map((v) => v?.tag));
        Object.keys(this.checkboxGroup.controls).forEach((tag) => {
          const control = this.checkboxGroup.controls[tag];
          const shouldBeChecked = selected.has(tag);
          if (control && control.value !== shouldBeChecked) {
            control.setValue(shouldBeChecked, { emitEvent: false });
          }
        });
      })
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
    this.checkboxGroup.controls[verb.tag].setValue(false, { emitEvent: false });
    const currentSelection = Object.keys(this.checkboxGroup.controls)
      .filter((k) => this.checkboxGroup.controls[k].value)
      .map((verbTag) => this.verbService.getVerb(verbTag));
    this.onVerbSelect(currentSelection);
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
