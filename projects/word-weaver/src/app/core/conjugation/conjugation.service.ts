import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, throwError } from "rxjs";
import { map, shareReplay, switchMap, retry, catchError } from "rxjs/operators";

import {
  ConjugationObject,
  Conjugations,
  Option,
  Pronoun,
  Verb,
} from "../../../config/config";
import { GridOrder } from "../../pages/tableviewer/conjugation-grid/conjugation-grid.component";
import { selectSettingsState } from "../core.state";
import { SettingsState } from "../settings/settings.model";
import { TableviewerState } from "../tableviewer-selection/tableviewer-selection.model";
import { WordmakerState } from "../wordmaker-selection/wordmaker-selection.model";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ConjugationService {
  conjugations;
  conjugations$: Observable<Conjugations>;
  random$: Observable<ConjugationObject>;
  path = environment.usePrecompressedData
    ? "conjugations.json.gz"
    : "conjugations.json";
  suppressError = true;
  constructor(private http: HttpClient, private store: Store) {
    this.conjugations$ = this.store.pipe(
      select(selectSettingsState),
      switchMap((settings: SettingsState) =>
        this.http.get<Conjugations>(settings?.baseUrl + this.path)
      ),
      retry(2),
      shareReplay(1),
      catchError((err) => {
        console.error("Failed to load conjugations", err);
        return throwError(() => err); // let error propagate
      })
    );
    this.conjugations$.subscribe(
      (conjugations) => (this.conjugations = conjugations)
    );
    this.random$ = this.conjugations$.pipe(
      map((res) => this.getRandomOption(res))
    );
  }

  getRandomOption(options: Conjugations): ConjugationObject {
    return options[Math.floor(Math.random() * options.length)];
  }

  createRequestQueryArgs = (selection) => {
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

  filterConjugations(
    conjugations: Conjugations,
    selection: TableviewerState | WordmakerState
  ) {
    const filterValues = { root: [], option: [], agent: [], patient: [] };
    ["option", "agent", "patient", "root"].forEach((x) => {
      if (selection[x]) {
        if (Array.isArray(selection[x])) {
          filterValues[x] = filterValues[x].concat(
            selection[x].map((y: Verb | Pronoun | Option) => y.tag)
          );
        } else {
          filterValues[x].push(selection[x].tag);
        }
      }
    });
    this.generatePlausibleEvent();
    return conjugations.filter((x) =>
      ["option", "agent", "patient", "root"].every(
        (k) =>
          filterValues[k].length === 0 ||
          filterValues[k].indexOf(x.input[k]) > -1
      )
    );
  }

  conjugate$(selection: TableviewerState | WordmakerState) {
    this.generatePlausibleEvent();

    return this.conjugations$.pipe(
      map((conjugations) => this.filterConjugations(conjugations, selection))
    );
  }

  returnPronounGridDisplay(agent, patient) {
    if (agent && patient) {
      return agent + " → " + patient;
    } else if (agent) {
      return agent;
    } else if (patient) {
      return patient;
    }
  }

  // Restructure data for x*y grid
  // Returns structured data along with unique values for col/row and table separators
  restructureData(conjugations: Conjugations, gridOrder: GridOrder) {
    const main = gridOrder.main;
    const row = gridOrder.row;
    const col = gridOrder.col;
    const structuredData = [];
    const restructuredConjugations = conjugations.map((x) => ({
      ...x.input,
      ...x,
      pn: this.returnPronounGridDisplay(x.input.agent, x.input.patient),
    }));
    const uniqueMain = [
      ...new Set(restructuredConjugations.map((x) => x[main])),
    ];
    const uniqueRow = [...new Set(restructuredConjugations.map((x) => x[row]))];
    const uniqueCol = [...new Set(restructuredConjugations.map((x) => x[col]))];
    uniqueMain.forEach((mainKey) => {
      const mainData = [];
      uniqueRow.forEach((rowKey) => {
        const structuredEntry = { rowKey };
        restructuredConjugations.forEach((entry) => {
          if (entry[main] === mainKey && entry[row] === rowKey) {
            structuredEntry[entry[col]] = entry;
          }
        });
        mainData.push(structuredEntry);
      });
      structuredData.push(mainData);
    });
    return { structuredData, uniqueMain, uniqueCol, uniqueRow };
  }
  private generatePlausibleEvent(
    eventName: string = "Conjugate",
    eventProps: object = {}
  ) {
    if ((window as any).plausible)
      try {
        const win = window;
        (win as any).plausible(eventName, {
          props: eventProps,
        });
      } catch (err) {
        console.error(err);
      }
  }
}
