import * as React from "react";
import { useRef, useState, useEffect, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";

import Drawer from "@material-ui/core/Drawer";
import MainOptions from "./MainOptions";
import { useModalState, useLayoutHistory } from "../util/hooks";

import { LayoutControl, LayoutMenu } from "./";

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  content: {
    marginTop: theme.spacing(1)
  }
}));

interface ILayout {
  children: React.ReactElement | React.ReactElement[];
  title: React.ReactNode;
  control?: React.ReactNode;
  historyId?: any;
}
export default function Layout(props: ILayout) {
  const classes = useStyles(props);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);

  const layoutControls = [];
  let layoutMenu;
  const other = [];
  React.Children.map(props.children, v => v).forEach(v => {
    if (v.type === LayoutControl) layoutControls.push(v);
    else if (v.type === LayoutMenu) layoutMenu = v;
    else other.push(v);
  });

  return (
    <div className={classes.container}>
      {props.historyId && <ScrollConstruct />}

      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={() => setMainMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={clsx("foo", classes.title)}>
            <TitleControl layoutMenu={layoutMenu}>{props.title}</TitleControl>
          </Typography>
          {layoutControls}
        </Toolbar>
      </AppBar>
      <div className={classes.content}>{other}</div>
      <Drawer open={mainMenuOpen} onClose={() => setMainMenuOpen(false)}>
        <MainMenu {...{ classes, setMainMenuOpen }} />
      </Drawer>
    </div>
  );
}

const TitleControl = props => {
  const { isOpen, doOpen, doClose, onDone } = useModalState();

  return (
    <>
      <div onClick={doOpen}>{props.children}</div>
      {props.layoutMenu && (
        <Drawer anchor="top" open={isOpen} onClose={doClose}>
          {props.layoutMenu}
        </Drawer>
      )}
    </>
  );
};

const useMainMenuStyles = makeStyles(theme => {
  return {
    list: {
      width: 250
    }
  };
});
interface MainMenuProps {
  setMainMenuOpen: (b: boolean) => void;
}
function MainMenu({ setMainMenuOpen }: MainMenuProps) {
  const classes = useMainMenuStyles({});
  return (
    <div
      className={classes.list}
      role="presentation"
      onClick={() => setMainMenuOpen(false)}
      onKeyDown={() => setMainMenuOpen(false)}
    >
      <MainOptions />
    </div>
  );
}

const ScrollConstruct = React.memo(() => {
  useScrollMemory();
  return null;
});

function useScrollMemory() {
  const [historyState, { update }] = useLayoutHistory();
  const scroll = historyState ? historyState.scroll || 0 : null;
  const isScrollHot = useRef(false);
  const totalHeight = useTotalHeight(isScrollHot.current);
  const ignoreScrollEvent = useRef(null);

  useEffect(() => {
    if (isScrollHot.current) return;
    ignoreScrollEvent.current = true;
    document.querySelector("html").scrollTop = scroll;
  }, [totalHeight, isScrollHot.current]);

  useEffect(() => {
    let t;
    function onScroll() {
      if (ignoreScrollEvent.current) {
        ignoreScrollEvent.current = false;
        return;
      }

      isScrollHot.current = true;
      let s = document.querySelector("html").scrollTop;
      clearTimeout(t);
      t = setTimeout(() => {
        update({ scroll: s });
      }, 100);
    }
    /*after 1 sec of no reruns start updating scroll*/
    let t1 = setTimeout(
      () => document.addEventListener("scroll", onScroll),
      1000
    );
    return () => {
      clearTimeout(t);
      clearTimeout(t1);
      document.removeEventListener("scroll", onScroll);
    };
  });
}

function useTotalHeight(isAlreadyHot) {
  const [height, setheight] = useState(
    document.querySelector("html").scrollHeight
  );
  useEffect(() => {
    if (isAlreadyHot) return;
    let t = setInterval(
      () => setheight(document.querySelector("html").scrollHeight),
      200
    );
    setTimeout(() => {
      clearInterval(t);
    }, 10000);
    return () => clearInterval(t);
  }, [isAlreadyHot]);
  return height;
}
