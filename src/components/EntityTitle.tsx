import * as React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {}
    });
  },
  { name: "EntityTitle" }
);

interface IEntityTitle {
  classes?: any;
  className?: string;
  onClick?: (v: any) => void;
  children: React.ReactElement | React.ReactElement[];
}
const EntityTitle = (props: IEntityTitle) => {
  const classes = useStyles(props);
  return (
    <div className={clsx(classes.root, props.className)}>
      {React.Children.map(props.children, v =>
        React.cloneElement(v, { onClick: props.onClick })
      )}
    </div>
  );
};
export default EntityTitle;
