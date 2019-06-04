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

// fetch("https://api.dropboxapi.com/2/files/list_folder", {
//   method: "post",
//   headers: {
//     Authorization:
//       "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
//     "Content-Type": "application/json"
//   },
//   body:
//     '{"path": "/programming/art","recursive": false,"include_media_info": false,"include_deleted": false,"include_has_explicit_shared_members": false,"include_mounted_folders": true,"include_non_downloadable_files": true}'
// }).then(async response => {
//   console.log(await response.json());
// });

// fetch("https://content.dropboxapi.com/2/files/get_thumbnail", {
//   method: "post",
//   headers: {
//     Authorization:
//       "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
//     "Dropbox-API-Arg":
//       '{"path": "/programming/art/ioulia_27_by_johngoodstudio-dcpetzs.jpg","format": "jpeg","size": "w64h64","mode": "strict"}'
//   }
// }).then(async response => {
//   var b = await response.blob();
//   var objectURL = URL.createObjectURL(b);

//   document.querySelector("#foo").src = objectURL;
//   //URL.revokeObjectURL(objectURL);
// });

// fetch("https://api.dropboxapi.com/2/files/get_temporary_link", {
//   method: "post",
//   headers: {
//     Authorization:
//       "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
//     "Content-Type": "application/json"
//   },
//   body: '{"path": "/programming/art/so_cute_2_by_charmeurindien-dc2xin2.jpg"}'
// }).then(async response => {
//   var b = await response.json();

//   document.querySelector("#foo").src = b.link;
//   //URL.revokeObjectURL(objectURL);
// });

function save(name, data) {
  return fetch(" https://content.dropboxapi.com/2/files/upload", {
    method: "post",
    headers: {
      Authorization:
        "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
      "Dropbox-API-Arg": `{"path": "/Homework/math/${name}","mode": "overwrite","autorename": true,"mute": false,"strict_conflict": false}`,
      "Content-Type": "application/octet-stream"
    },
    body: data
  }).then(async response => {
    var b = await response.json();
    console.log(b);
  });
}

function App() {
  const onFileSelected = async e => {
    await [...e.target.files].mapAsync(async file => {
      return new Promise(res => {
        var reader = new FileReader();

        reader.onload = function() {
          save(file.name, reader.result).then(r => {
            res();
          });
        };

        console.log("reading");
        reader.readAsArrayBuffer(file);
      });
    });
    //@ts-ignore
    document.querySelector("#fileSelector").value = "";
  };
  return (
    <>
      {/* <input id="fileSelector" onChange={onFileSelected} type="file" multiple /> */}
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={PageHome} />
          <Route exact path="/instances" component={PageInstances} />
          <Route exact path="/actors" component={PageActors} />
          <Route exact path="/instance" component={PageInstance} />
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
