import * as React from "react";
import { useContext } from "react";
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
import Extension from "@material-ui/icons/Extension";
import Reply from "@material-ui/icons/Reply";
import Photo from "@material-ui/icons/Photo";
import DirectionsRun from "@material-ui/icons/DirectionsRun";
import Casino from "@material-ui/icons/Casino";
import SmokingRooms from "@material-ui/icons/SmokingRooms";
import { Link } from "react-router-dom";

import { RouterContextView } from "../util/routerContext";

function MainOptions() {
  const router = useContext(RouterContextView);
  return (
    <>
      {router && router.history.length > 1 ? (
        <List>
          <ListItem
            button
            onClick={() => {
              router.history.goBack();
            }}
          >
            <ListItemIcon>{<Reply />}</ListItemIcon>
            <ListItemText primary="Back" />
          </ListItem>
        </List>
      ) : null}

      <List
        subheader={<ListSubheader component="div">Repositories</ListSubheader>}
      >
        <ListItem button component={Link} to="/instances">
          <ListItemIcon>{<Extension />}</ListItemIcon>
          <ListItemText primary="Instances" />
        </ListItem>
        <ListItem button component={Link} to="/actors">
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
        <ListItem button component={Link} to="/instance">
          <ListItemIcon>{<SmokingRooms />}</ListItemIcon>
          <ListItemText primary="Quick Instance" />
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
