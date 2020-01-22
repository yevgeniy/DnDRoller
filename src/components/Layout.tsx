import * as React from "react";
import { useRef, useState, useEffect, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import Drawer from "@material-ui/core/Drawer";
import MainOptions from "./MainOptions";
import { useHistoryState, useModalState } from "../util/hooks";

import { useOpenStream, useMessageStream } from "../util/sync";
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

  const { set: setHistory } = useMessageStream("history");

  const layoutControls = [];
  let layoutMenu;
  const other = [];
  React.Children.map(props.children, v => v).forEach(v => {
    if (v.type === LayoutControl) layoutControls.push(v);
    else if (v.type === LayoutMenu) layoutMenu = v;
    else other.push(v);
  });

  useEffect(() => {
    if (!props.historyId) return;
    setHistory(props.historyId);
    return () => setHistory(null);
  }, []);

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
          <Typography variant="h6" className={classes.title}>
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
  const [historyState, { update }] = useOpenStream.historyState(Layout.name);
  const scroll = historyState.scroll || 0;

  const isScrollHot = useRef(false);

  let [scrollHeight, setScrollHeight] = useState(
    document.querySelector("html").scrollHeight
  );

  let t;
  const onScroll = () => {
    let s = document.querySelector("html").scrollTop;
    /*update scroll after scrolling has stopped*/
    clearTimeout(t);
    t = setTimeout(() => {
      update({ scroll: s });
    }, 100);

    isScrollHot.current = true;
  };

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [update]);

  /*while there is scroll to be set we continually poll scrollheight
  for some time as the rest of the app regens it's state*/
  useEffect(() => {
    let t = setInterval(
      () =>
        isScrollHot.current === false &&
        setScrollHeight(document.querySelector("html").scrollHeight),
      100
    );
    let t1 = setTimeout(() => clearInterval(t), 5000);
    return () => {
      clearInterval(t);
      clearInterval(t1);
    };
  }, [scroll]);
  useEffect(() => {
    /*for as long as scrollheight is updating due to regen
    effects, regen the scroll top*/
    if (isScrollHot.current) return;
    document.removeEventListener("scroll", onScroll);
    document.querySelector("html").scrollTop = scroll;
    setTimeout(() => document.addEventListener("scroll", onScroll), 500);
  }, [scrollHeight, scroll]);
}
