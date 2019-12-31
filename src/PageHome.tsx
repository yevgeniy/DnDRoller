import * as React from "react";
import { useRef, useState, useEffect, useContext, useCallback } from "react";
import MainOptions from "./components/MainOptions";
import { useOpenStream, useMessageStream } from "./util/sync";

function PageHome(props) {
  const { set: setHistory } = useMessageStream("history");

  useEffect(() => {
    const key = props.history.location.key;
    setHistory(key);
  }, []);

  return <MainOptions />;
}

export default PageHome;
