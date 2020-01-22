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
  key: "historyState",
  get: selector => {
    const repo = system.currentHistory || {};
    let state = repo[selector];
    if (!state) state = repo[selector] = {};
    return state;
  }
};

let _log = "";
const log = {
  key: "log",
  get: () => _log,
  set: v => (_log = v)
};

let _showThumbOnImages = !!JSON.parse(
  window.localStorage.getItem("showThumbOnImages")
);
console.log("aaaa", _showThumbOnImages);
const showThumbOnImages = {
  key: "showThumbOnImages",
  get: () => _showThumbOnImages,
  set: v => {
    _showThumbOnImages = v;
    window.localStorage.setItem("showThumbOnImages", v);
  }
};

const dict = NimmSync.create([history, historyState, log, showThumbOnImages]);
export const { useOpenStream, useMessageStream } = NimmSync.connect(
  dict,
  React
);

useOpenStream.historyState = (selector: string) => {
  const { on } = useMessageStream("history");
  const [state, opers] = useOpenStream("historyState", selector);
  on(opers.get);

  return [state || {}, opers];
};
useOpenStream.historyHasBack = () => {
  let [history] = useOpenStream("history");

  history = history || {};
  const i = system.history.findIndex(v => v.id === history.id);
  console.log("a", i, history.key);
  if (i == 0 || i === -1) return false;
  return true;
};
