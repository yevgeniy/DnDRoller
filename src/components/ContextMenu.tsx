import * as React from "react";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const useStyles = makeStyles(() => {
  return {
    root: {
      boxSizing: "border-box",
      background: "linear-gradient(to bottom, #afafafee, #8f8f8fee, #afafafee)",
      boxShadow: "1px 1px 25px inset",
      borderRadius: "60px 0 0 60px"
    },
    rootOpen: {
      transition: "width ease 400ms",
      width: props => props.openWidth
    },
    rootClose: {
      width: 0,
      transition: "width ease 500ms 200ms"
    },
    settingOpen: {
      transition: "opacity ease 300ms 200ms",
      opacity: 1
    },
    settingClose: {
      transition: "opacity ease 200ms",
      opacity: 0
    },
    setting: {
      paddingLeft: "20px",
      paddingRight: "20px",
      display: "flex"
    }
  };
});

interface ContextMenuProps {
  open: boolean;
  setOpen: (f: boolean) => void;
  children: React.ReactNode;
  openWidth: number;
}

export default function(props: ContextMenuProps) {
  const classes = useStyles(props);
  const clickaway = () => {
    props.setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={clickaway}>
      <div
        className={clsx(classes.root, {
          [classes.rootOpen]: props.open,
          [classes.rootClose]: !props.open
        })}
      >
        <div
          className={clsx(classes.setting, {
            [classes.settingOpen]: props.open,
            [classes.settingClose]: !props.open
          })}
        >
          {props.children}
        </div>
      </div>
    </ClickAwayListener>
  );
}
