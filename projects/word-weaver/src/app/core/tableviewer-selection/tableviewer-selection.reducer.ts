import { Action, createReducer, on } from "@ngrx/store";
import { initialTableViewerSettings } from "../../../config/config";
import { sameTagged } from "../../shared/utils/tagged-array.util";
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

const reducer = createReducer(
  initialState,
  // Basic updates
  on(
    actionChangeTreeViewDepth,
    actionChangeConjugations,
    actionChangeLoading,
    actionChangeViewMode,
    actionChangeVerbSearchTerm,
    // actionChangeGridOrder,
    (state, action) => ({ ...state, ...action })
  ),
  // Tagged-array selections: guarded so a spurious re-dispatch with a
  // semantically identical selection (e.g. from a rebuilt checkbox group)
  // doesn't hand out a new state reference and cascade into unnecessary
  // re-renders/re-fetches downstream.
  on(actionChangeVerbs, (state, { root }) =>
    sameTagged(state.root, root) ? state : { ...state, root }
  ),
  on(actionChangeAgents, (state, { agent }) =>
    sameTagged(state.agent, agent) ? state : { ...state, agent }
  ),
  on(actionChangePatients, (state, { patient }) =>
    sameTagged(state.patient, patient) ? state : { ...state, patient }
  ),
  on(actionChangeOptions, (state, { option }) =>
    sameTagged(state.option, option) ? state : { ...state, option }
  ),
  // Toggles
  on(actionToggleTreeViewOrder, (state, action) => {
    const toggledState = {};
    toggledState[action.name] = !state[action.name];
    return { ...state, ...toggledState };
  }),
  // Partials
  on(actionChangeGridOrder, (state, action) => {
    const partialState = { ...state[action.name], ...action.partial };
    const actionState = {};
    actionState[action.name] = partialState;
    return { ...state, ...actionState };
  })
);

export const tableviewerReducer = (
  state: TableviewerState | undefined,
  action: Action
) => reducer(state, action);
