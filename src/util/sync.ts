import NimmSync from "nimm-sync";
import * as React from "react";

import { ModelHistoryEntry } from "../models/ModelHistoryEntry";

const system: {
  history: ModelHistoryEntry[];
  currentHistory: ModelHistoryEntry;
} = {
  history: [],
  currentHistory: null
};

const history = {
  key: "history",
  get: () => system.currentHistory,
  set: id => {
    if (id === null) {
      system.currentHistory = null;
      return;
    }

    let current: ModelHistoryEntry = system.history.find(v => v.id === id);
    if (!current) {
      current = {
        id
      };
      system.history.push(current);
      if (system.history.length > 20) system.history.unshift();
    }
    system.currentHistory = current;
  }
};
const historyState = {
  key: "history-state",
  get: selector => {
    const repo = system.currentHistory || {};
    let state = repo[selector];
    if (!state) state = repo[selector] = {};
    return state;
  }
};

const dict = NimmSync.create([history, historyState]);
export const { useOpenStream, useMessageStream } = NimmSync.connect(
  dict,
  React
);

useOpenStream.historyState = (selector: string) => {
  const { on } = useMessageStream("history");
  const [state, opers] = useOpenStream("history-state", selector);
  on(opers.get);

  return [state || {}, opers];
};
