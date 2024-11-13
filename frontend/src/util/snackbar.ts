import {createContext} from "react";

export interface Snackbar {
  label: string,
}

export interface SnackbarController {
  cur: Snackbar | null,
  set: (newVal: Snackbar | null) => void,
}

export const SnackbarContext = createContext<SnackbarController>({ cur: null, set: () => {} })
