import * as React from "react";
import { useState, useEffect } from "react";
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

interface RouterPropsScroll {
  scrollTop: number;
}
interface LayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  control: React.ReactNode;
  router?: RouteComponentProps<null, null, RouterPropsScroll>;
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

function useScroll(router: RouteComponentProps<null, null, RouterPropsScroll>) {
  console.log(router);
  const [scrollTop, setScrollTop] = useState(
    router && router.location.state && router.location.state.scrollTop
  );
  useEffect(() => {
    //@ts-ignore
    window.__scrollhistory__ = window.__scrollhistory__ || [];
    return () => {
      //@ts-ignore
      window.__scrollhistory__.push(scrollTop);
    };
  }, []);

  useEffect(() => {
    if (!router) return;
    document.querySelector("html").scrollTop =
      router && router.location.state && router.location.state.scrollTop;
  }, []);
  useEffect(() => {
    if (!router) return;
    function w(e) {
      if (!router) return;
      let s = document.querySelector("html").scrollTop;
      setScrollTop(s);
    }

    document.addEventListener("scroll", w);
    return () => {
      document.removeEventListener("scroll", w);
    };
  }, []);
}
