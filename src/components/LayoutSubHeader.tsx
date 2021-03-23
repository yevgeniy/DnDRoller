import * as React from "react";
import { makeStyles, createStyles, Typography } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(
  theme =>
    createStyles({
      root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
      }
    }),
  { name: "LayoutSubHeader" }
);

interface ILayoutSubHeader {
  classes?: any;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

const LayoutSubHeader = (props: ILayoutSubHeader) => {
  const classes = useStyles({ classes: props.classes });

  return (
    <div className={clsx(classes.root, props.className)}>
      {props.children && props.children.constructor === String ? (
        <Typography>{props.children}</Typography>
      ) : (
        props.children
      )}
    </div>
  );
};

export default LayoutSubHeader;
