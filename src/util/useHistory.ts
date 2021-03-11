import { useState } from "react";

import { ModelHistoryEntry } from "../models/ModelHistoryEntry";

const system: {
  history: ModelHistoryEntry[];
  currentHistory: ModelHistoryEntry;
} = {
  history: [],
  currentHistory: null
};

export default function useHistory() {
  const [t, sett] = useState(+new Date());

  const setHistory = (id: string) => {
    if (!id) {
      system.currentHistory = null;
      sett(+new Date());
      return;
    }
    const i = system.history.findIndex(v => v.id === id);
    if (i === -1) {
      system.currentHistory = { id };
      system.history.push(system.currentHistory);
    } else {
      system.currentHistory = system.history[i];
      system.history.splice(i + 1);
    }

    if (system.history.length > 20) system.history.shift();

    sett(+new Date());
  };

  return [
    system.currentHistory,
    {
      setHistory,
      hasBack: system.history.indexOf(system.currentHistory) > 0
    }
  ];
}
