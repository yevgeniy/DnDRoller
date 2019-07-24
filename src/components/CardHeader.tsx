import * as React from "react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import purple from "@material-ui/core/colors/purple";

import { CardHeader as MuiCardHeader, Fab } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { CardHeaderProps as MuiCardHeaderProps } from "@material-ui/core/CardHeader";
import { Swipeable } from "react-swipeable";

const useStyles = makeStyles(
    theme => {
        return createStyles({
            root: {
                position: "relative"
            },
            contextMenu: {
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
            contextMenuBackground: {
                position: "absolute",
                width: "0%",
                right: 0,

                height: "100%",
                background: purple[600],
                transition: "all ease 200ms"
            },
            contextMenuOpen: {
                pointerEvents: "all",
                width: "100%"
            },

            contextMenuItems: {
                opacity: 0,
                transition: "all ease 200ms",
                "& svg": {
                    transition: "all ease 200ms",
                    color: purple[600]
                }
            },
            contextMenuItemOpen: {
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
            padding: "7px 10px",
            [theme.breakpoints.up("sm")]: {
                padding: ""
            }
        }
    });
});

type CardHeaderProps = MuiCardHeaderProps & {
    contextMenu?: React.ReactElement;
};

const CardHeader = props => {
    const cardHeaderClasses = useCardHeaderStyles(props);

    if (props.contextMenu)
        return (
            <MuiCardHeader
                classes={cardHeaderClasses}
                {...props}
                component={SwipeCompWrapper}
            />
        );

    return <MuiCardHeader classes={cardHeaderClasses} {...props} />;
};

const SwipeCompWrapper = ({ onClick, ...props }) => {
    const classes = useStyles(props);
    const { open, setOpen, setClose, elmRef } = useContextMenu();
    const moveref = useRef({ x: 0, y: 0 });

    const clickeval = e => {
        onClick &&
            Math.abs(moveref.current.x) < 10 &&
            Math.abs(moveref.current.y) < 10 &&
            onClick(e);
    };
    return (
        <div
            className={classes.root}
            onMouseDown={e => {
                moveref.current = { x: 0, y: 0 };
            }}
            onMouseUp={clickeval}>
            <Swipeable
                {...props}
                onSwipedLeft={setOpen}
                trackMouse
                onSwiping={e => {
                    moveref.current = {
                        x: e.deltaX,
                        y: e.deltaY
                    };
                }}
            />
            <div className={classes.contextMenu}>
                <div
                    className={clsx(classes.contextMenuBackground, {
                        [classes.contextMenuOpen]: open
                    })}
                    onClick={setClose}
                    onMouseDown={e => e.stopPropagation()}
                    onMouseUp={e => e.stopPropagation()}
                />
                <div
                    className={clsx(classes.contextMenuItems, {
                        [classes.contextMenuItemOpen]: open
                    })}
                    ref={elmRef}
                    onMouseDown={e => e.stopPropagation()}
                    onMouseUp={e => e.stopPropagation()}>
                    {props.contextMenu}
                </div>
            </div>
        </div>
    );
};

function useContextMenu() {
    const [open, so] = useState(false);
    const elmRef = useRef();

    useEffect(() => {
        if (!open) return;
        const elm = elmRef.current;
        if (!elm) return;

        let c = false;
        const h1 = () => {
            c = true;
            console.log("a", c);
        };
        const h2 = () => {
            if (c) {
                c = false;
                return;
            }
            so(false);
        };

        // @ts-ignore
        elm.addEventListener("click", h1);
        document.addEventListener("click", h2);
        return () => {
            // @ts-ignore
            elm.removeEventListener("click", h1);
            document.removeEventListener("click", h2);
        };
    }, [open]);

    const setOpen = () => so(true);
    const setClose = () => so(false);
    return { open, setOpen, setClose, elmRef };
}

export default CardHeader;
