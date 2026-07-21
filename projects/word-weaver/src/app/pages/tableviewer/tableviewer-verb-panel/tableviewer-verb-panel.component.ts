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
    let checkboxValueChangesSubscribed = false;
    // Get Verbs
    this.verbs$
      .pipe(
        takeUntil(this.unsubscribe$),
        // Create checkbox group, skipping verbs that already have a
        // control so a re-emission of verbs$ doesn't reset the user's
        // existing selection back to unchecked.
        tap((verbs) =>
          verbs.forEach((verb) => {
            if (!this.checkboxGroup.contains(verb["tag"])) {
              this.checkboxGroup.addControl(
                verb["tag"],
                new FormControl(false)
              );
            }
          })
        ),
        // Subscribe to checkbox valuechanges exactly once
        tap(() => {
          if (checkboxValueChangesSubscribed) {
            return;
          }
          checkboxValueChangesSubscribed = true;
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
            .subscribe();
        })
      )
      .subscribe(() => {
        // change viewable verbs
        this.viewableVerbs$ = this.searchField.valueChanges.pipe(
          takeUntil(this.unsubscribe$),
          debounceTime(200),
          switchMap((term) => this.getEntriesFrom$(term))
        );
      });
    // populate with store's selection, and reconcile the checkbox group
    // with the store so external changes (the 3-item cap, deselecting a
    // chip, deep links) stay in sync without re-dispatching to the store.
    this.selection$ = this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(selectTableViewerRoot),
      tap((selection) => {
        const selectedTags = new Set(selection.map((verb) => verb["tag"]));
        Object.keys(this.checkboxGroup.controls).forEach((tag) => {
          const control = this.checkboxGroup.controls[tag];
          const shouldBeChecked = selectedTags.has(tag);
          if (control.value !== shouldBeChecked) {
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
    this.checkboxGroup.controls[verb.tag].setValue(false);
  }

  selectedRoot(selection: Verb[], root: string) {
    return selection.map((x) => x.tag).indexOf(root) >= 0;
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
