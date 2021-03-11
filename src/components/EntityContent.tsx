import * as React from "react";
import clsx from "clsx";
import { makeStyles, createStyles } from "@material-ui/core";

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

  return (
    <div className={clsx(classes.root, props.className)}>{props.children}</div>
  );
};
export default EntityContent;
