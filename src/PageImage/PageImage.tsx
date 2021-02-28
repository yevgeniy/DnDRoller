import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { IconButton, makeStyles, createStyles } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import BackIcon from "@material-ui/icons/Reply";
import { useImage } from "../util/hooks";
import {
  RouterContextView,
  RouterViewContextState
} from "../util/routerContext";
import { RouteComponentProps } from "react-router-dom";

import panzoom from "panzoom";

const useStyles = makeStyles(theme => {
  return createStyles({
    root: {
      top: 0,
      left: 0,
      position: "fixed",
      height: "100vh",
      width: "100%",
      background: theme.palette.background.default
    },
    imgContainer: {
      position: "relative",
      height: "100vh",
      width: "100%"
    },
    img: {
      maxWidth: "98%",
      maxHeight: "98%",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: "auto",
      transition: "ease all 300ms"
    },
    backButton: {
      position: "fixed",
      zIndex: 9999999,
      left: 5,
      top: 5,
      background: theme.palette.secondary.dark,
      opacity: 0.8,
      color: theme.palette.secondary.contrastText,
      transition: "ease all 300ms",
      "&:hover": {
        background: theme.palette.secondary.light
      }
    },
    menuButton: {
      position: "fixed",
      zIndex: 9999999,
      right: 5,
      top: 5,
      background: theme.palette.primary.dark,
      opacity: 0.8,
      color: theme.palette.primary.contrastText,
      transition: "ease all 300ms",
      "&:hover": {
        background: theme.palette.primary.light
      }
    }
  });
});

interface PageImageLocationState {
  imageId?: number;
}

const PageImage = React.memo(
  (
    props: RouteComponentProps<
      {},
      {},
      RouterViewContextState & PageImageLocationState
    >
  ) => {
    const [, , , url] = useImage(props.location.state.imageId);
    const classes = useStyles({});

    const imgRef = useRef();
    const [zoom, setZoom] = useState(1);
    const back = () => {
      props.history.goBack();
    };

    useEffect(() => {
      const work = e => e.preventDefault();
      document.addEventListener("touchmove", work);
      document.body.style.touchAction = "none";
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("touchmove", work);
        document.body.style.touchAction = "";
        document.body.style.overflow = "";
      };
    }, []);

    useEffect(() => {
      let instance;
      let zoom = 1;
      const loaded = () => {
        instance = panzoom(document.querySelector("#panthis"), {
          onTouch: function(e) {
            let paths = [...e.composedPath()].map(v => {
              return v.id;
            });
            if (paths.some(v => v === "backButton" || v === "menuButton"))
              return false;
            return true;
          },
          minZoom: 1,
          smoothScroll: false
        });
        // @ts-ignore
        const origWidth = imgRef.current.getBoundingClientRect().width;
        const work = e => {
          setTimeout(() => {
            // @ts-ignore
            zoom = imgRef.current.getBoundingClientRect().width / origWidth;
            setZoom(zoom);
            if (1.05 > zoom && zoom >= 1) e.moveTo(0, 0);
          }, 100);
        };
        instance.on("zoom", work);
        instance.on("panend", work);
      };
      // @ts-ignore
      imgRef.current.addEventListener("load", loaded);
      return () => {
        // @ts-ignore
        imgRef.current.removeEventListener("load", loaded);
        instance && instance.dispose();
      };
    }, []);

    return (
      <div className={classes.root}>
        <div id="panthis" className={classes.imgContainer}>
          <img ref={imgRef} className={classes.img} src={url} alt="" />
        </div>
        <IconButton
          id="backButton"
          className={classes.backButton}
          onClick={back}
        >
          <BackIcon />
        </IconButton>
      </div>
    );
  }
);

export default PageImage;
