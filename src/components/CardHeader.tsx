import * as React from "react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import purple from "@material-ui/core/colors/purple";

import { CardHeader as MuiCardHeader, Fab } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { CardHeaderProps as MuiCardHeaderProps } from "@material-ui/core/CardHeader";
import { Swipeable } from "react-swipeable";
import { ContextMenu } from "./index";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {
        position: "relative"
      },
      swiper: {},
      contextmenu: {
        position: "absolute",
        left: 5,
        right: 5,
        top: 5,
        bottom: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "all ease 200ms",
        pointerEvents: "none"
      },
      contextmenuBackground: {
        position: "absolute",
        width: "0%",
        right: 0,

        height: "100%",
        background: purple[600],
        transition: "all ease 200ms"
      },
      contextmenuOpen: {
        pointerEvents: "all",
        width: "100%"
      },

      contextmenuItems: {
        opacity: 0,
        transition: "all ease 200ms",
        "& svg": {
          transition: "all ease 200ms",
          color: purple[600]
        }
      },
      contextmenuItemOpen: {
        opacity: 1,
        pointerEvents: "all"
      },
      active: {
        "& svg": {
          transform: "scale(2)"
        }
      }
    });
  },
  { name: "CardHeaderWrapper" }
);
const useCardHeaderStyles = makeStyles(theme => {
  return createStyles({
    root: {
      padding: "7px 10px" /*why is padding not working*/,
      [theme.breakpoints.up("sm")]: {
        padding: ""
      }
    },
    action: {
      display: "flex",
      alignItems: "center"
    }
  });
});

type CardHeaderProps = MuiCardHeaderProps & {
  contextmenu?: React.ReactElement;
};

const CardHeader = (props: CardHeaderProps) => {
  const cardHeaderClasses = useCardHeaderStyles(props);

  if (props.contextmenu)
    return (
      <MuiCardHeader
        classes={cardHeaderClasses}
        {...props}
        component={SwipeCompWrapper}
      />
    );

  return <MuiCardHeader classes={cardHeaderClasses} {...props} />;
};

const SwipeCompWrapper = ({ ...props }) => {
  const classes = useStyles(props);

  const { isOpen, onOpen, onClose } = props.contextmenu.props;
  const { elmRef } = usecontextmenu({ isOpen, onClose });
  const moveref = useRef({ x: 0, y: 0 });

  const clickdetect = e => {
    const {
      current: { x, y }
    } = moveref;
    if (Math.abs(x) < 10 && Math.abs(y) < 10 && props.onClick) {
      props.onClick(e);
    }
    moveref.current = { x: 0, y: 0 };
  };

  return (
    <div className={classes.root} onClick={clickdetect}>
      <Swipeable
        {...props}
        className={clsx(classes.swiper, props.className)}
        onSwipedLeft={onOpen}
        trackMouse
        onSwiping={e => {
          moveref.current = {
            x: e.deltaX,
            y: e.deltaY
          };
        }}
      />
      <div className={classes.contextmenu}>
        <div
          className={clsx(classes.contextmenuBackground, {
            [classes.contextmenuOpen]: isOpen
          })}
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
        />
        <div
          className={clsx(classes.contextmenuItems, {
            [classes.contextmenuItemOpen]: isOpen
          })}
          onClick={e => e.stopPropagation()}
          ref={elmRef}
        >
          {props.contextmenu}
        </div>
      </div>
    </div>
  );
};

function usecontextmenu({ isOpen, onClose }) {
  const elmRef = useRef();

  useEffect(() => {
    if (!isOpen) return;

    const elm = elmRef.current;
    if (!elm) return;

    let c = false;
    const h1 = () => {
      c = true;
    };
    const h2 = () => {
      if (c) {
        c = false;
        return;
      }
      onClose();
    };

    // @ts-ignore
    elm.addEventListener("click", h1);
    document.addEventListener("click", h2);
    return () => {
      // @ts-ignore
      elm.removeEventListener("click", h1);
      document.removeEventListener("click", h2);
    };
  }, [isOpen]);

  return { elmRef };
}

export default CardHeader;
