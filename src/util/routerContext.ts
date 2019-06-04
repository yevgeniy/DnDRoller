import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

interface RouterViewContextState {
  menuOpen?: number;
  drawerOpen?: number;
  scrollTop?: number;
}

export const RouterContextView = React.createContext<
  RouteComponentProps<{}, {}, RouterViewContextState>
>(null);
