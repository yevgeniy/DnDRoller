import * as React from "react";
import { render } from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import PageInstance from "./PageInstance/PageInstance";
import PageHome from "./PageHome";
import PageInstances from "./PageInstances/PageInstances";
import PageActors from "./PageActors/PageActors";
import PageImages from "./PageImages/PageImages";
import PageImage from "./PageImage/PageImage";
import Log from "./Log";
import { withStyles, StyleRules } from "@material-ui/core/styles";
import "./util/extends";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={PageHome} />
          <Route exact path="/instances" component={PageInstances} />
          <Route exact path="/actors" component={PageActors} />
          <Route exact path="/instance" component={PageInstance} />
          <Route exact path="/images" component={PageImages} />
          <Route exact path="/image" component={PageImage} />
        </Switch>
      </BrowserRouter>
      <Log />
    </>
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
      },
      a: {
        color: "inherit",
        textDecoration: "none"
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
