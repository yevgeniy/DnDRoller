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
  { name: "EntityContentTabs" }
);

interface IEntityContentTabs {
  classes?: any;
  className?: string;
  id: number;
  updateEntity?: (a: any) => void;
  children: React.ReactElement | React.ReactElement[];
}
const EntityContentTabs = (props: IEntityContentTabs) => {
  const classes = useStyles(props);
  let [{ tab }, { update: setTab }] = useOpenStream.historyState(
    `${EntityContentTabs.name}|${props.id}`
  );
  tab = tab || 0;

  const renderTabsHeaders = () => {
    return React.Children.map(props.children, v => v)
      .filter(
        v =>
          v.type === EntityContentTabInfo || v.type === EntityContentTabRelation
      )
      .map((v, i) => <Tab key={i} label={v.props.label} icon={v.props.icon} />);
  };

  const renderTabs = () => {
    return React.Children.map(props.children, v => v)
      .filter(
        v =>
          v.type === EntityContentTabInfo || v.type === EntityContentTabRelation
      )
      .map((v, i) =>
        React.cloneElement(v, {
          key: i,
          value: tab,
          index: i
        })
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
      >
        {renderTabsHeaders()}
      </Tabs>
      {renderTabs()}
    </div>
  );
};

export default EntityContentTabs;
