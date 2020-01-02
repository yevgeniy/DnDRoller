import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import purple from "@material-ui/core/colors/purple";
import Delete from "@material-ui/icons/Delete";
import Clone from "@material-ui/icons/CallSplit";

import {
  CardHeader,
  ContextMenu,
  EntityHeaderActions,
  EntityContent,
  EntityActions
} from "../components";
import {
  Card,
  Fab,
  Divider,
  CardContent,
  Collapse,
  Drawer,
  Checkbox
} from "@material-ui/core";

import { useHot, useDiscover, useModalState } from "../util/hooks";

import { useOpenStream } from "../util/sync";

const useStyles = makeStyles(theme =>
  createStyles({
    card: {},
    deleteButton: {
      background: "white",
      "& svg": {
        transition: "all ease 200ms",
        transform: "scale(2)",
        color: purple[600],
        [theme.breakpoints.up("sm")]: {
          transform: "scale(1.5)"
        }
      }
    },
    cloneButton: {
      background: "white",
      marginLeft: theme.spacing(2),
      "& svg": {
        color: purple[600],
        transform: "scale(2)",
        [theme.breakpoints.up("sm")]: {
          transform: "scale(1.5)"
        }
      }
    },
    deleteButtonActive: {
      "& svg": {
        transform: "scale(1)"
      }
    },

    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      }),
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(2)
      }
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500],
      [theme.breakpoints.down("xs")]: {
        width: 30,
        height: 30
      }
    },

    avatarName: {
      textTransform: "none",
      padding: 0,
      background: 0,
      minWidth: "auto"
    },
    content: {
      marginTop: theme.spacing(1)
    },
    chip: {
      color: red[600],
      borderColor: orange[600],
      margin: theme.spacing(1),
      minWidth: 70,
      justifyContent: "flex-start",
      [theme.breakpoints.down("xs")]: {
        minWidth: "auto",
        margin: theme.spacing(1 / 2)
      }
    },
    margin: {
      margin: theme.spacing(1)
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    }
  })
);
//ex = { [P in keyof ActorModel]?: ActorModel[P] }

type IEntity = {
  id: number;
  updateEntity?: (a: any) => boolean | void;
  classes?: { card: string };
  isSelected?: boolean;
  deleteEntity?: () => void;
  setSelected?: (f: boolean) => void;
  cloneEntity?: () => any;
  discover?: number;
  subheader: React.ReactElement | React.ReactElement[] | string;
  title: React.ReactElement | React.ReactElement[] | string;
  children: React.ReactElement | React.ReactElement[];
};
const Entity = React.memo(function<T>({
  id,
  updateEntity,
  classes: props_classes,
  isSelected,
  deleteEntity,
  setSelected,
  cloneEntity,
  discover,
  children,
  subheader,
  title
}: IEntity) {
  const classes = useStyles({ classes: props_classes });

  const [
    { isExpanded },
    { update: updateHistoryState }
  ] = useOpenStream.historyState(`${Entity.name}|${id}`);

  const {
    isOpen: isActionsOpen,
    doOpen: doActionsOpen,
    doClose: doActionsClose,
    onDone: onActionsDone
  } = useModalState<T>(false);
  const {
    isOpen: isContextMenuOpen,
    doOpen: doContextmMenuOpen,
    doClose: doContextMenuClose,
    onDone: onContextMenuDone
  } = useModalState(false);

  const elmRef = useDiscover(discover === id, () =>
    updateHistoryState({ isExpanded: true })
  );
  const { hot: hotDelete, setHot: setHotDelete } = useHot();

  function handleExpandClick(e) {
    e.stopPropagation();
    updateHistoryState({ isExpanded: !isExpanded });
  }
  function openActionPanel(e) {
    e.stopPropagation();
    doActionsOpen().then(updates => {
      if (updates) updateEntity(updates);
      doActionsClose();
    });
  }

  const doClone = () => {
    cloneEntity();
    doContextMenuClose();
  };
  const doDelete = () => {
    if (hotDelete) {
      deleteEntity();
      doContextMenuClose();
    } else setHotDelete(true);
  };

  const renderView = () => {
    return (
      <>
        <Card className={classes.card} ref={elmRef}>
          <CardHeader
            contextmenu={
              <ContextMenu
                isOpen={isContextMenuOpen}
                onOpen={doContextmMenuOpen}
                onClose={doContextMenuClose}
              >
                <Fab
                  className={clsx(classes.deleteButton, {
                    [classes.deleteButtonActive]: hotDelete
                  })}
                  onClick={doDelete}
                  variant="extended"
                  color="default"
                  size="small"
                  type="submit"
                >
                  <Delete />
                </Fab>
                <Fab
                  className={classes.cloneButton}
                  onClick={doClone}
                  variant="extended"
                  color="default"
                  size="small"
                  type="submit"
                >
                  <Clone />
                </Fab>
              </ContextMenu>
            }
            onClick={e =>
              setSelected ? setSelected(!isSelected) : openActionPanel(e)
            }
            avatar={
              <>
                {setSelected ? (
                  <Checkbox
                    checked={isSelected}
                    inputProps={{
                      "aria-label": "primary checkbox"
                    }}
                  />
                ) : (
                  React.Children.map(children, v => v).find(
                    v => v.type === Avatar
                  )
                )}
              </>
            }
            subheader={subheader}
            action={
              <>
                {React.Children.map(children, v => v).find(
                  v => v.type === EntityHeaderActions
                )}
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: isExpanded
                  })}
                  onClick={handleExpandClick}
                  onMouseDown={e => e.stopPropagation()}
                  onMouseUp={e => e.stopPropagation()}
                  aria-expanded={isExpanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </>
            }
            title={
              React.isValidElement(title)
                ? React.cloneElement(title, {
                    onClick: doActionsOpen
                  })
                : title
            }
          />
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Divider />
              {React.Children.map(children, v => {
                if (v.type === EntityContent)
                  return React.cloneElement(v, {
                    updateEntity
                  });
                return v;
              }).find(v => v.type === EntityContent)}
            </CardContent>
          </Collapse>
        </Card>
        <Drawer open={isActionsOpen} anchor="right" onClose={doActionsClose}>
          <div>
            {React.Children.map(children, v => {
              if (v.type === EntityActions) {
                return React.cloneElement(v, {
                  onDone: onActionsDone
                });
              }
              return v;
            }).find(v => v.type === EntityActions)}
          </div>
        </Drawer>
      </>
    );
  };

  return renderView();
});

export default Entity;