import * as React from "react";
import { useState, useEffect, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import Drawer from "@material-ui/core/Drawer";
import MainOptions from "./components/MainOptions";
import { useHistoryState } from "./util/hooks";
import { RouterContextView } from "./util/routerContext";

import { useOpenStream, useMessageStream } from "./util/sync";

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

interface LayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  control: React.ReactNode;
}
export default function Layout(props: LayoutProps) {
  const classes = useStyles(props);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const router = useContext(RouterContextView);

  const { set: setHistory } = useMessageStream("history");

  useEffect(() => {
    const key = router.history.location.key;
    setHistory(key);
  }, []);

  useScrollMemory();

  return (
    <div className={classes.container}>
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
            {props.title}
          </Typography>
          {props.control}
        </Toolbar>
      </AppBar>
      <div className={classes.content}>{props.children}</div>
      <Drawer open={mainMenuOpen} onClose={() => setMainMenuOpen(false)}>
        <MainMenu {...{ classes, setMainMenuOpen }} />
      </Drawer>
    </div>
  );
}

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

function useScrollMemory() {
  const {
    state: { scroll },
    updateState
  } = useHistoryState("layout", { scroll: 0 });

  const [scrollToSet, setScrollToSet] = useState(scroll);

  let [scrollHeight, setScrollHeight] = useState(
    document.querySelector("html").scrollHeight
  );

  let t;
  const onScroll = useCallback(() => {
    let s = document.querySelector("html").scrollTop;
    /*update scroll after scrolling has stopped*/
    clearTimeout(t);
    t = setTimeout(() => {
      updateState({ scroll: s });
    }, 100);

    /*if we scrolled the page before we had opportunity to regen the scroll
    don't regen the scroll*/
    setScrollToSet(null);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  /*while there is scroll to be set we continually poll scrollheight
  for some time as the rest of the app regens it's state*/
  useEffect(() => {
    let t = setInterval(
      () =>
        scrollToSet &&
        setScrollHeight(document.querySelector("html").scrollHeight),
      100
    );
    let t1 = setTimeout(() => clearInterval(t), 5000);
    return () => {
      clearInterval(t);
      clearInterval(t1);
    };
  }, []);
  useEffect(() => {
    /*for as long as scrollheight is updating due to regen
    effects, regen the scroll top*/
    document.removeEventListener("scroll", onScroll);
    document.querySelector("html").scrollTop = scrollToSet;
    setTimeout(() => document.addEventListener("scroll", onScroll), 500);
  }, [scrollHeight]);
}
