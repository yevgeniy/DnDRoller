import * as React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import {
  Avatar,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Tab,
  Tabs,
  Button,
  Paper,
  List,
  Drawer,
  ListSubheader
} from "@material-ui/core";
import { TabPanel } from "./";

import clsx from "clsx";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {}
    });
  },
  { name: "EntityContentTabInfo" }
);

interface IEntityContentTabInfo {
  classes?: any;
  className?: string;
  label: string;
  icon?: React.ReactElement | React.ReactElement[];
  children: React.ReactElement | React.ReactElement[] | string;
  value?: number;
  index?: number;
}
const EntityContentTabInfo = (props: IEntityContentTabInfo) => {
  const classes = useStyles(props);

  return (
    <TabPanel
      className={clsx(classes.root, props.className)}
      value={props.value}
      index={props.index}
    >
      {props.children}
    </TabPanel>
  );
};
export default EntityContentTabInfo;
