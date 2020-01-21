import * as React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {}
    });
  },
  { name: "LayoutControl" }
);

interface ILayoutControl {
  classes?: any;
  className?: string;
  children: React.ReactElement | React.ReactElement[];
}
const LayoutControl = ({
  className,
  classes: _classes,
  children
}: ILayoutControl) => {
  const classes = useStyles({ classes: _classes });
  return <div className={clsx(classes.root, className)}>{children}</div>;
};

export default LayoutControl;
