import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

export interface RouterViewContextState {
  menuOpen?: { [id: number]: boolean };
  scrollTop?: number;
}

export const RouterContextView = React.createContext<
  RouteComponentProps<{}, {}, RouterViewContextState>
>(null);
