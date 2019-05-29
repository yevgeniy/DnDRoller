import * as React from "react";
import { render } from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Switch, Route, Link, BrowserRouter, Redirect } from "react-router-dom";
import PageInstance from "./PageInstance";
import {
  withStyles,
  StyleRules,
  createMuiTheme,
  responsiveFontSizes
} from "@material-ui/core/styles";

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

const styles = theme => {
  const styles: StyleRules = {
    "@global": {
      // MUI typography elements use REMs, so you can scale the global
      // font size by setting the font-size on the <html> element.
      html: {
        [theme.breakpoints.down("xs")]: {
          fontSize: 12
        }
      }
    }
  };
  return styles;
};

const rootElement = document.getElementById("root");

const Comp = withStyles(styles)(App);
//@ts-ignore
render(<Comp />, rootElement);

serviceWorker.register();
