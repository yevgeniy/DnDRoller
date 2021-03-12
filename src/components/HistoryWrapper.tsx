import React, { useEffect } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { useCommonHook, useHistory } from "../util/hooks";

const HistoryWrapper = ({ component, ...props }) => {
  return (
    <Route
      {...props}
      render={p => {
        return <Wrapper component={component} historyProps={p} />;
      }}
    />
  );
};

function Wrapper({ component, historyProps }) {
  const [currentHistory, { setHistory }] = useCommonHook(useHistory) || [
    null,
    { setHistory: null }
  ];

  const id = historyProps.history.location.key;
  useEffect(() => {
    if (!setHistory) return;
    setHistory(id || +new Date() + "");
    return () => {
      setHistory(null);
    };
  }, [id, !!setHistory]);

  if (!currentHistory) return null;

  return React.createElement(component, historyProps);
}

export default HistoryWrapper;
