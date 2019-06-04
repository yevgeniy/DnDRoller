import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import MainOptions from "./components/MainOptions";
import { RouterContextView } from "./util/routerContext";

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
export default (props: LayoutProps) => {
  const classes = useStyles();
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  useScroll(props.router);

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
  const classes = useMainMenuStyles();
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

function useScroll() {
  let router = useContext(RouterContextView);
  //@ts-ignore
  router = router || {
    history: {
      replace: function() {}
    },
    location: {
      state: null
    }
  };
  router.location.state = router.location.state || {};
  const [scroll, setScroll] = useState(router.location.state.scrollTop);
  let [scrollHeight, setScrollHeight] = useState(
    document.querySelector("html").scrollHeight
  );
  useEffect(() => {
    if (!router) return;
    let t = setTimeout(() => {
      router.history.replace(router.location.pathname, {
        ...(router.location.state || {}),
        scrollTop: scroll
      });
    }, 100);
    return () => {
      clearTimeout(t);
    };
  }, [scroll]);
  useEffect(() => {
    if (!router) return;
    function w(e) {
      let s = document.querySelector("html").scrollTop;
      setScroll(s);
      setScrollHeight = function() {};
    }
    document.addEventListener("scroll", w);
    return () => {
      document.removeEventListener("scroll", w);
    };
  }, []);

  useEffect(() => {
    let t = setInterval(
      () => setScrollHeight(document.querySelector("html").scrollHeight),
      100
    );
    let t1 = setTimeout(() => clearInterval(t), 5000);
    return () => {
      clearInterval(t);
      clearInterval(t1);
    };
  }, []);

  useEffect(() => {
    document.querySelector("html").scrollTop = scroll;
  }, [scrollHeight]);
}
