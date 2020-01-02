import * as React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import clsx from "clsx";

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
  updateEntity?: (a: any) => void;
  children: React.ReactElement | React.ReactElement[];
}
const EntityContent = (props: IEntityContent) => {
  const classes = useStyles(props);
  return (
    <div className={clsx(classes.root, props.className)}>
      {React.Children.map(props.children, v => {
        return React.cloneElement(v, {
          update: props.updateEntity
        });
      })}
    </div>
  );
};
export default EntityContent;
