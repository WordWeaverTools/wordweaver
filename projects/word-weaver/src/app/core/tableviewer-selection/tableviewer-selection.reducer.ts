import { Action, createReducer, on } from "@ngrx/store";
import { initialTableViewerSettings } from "../../../config/config";
import {
  actionChangeAgents,
  actionChangeConjugations,
  actionChangeGridOrder,
  actionChangeLoading,
  actionChangeOptions,
  actionChangePatients,
  actionChangeTreeViewDepth,
  actionChangeVerbs,
  actionChangeVerbSearchTerm,
  actionChangeViewMode,
  actionToggleTreeViewOrder,
} from "./tableviewer-selection.actions";
import { TableviewerState } from "./tableviewer-selection.model";

export const initialBaseState: TableviewerState = {
  option: [],
  agent: [],
  patient: [],
  root: [],
  conjugations: [],
  view: "list",
  treeDepth: 1,
  standardTreeOrder: true,
  loading: false,
  gridOrder: {
    col: "option",
    row: "pn",
    main: "root",
  },
};

export const initialState: TableviewerState = {
  ...initialBaseState,
  ...initialTableViewerSettings,
};

interface tagType {
  tag: string;
}
const sameTags = (a: tagType[] = [], b: tagType[] = []): boolean =>
  a.length === b.length &&
  a.every((verb, index) => verb?.tag === b[index]?.tag);

const reducer = createReducer(
  initialState,
  // Basic updates
  on(
    actionChangePatients,
    actionChangeTreeViewDepth,
    actionChangeConjugations,
    actionChangeLoading,
    actionChangeViewMode,
    actionChangeVerbSearchTerm,
    // actionChangeGridOrder,
    (state, action) => ({ ...state, ...action })
  ),
  on(actionChangeVerbs, (state, { root }) => {
    if (sameTags(state.root, root)) {
      return state;
    }

    console.log("SERGE", state.root, root);
    return { ...state, root };
  }),
  on(actionChangeAgents, (state, action) => {
    if (sameTags(state.agent, action.agent)) {
      return state;
    }

    console.log("SERGE", state, action);
    return { ...state, ...action };
  }),
  on(actionChangeOptions, (state, action) => {
    if (sameTags(state.option, action.option)) {
      return state;
    }
    return { ...state, ...action };
  }),

  // Toggles
  on(actionToggleTreeViewOrder, (state, action) => {
    return { ...state, [action.name]: !state[action.name] };
  }),

  // Partials
  on(actionChangeGridOrder, (state, action) => {
    const partialState = { ...state[action.name], ...action.partial };
    return { ...state, [action.name]: partialState };
  })
);

export const tableviewerReducer = (
  state: TableviewerState | undefined,
  action: Action
) => reducer(state, action);
