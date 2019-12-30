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

const dict = NimmSync.create([history]);
export const { useOpenStream, useMessageStream } = NimmSync.connect(
  dict,
  React
);
