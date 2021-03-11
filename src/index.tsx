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
import PageRoller from "./Roller/PageRoller";
import { withStyles, StyleRules } from "@material-ui/core/styles";
import "./util/extends";
import { HistoryWrapper } from "./components";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <HistoryWrapper exact path="/" component={PageHome} />
          <HistoryWrapper exact path="/instances" component={PageInstances} />
          <HistoryWrapper exact path="/actors" component={PageActors} />
          <HistoryWrapper exact path="/instance" component={PageInstance} />
          <HistoryWrapper exact path="/images" component={PageImages} />
          <HistoryWrapper exact path="/image" component={PageImage} />
          <HistoryWrapper exact page="/roller" component={PageRoller} />
        </Switch>
      </BrowserRouter>
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
