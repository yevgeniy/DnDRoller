import * as React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(
  theme =>
    createStyles({
      root: {}
    }),
  { name: "LayoutMenu" }
);

interface ILayoutMenu {
  classes?: any;
  className?: string;
  children: React.ReactElement | React.ReactElement[];
}

const LayoutMenu = (props: ILayoutMenu) => {
  const classes = useStyles({ classes: props.classes });
  return (
    <div className={clsx(classes.root, props.className)}>{props.children}</div>
  );
};

export default LayoutMenu;
