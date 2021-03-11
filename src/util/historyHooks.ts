import { useState, useCallback } from "react";

import useHistory from "./useHistory";
import useCommonHook from "./useCommonHook";

function ping(fn) {
  const [t, sett] = useState(+new Date());

  return (...args) => {
    fn(...args);
    sett(+new Date());
  };
}

export function useLayoutHistory() {
  const [currentState] = useCommonHook(useHistory) || [null];

  const update = ping(changes => {
    currentState["layout"] = {
      ...(currentState["layout"] || {}),
      ...changes
    };
  });

  if (!currentState) return null;

  currentState["layout"] = currentState["layout"] || {};
  currentState["layout"]["id"] = currentState["id"];

  return [currentState["layout"], { update }];
}
export function useEntityHistory(id) {
  const [currentState] = useCommonHook(useHistory) || [null];

  const update = ping(changes => {
    currentState[`entity-${id}`] = {
      ...(currentState[`entity-${id}`] || {}),
      ...changes
    };
  });

  if (!currentState) return null;

  currentState[`entity-${id}`] = currentState[`entity-${id}`] || {};

  return [currentState[`entity-${id}`], { update }];
}
export function useEntityContentTabsHistory(id) {
  const [currentState] = useCommonHook(useHistory) || [null];

  const update = ping(changes => {
    currentState[`entity-content-tabs-${id}`] = {
      ...(currentState[`entity-content-tabs-${id}`] || {}),
      ...changes
    };
  });

  if (!currentState) return null;

  currentState[`entity-content-tabs-${id}`] = currentState[
    `entity-content-tabs-${id}`
  ] || { tab: 0 };

  return [currentState[`entity-content-tabs-${id}`], { update }];
}

export function usePageImagesHistory() {
  const [currentState] = useCommonHook(useHistory) || [null];

  const update = ping(changes => {
    currentState[`page-images`] = {
      ...currentState[`page-images`],
      ...changes
    };
  });

  if (!currentState) return null;

  currentState[`page-images`] = currentState[`page-images`] || {
    currentKeyWords: []
  };

  return [currentState[`page-images`], { update }];
}
