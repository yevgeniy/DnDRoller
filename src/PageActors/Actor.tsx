import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import purple from "@material-ui/core/colors/purple";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Delete from "@material-ui/icons/Delete";
import FaceIcon from "@material-ui/icons/Face";
import Clone from "@material-ui/icons/CallSplit";

import { CardHeader, ContextMenu } from "../components";
import ActorContent from "./ActorContent";
import {
  Card,
  Fab,
  Divider,
  CardContent,
  Button,
  Chip,
  Collapse,
  Drawer,
  Checkbox
} from "@material-ui/core";

import { ModelActor } from "../models/ModelActor";
import { useActor, useHot, useDiscover } from "../util/hooks";

import Actions from "./Actions";

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

type ActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
  classes?: { card: string };
  setSortActor?: (a: ModelActor) => void;
  setSelected?: (f: boolean) => void;
  deleteActor?: (i: number) => any;
  cloneActor?: (a: ModelActor) => any;
  selected?: boolean;
  discover?: number;
};

const Actor = React.memo((props: ActorProps) => {
  const classes = useStyles(props);
  const [actor, updateActor] = useActor(props.id);
  const cmcloser = useRef(function() {});

  const [expanded, setExpanded] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const elmRef = useDiscover(props.discover, props.id, () => setExpanded(true));
  const { hot: hotDelete, setHot: setHotDelete } = useHot();

  useEffect(() => {
    if (!actor) return;
    props.setSortActor(actor);
  }, [actor]);
  function handleExpandClick(e) {
    e.stopPropagation();
    setExpanded(!expanded);
  }
  function openActionPanel(e) {
    e.stopPropagation();
    setOpenAction(true);
  }
  function deleteActor(e = null) {
    props.deleteActor(props.id);
  }

  const doClone = () => {
    props.cloneActor({ ...actor });
    cmcloser.current();
  };
  const doDelete = () => {
    if (hotDelete) {
      deleteActor();
      cmcloser.current();
    } else setHotDelete(true);
  };

  if (!actor) return null;
  const c = [];
  for (let i in actor.class) c.push(`${i} lvl ${actor.class[i]}`);

  const renderView = () => {
    return (
      <>
        <Card className={classes.card} ref={elmRef}>
          <CardHeader
            contextmenu={
              <ContextMenu
                onOpen={c => {
                  cmcloser.current = c;
                }}
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
              props.setSelected
                ? props.setSelected(!props.selected)
                : openActionPanel(e)
            }
            avatar={
              <>
                {props.setSelected ? (
                  <Checkbox
                    checked={props.selected}
                    inputProps={{
                      "aria-label": "primary checkbox"
                    }}
                  />
                ) : (
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                    {actor.name[0]}
                  </Avatar>
                )}
              </>
            }
            subheader={c.join(", ")}
            action={
              <>
                <Chip
                  icon={<FaceIcon />}
                  label={actor.hp ? `${actor.hpCurrent}/${actor.hp}` : "--"}
                  className={classes.chip}
                  color="secondary"
                  variant="outlined"
                />
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded
                  })}
                  onClick={handleExpandClick}
                  onMouseDown={e => e.stopPropagation()}
                  onMouseUp={e => e.stopPropagation()}
                  aria-expanded={expanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </>
            }
            title={
              <Button className={classes.avatarName} onClick={openActionPanel}>
                {actor.name}
              </Button>
            }
          />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Divider />
              <ActorContent updateActor={updateActor} {...actor} />
            </CardContent>
          </Collapse>
        </Card>
        <Drawer
          open={openAction}
          anchor="right"
          onClose={() => setOpenAction(false)}
        >
          <div>
            <Actions
              updateActor={updateActor}
              setOpenAction={setOpenAction}
              {...actor}
            />
          </div>
        </Drawer>
      </>
    );
  };

  return renderView();
});

export default Actor;
