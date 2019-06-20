import * as React from "react";
import { render } from "react-dom";
import * as serviceWorker from "./serviceWorker";
import {
    Switch,
    Route,
    Link,
    BrowserRouter,
    Redirect,
    BrowserRouterProps
} from "react-router-dom";
import PageInstance from "./PageInstance";
import PageHome from "./PageHome";
import PageInstances from "./PageInstances";
import PageActors from "./PageActors";
import PageImages from "./PageImages/PageImages";

import {
    withStyles,
    StyleRules,
    createMuiTheme,
    responsiveFontSizes
} from "@material-ui/core/styles";
import "./util/extends";

/*g*/
const clientId =
    "945205485000-7pta9l092uqbbnftr585nt85kiruo61k.apps.googleusercontent.com";
const clientSecret = "qIRn9M9sGhY26yr41C21o3V8";
//{"web":{"client_id":"945205485000-7pta9l092uqbbnftr585nt85kiruo61k.apps.googleusercontent.com","project_id":"dnd-pwa","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"qIRn9M9sGhY26yr41C21o3V8","javascript_origins":["https://objective-aryabhata-c61010.netlify.com"]}}

/*d*/
const appkey = "0obgjd22eo071f4";
const appsecret = "01elwm960iwsw9l";
const accesstoken =
    "lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={PageHome} />
                <Route exact path="/instances" component={PageInstances} />
                <Route exact path="/actors" component={PageActors} />
                <Route exact path="/instance" component={PageInstance} />
                <Route exact path="/images" component={PageImages} />
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
