import * as React from "react";
import clsx from "clsx";
import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {}
    });
  },
  { name: "EntitySubheader" }
);

interface IEntitySubheader {
  classes?: any;
  className?: string;
  id?: number;
  updateEntity?: (a: any) => void;
  children: React.ReactElement | React.ReactElement[];
  show?: boolean;
  isExpanded?: boolean;
}
const EntitySubheader = (props: IEntitySubheader) => {
  const classes = useStyles(props);

  const show = props.isExpanded || props.show;

  if (!show) return null;

  return (
    <div className={clsx(classes.root, props.className)}>{props.children}</div>
  );
};
export default EntitySubheader;
