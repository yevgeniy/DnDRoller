import * as React from "react";
import { useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {
        display: "flex",
        flexWrap: "nowrap"
      }
    });
  },
  { name: "ContextMenu" }
);

interface ContextMenuProps {
  isOpen?: boolean;
  //onOpen?: () => void
  onOpen?: any;
  onClose?: () => void;
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}
const ContextMenu = ({
  isOpen,
  onOpen,
  onClose,
  ...props
}: ContextMenuProps) => {
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.root, props.className)}>{props.children}</div>
  );
};

export default ContextMenu;
