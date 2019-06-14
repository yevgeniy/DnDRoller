import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import Games from "@material-ui/icons/Games";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import blue from "@material-ui/core/colors/blue";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccessTime from "@material-ui/icons/AccessTime";
import FlashOn from "@material-ui/icons/FlashOn";
import Divider from "@material-ui/core/Divider";
import moment from "moment";
import Delete from "@material-ui/icons/Delete";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemSecondaryAction,
  Paper
} from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

import FaceIcon from "@material-ui/icons/Face";

import Collapse from "@material-ui/core/Collapse";

import Drawer from "@material-ui/core/Drawer";

import Checkbox from "@material-ui/core/Checkbox";

import { ModelActor } from "../models/ModelActor";
import { useInstance, useActor, useInstanceIdsForActor } from "../util/hooks";

import PageActorActions from "./PageActorsActions";
const useStyles = makeStyles(theme =>
  createStyles({
    card: {},
    cardContent: {
      marginTop: theme.spacing(1),
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        flex: 1,
        [theme.breakpoints.down("xs")]: {
          flexBasis: "100%",
          flexShrink: 0
        }
      }
    },
    removeInstance: {
      "& svg": {
        color: red[600]
      }
    },
    addInstanceButton: {
      background: green[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    removeFromInstanceStart: {
      background: red[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    deleteActorButton: {
      background: orange[600],
      marginLeft: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
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
    instanceAvatar: {
      backgroundColor: blue[500]
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
    },
    deleteContainer: {
      display: "flex",
      justifyContent: "flex-end"
    },
    instancesControls: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: theme.spacing(1)
    }
  })
);

type ActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
  classes?: { card: string };
  setSortActor?: (a: ModelActor) => void;
  setSelected?: (f: boolean) => void;
  deleteActor: (i: number) => void;
  selected?: boolean;
  discover?: number;
};

function Actor(props: ActorProps) {
  const classes = useStyles(props);
  const [actor, updateActor] = useActor(props.id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectActors, setSelectInstances] = useState(false);
  const [deleteInstances, setDeleteInstances] = useState(false);
  const [
    instanceIds,
    attatchInstance,
    detatchInstance
  ] = useInstanceIdsForActor(props.id);

  const [expanded, setExpanded] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const elmRef = useDiscover(props.discover, props.id, setExpanded);

  useEffect(() => {
    if (!actor) return;
    props.setSortActor(actor);
  }, [actor]);
  useEffect(() => {
    if (!confirmDelete) return;
    setTimeout(() => setConfirmDelete(false), 1500);
  }, [confirmDelete]);

  function handleExpandClick(e) {
    e.stopPropagation();
    setExpanded(!expanded);
  }
  function openActionPanel(e) {
    e.stopPropagation();
    setOpenAction(true);
  }
  function deleteActor(e) {
    console.log(props.id);
    props.deleteActor(props.id);
  }
  function removeInstance(instanceId: number) {
    detatchInstance(instanceId);
  }

  if (!actor) return null;
  const c = [];
  for (let i in actor.class) c.push(`${i} lvl ${actor.class[i]}`);

  const renderView = () => {
    return (
      <>
        <Card className={classes.card} ref={elmRef}>
          <CardHeader
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
                  aria-expanded={expanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </>
            }
            title={
              <a type="link" href="#" onClick={openActionPanel}>
                {actor.name}
              </a>
            }
          />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Divider />
              <div className={classes.cardContent}>
                <div>
                  <div className={classes.deleteContainer}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={e =>
                        confirmDelete ? deleteActor(e) : setConfirmDelete(true)
                      }
                      button="true"
                      className={classes.deleteActorButton}
                    >
                      <Delete />
                      {confirmDelete ? "...again to confirm" : "Delete Actor"}
                    </Button>
                  </div>
                  <div className={classes.instancesControls}>
                    <Button
                      variant="contained"
                      color="secondary"
                      button="true"
                      onClick={e => setSelectInstances(true)}
                      className={classes.addInstanceButton}
                    >
                      <Games />
                      Update Instances
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      button="secondary"
                      onClick={e => setDeleteInstances(!deleteInstances)}
                      className={classes.removeFromInstanceStart}
                    >
                      <Games />
                      {deleteInstances ? "...cancel" : "Remove from Instances"}
                    </Button>
                  </div>
                </div>
                <div>
                  <Paper>
                    <List
                      subheader={
                        <ListSubheader component="div">Instances</ListSubheader>
                      }
                    >
                      {(instanceIds || []).map(v => (
                        <InstanceEntry
                          key={v}
                          id={v}
                          removeInstance={removeInstance}
                          deleteInstances={deleteInstances}
                        />
                      ))}
                    </List>
                  </Paper>
                </div>
              </div>
            </CardContent>
          </Collapse>
        </Card>
        <Drawer
          open={openAction}
          anchor="right"
          onClose={() => setOpenAction(false)}
        >
          <div>
            <PageActorActions
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
}

function useDiscover(
  discover: number,
  id: number,
  setExpanded: (f: boolean) => void
) {
  const ref = useRef();
  const [discovered, setDiscovered] = useState(false);

  useEffect(() => {
    if (discover !== id) return;
    setExpanded(true);
  }, []);
  useEffect(() => {
    if (discovered) return;
    if (discover !== id) return;
    if (!ref.current) return;
    //@ts-ignore
    ref.current.scrollIntoView();
    setDiscovered(true);
  });

  return ref;
}

interface ActorEntryProps {
  id: number;
  removeInstance: (a: number) => void;
  deleteInstances: boolean;
}
const InstanceEntry = (props: ActorEntryProps) => {
  const classes = useStyles();
  const [instance] = useInstance(props.id);

  if (!instance) return null;

  let c = [];

  return (
    <ListItem
      button
      component={Link}
      to={{
        pathname: "/instances",
        state: {
          discover: props.id
        }
      }}
    >
      <ListItemAvatar>
        <Avatar className={clsx(classes.avatar, classes.instanceAvatar)}>
          {instance.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={instance.name} />
      {props.deleteInstances ? (
        <ListItemSecondaryAction>
          <IconButton
            onClick={e => props.removeInstance(props.id)}
            className={classes.removeInstance}
            edge="end"
            aria-label="Comments"
          >
            <RemoveCircle />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default Actor;
