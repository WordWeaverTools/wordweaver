import { Injectable } from "@angular/core";
import { marker } from "@colsen1991/ngx-translate-extract-marker";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EMPTY } from "rxjs";
import { concatMap, map, switchMap, withLatestFrom } from "rxjs/operators";
import { ConjugationService } from "../../core/conjugation/conjugation.service";
import { selectTableviewerState } from "../core.state";
// import { LocalStorageService } from "../local-storage/local-storage.service";
import { NotificationService } from "../notifications/notification.service";
import {
  actionChangeConjugations,
  actionChangeLoading,
  actionConjugationEvent,
} from "./tableviewer-selection.actions";
import { State } from "./tableviewer-selection.model";

export const TABLEVIEWER_SELECTION_KEY = "TABLEVIEWER";

export const createRequestQueryArgs = (selection) => {
  const params = new URLSearchParams();
  ["option", "agent", "patient", "root"].forEach((x) => {
    selection[x].forEach((y) => {
      if (y.tag) {
        params.append(x, y.tag);
      }
    });
  });
  return params;
};

@Injectable()
export class TableviewerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    // private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private conjugationService: ConjugationService
  ) {}

  // TODO: persist
  // persistSelection = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(
  //         actionChangeAgents,
  //         actionChangeOptions,
  //         actionChangeVerbs,
  //         actionChangePatients
  //       ),
  //       withLatestFrom(this.store.pipe(select(selectTableviewerState))),
  //       tap(([action, settings]) =>
  //         this.localStorageService.setItem(TABLEVIEWER_SELECTION_KEY, settings)
  //       )
  //     ),
  //   { dispatch: false }
  // );

  private hasRootSelection(selection: any): boolean {
    return Array.isArray(selection.root) && selection.root.length > 0;
  }

  conjugate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actionConjugationEvent),
      withLatestFrom(this.store.select(selectTableviewerState)),
      switchMap(([action, selection]) => {
        if (!this.hasRootSelection(selection)) {
          this.notificationService.translated(
            marker("ww.pages.tableviewer.notifications.error.missing-root"),
            {},
            "error"
          );
          return EMPTY; // no further actions dispatched
        }

        const queryArgs = createRequestQueryArgs(selection);
        if (!queryArgs) {
          return EMPTY;
        }

        this.store.dispatch(actionChangeLoading({ loading: true }));

        return this.conjugationService.conjugations$.pipe(
          map((data) =>
            this.conjugationService.filterConjugations(data, selection)
          ),
          map((filtered) => [
            actionChangeLoading({ loading: false }),
            actionChangeConjugations({ conjugations: filtered }),
          ]),
          concatMap((actions) => actions) // emit actions one by one
        );
      })
    )
  );
}
