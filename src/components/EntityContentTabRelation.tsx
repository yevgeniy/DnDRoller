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
import { useModalState } from "../util/hooks";

import clsx from "clsx";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {},
      tabControls: {
        display: "flex",
        justifyContent: "flex-start",
        background: theme.palette.grey[400]
      },
      tabControlButton: {
        "& svg": {
          margin: "0 0 0 8px"
        }
      }
    });
  },
  { name: "EntityContentTabRelation" }
);

interface IEntityContentTabRelation {
  classes?: any;
  className?: string;
  label: string;
  icon?: React.ReactElement | React.ReactElement[];
  children: React.ReactElement | React.ReactElement[];
  buttonLabel: string;
  buttonIcon: React.ReactElement | React.ReactElement[];
  listSubheader: string;
  ids: number[];
  update: (ids: number[]) => void;
  listComponent: any;
  updateComponent: any;
  value?: number;
  index?: number;
}
const EntityContentTabRelation = (props: IEntityContentTabRelation) => {
  const classes = useStyles(props);

  const { isOpen, doOpen, doClose, onDone } = useModalState<number[]>();

  return (
    <TabPanel
      className={clsx(classes.root, props.className)}
      value={props.value}
      index={props.index}
    >
      <div className={classes.tabControls}>
        <Button
          className={classes.tabControlButton}
          variant="contained"
          color="secondary"
          button="true"
          onClick={e => doOpen().then(v => props.update(v))}
        >
          {props.buttonLabel}
          {props.buttonIcon}
        </Button>
      </div>
      <Paper>
        <List
          subheader={
            <ListSubheader component="div">{props.listSubheader}</ListSubheader>
          }
        >
          {(props.ids || []).map(v =>
            React.createElement(props.listComponent, {
              key: v,
              id: v
            })
          )}
        </List>
      </Paper>
      <Drawer anchor="top" open={isOpen} onClose={doClose}>
        {React.createElement(props.updateComponent, {
          onDone,
          selected: props.ids
        })}
      </Drawer>
    </TabPanel>
  );
};
export default EntityContentTabRelation;
