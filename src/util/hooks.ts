import * as React from "react";
import { useState, useEffect, useMemo } from "react";

export function useService(S) {
  const [service, setService] = useState(null);
  useEffect(() => {
    S.init().then(setService);
  }, []);
  return service;
}
