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

type closerfn = () => void;
interface ContextMenuProps {
  onOpen?: (closer: closerfn) => void;
  isOpen?: boolean;
  setClose?: () => void;
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}
const ContextMenu = ({
  onOpen,
  isOpen,
  setClose,
  ...props
}: ContextMenuProps) => {
  const classes = useStyles(props);

  console.log("hi");

  useEffect(() => {
    if (!isOpen) return;
    onOpen && onOpen(setClose);
  }, [isOpen, setClose]);

  return (
    <div className={clsx(classes.root, props.className)}>{props.children}</div>
  );
};

export default ContextMenu;
