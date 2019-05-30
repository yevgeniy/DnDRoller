import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import Settings from "@material-ui/icons/Settings";
import Games from "@material-ui/icons/Games";
import Photo from "@material-ui/icons/Photo";
import DirectionsRun from "@material-ui/icons/DirectionsRun";
import Casino from "@material-ui/icons/Casino";

function MainOptions() {
  return (
    <>
      <List
        subheader={<ListSubheader component="div">Repositories</ListSubheader>}
      >
        <ListItem button>
          <ListItemIcon>{<Games />}</ListItemIcon>
          <ListItemText primary="Instances" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>{<DirectionsRun />}</ListItemIcon>
          <ListItemText primary="Actors" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>{<Photo />}</ListItemIcon>
          <ListItemText primary="Images" />
        </ListItem>
      </List>

      <List subheader={<ListSubheader component="div">Utils</ListSubheader>}>
        <ListItem button>
          <ListItemIcon>{<Casino />}</ListItemIcon>
          <ListItemText primary="Roller" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>{<Settings />}</ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </>
  );
}

export default MainOptions;
