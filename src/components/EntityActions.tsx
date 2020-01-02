import * as React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {}
    });
  },
  { name: "EntityActions" }
);

interface IEntityActions {
  classes?: any;
  className?: string;
  onDone?: (v: any) => void;
  children: React.ReactElement | React.ReactElement[];
}
const EntityActions = (props: IEntityActions) => {
  const classes = useStyles(props);
  return (
    <div className={clsx(classes.root, props.className)}>
      {React.Children.map(props.children, v =>
        React.cloneElement(v, { onDone: props.onDone })
      )}
    </div>
  );
};
export default EntityActions;
