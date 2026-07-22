import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, throwError } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  retry,
  catchError,
} from "rxjs/operators";

import { Option } from "../../../config/config";
import { AppState } from "../core.state";
import { selectSettingsBaseUrl } from "../settings/settings.selectors";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class OptionService {
  path = environment.usePrecompressedData ? "options.json.gz" : "options.json";
  options;
  options$: Observable<Option[]>;
  optionsByType$: Observable<object[]>;
  random$: Observable<Option>;
  suppressError = true;
  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.options$ = this.store.pipe(
      select(selectSettingsBaseUrl),
      distinctUntilChanged(),
      switchMap((baseUrl: string) =>
        this.http.get<Option[]>(baseUrl + this.path)
      ),
      retry(2),
      shareReplay(1),
      catchError((err) => {
        console.error("Failed to load options", err);
        return throwError(() => err); // let error propagate
      })
    );
    this.optionsByType$ = this.options$.pipe(
      map((options) => {
        const optionTypes = [...new Set(options.map((x) => x.type))];
        const optionsByType = [];
        optionTypes
          .filter((x) => x)
          .forEach((x) =>
            optionsByType.push({
              type: x,
              options: options.filter((y) => y.type === x),
            })
          );
        return optionsByType;
      })
    );
    this.random$ = this.options$.pipe(map((res) => this.getRandomOption(res)));
    this.options$.subscribe((o) => (this.options = o));
  }

  optionsUseType$(): Observable<boolean> {
    return this.options$.pipe(
      map((options) => options.some((option) => option.type))
    );
  }

  getOption(tag) {
    return this.options.filter((a) => a.tag === tag)[0];
  }

  getRandomOption(options: Option[]): Option {
    return options[Math.floor(Math.random() * options.length)];
  }
}
