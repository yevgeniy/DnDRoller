import * as React from "react";
import { render } from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Switch, Route, Link, BrowserRouter, Redirect } from "react-router-dom";
import PageInstance from "./PageInstance";

import "./styles.css";

import "./util/extends";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={PageInstance} />
      </Switch>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);

serviceWorker.register();
