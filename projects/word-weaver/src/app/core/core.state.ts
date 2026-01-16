import { routerReducer, RouterReducerState } from "@ngrx/router-store";
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from "@ngrx/store";
import { environment } from "../../environments/environment";
import { debug } from "./meta-reducers/debug.reducer";
import { initStateFromLocalStorage } from "./meta-reducers/init-state-from-local-storage.reducer";
import { RouterStateUrl } from "./router/router.state";
import { SettingsState } from "./settings/settings.model";
import { settingsReducer } from "./settings/settings.reducer";
import { TableviewerState } from "./tableviewer-selection/tableviewer-selection.model";
import { tableviewerReducer } from "./tableviewer-selection/tableviewer-selection.reducer";
import { WordmakerState } from "./wordmaker-selection/wordmaker-selection.model";
import { wordmakerReducer } from "./wordmaker-selection/wordmaker-selection.reducer";

export const reducers: ActionReducerMap<AppState> = {
  settings: settingsReducer,
  router: routerReducer,
  tableviewer: tableviewerReducer,
  wordmaker: wordmakerReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage,
];

if (!environment.production) {
  if (!environment.test) {
    metaReducers.unshift(debug);
  }
}

export const selectSettingsState =
  createFeatureSelector<AppState["settings"]>("settings");

export const selectTableviewerState =
  createFeatureSelector<AppState["tableviewer"]>("tableviewer");

export const selectWordmakerState =
  createFeatureSelector<AppState["wordmaker"]>("wordmaker");

export const selectRouterState =
  createFeatureSelector<AppState["router"]>("router");

export interface AppState {
  settings: SettingsState;
  router: RouterReducerState<RouterStateUrl>;
  tableviewer: TableviewerState;
  wordmaker: WordmakerState;
}
