import * as React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {
        display: "flex"
      }
    });
  },
  { name: "EntityHeaderActions" }
);

interface IHeaderActions {
  classes?: any;
  className?: string;
  children: React.ReactElement | React.ReactElement[];
}
const EntityHeaderActions = (props: IHeaderActions) => {
  const classes = useStyles(props);
  return (
    <div className={clsx(classes.root, props.className)}>{props.children}</div>
  );
};
export default EntityHeaderActions;
