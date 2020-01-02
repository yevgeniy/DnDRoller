import * as React from "react";
import clsx from "clsx";
import { EntityContentTabInfo, EntityContentTabRelation } from "./";
import { useOpenStream } from "../util/sync";
import {
  Avatar,
  ListItemText,
  ListItem,
  ListItemAvatar,
  makeStyles,
  createStyles,
  Tab,
  Tabs,
  Button,
  Paper,
  List,
  Drawer,
  ListSubheader
} from "@material-ui/core";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {}
    });
  },
  { name: "EntityContent" }
);

interface IEntityContent {
  classes?: any;
  className?: string;
  id?: number;
  updateEntity?: (a: any) => void;
  children: React.ReactElement | React.ReactElement[];
}
const EntityContent = (props: IEntityContent) => {
  const classes = useStyles(props);
  const [{ tab }, { update: setTab }] = useOpenStream.historyState(
    `${EntityContent.name}|${props.id}`
  );

  const renderTabsHeaders = () => {
    return (
      <>
        {React.Children.map(props.children, v => v)
          .filter(
            v =>
              v.type === EntityContentTabInfo ||
              v.type === EntityContentTabRelation
          )
          .map(v => (
            <Tab label={v.props.label} icon={v.props.icon} />
          ))}
      </>
    );
  };
  const renderTabs = () => {
    return (
      <>
        {React.Children.map(props.children, v => v)
          .filter(
            v =>
              v.type === EntityContentTabInfo ||
              v.type === EntityContentTabRelation
          )
          .map((v, i) =>
            React.cloneElement(v, {
              value: tab,
              index: i
            })
          )}
      </>
    );
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <Tabs
        onChange={(e, v) => setTab({ tab: v })}
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      ></Tabs>
      {renderTabsHeaders()}
      {renderTabs()}
    </div>
  );
};
export default EntityContent;
