import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
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
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import Delete from "@material-ui/icons/Delete";
import AccessTime from "@material-ui/icons/AccessTime";
import FlashOn from "@material-ui/icons/FlashOn";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import DirectionsRun from "@material-ui/icons/DirectionsRun";
import moment from "moment";
import PageInstancesActions from "./PageInstancesActions";

import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import Checkbox from "@material-ui/core/Checkbox";

import Collapse from "@material-ui/core/Collapse";

import Drawer from "@material-ui/core/Drawer";
import Dialog from "@material-ui/core/Dialog";

import PageInstanceActions from "./PageInstanceActions";
import { ModelInstance } from "../models/ModelInstance";
import { useService, useActor, useInstance } from "../util/hooks";
import ServiceInstance from "../services/ServiceInstance";

import PageActorAdd from "../PageActorAdd";

import { RouterContextView } from "../util/routerContext";

import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemSecondaryAction,
  Paper
} from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    card: {},
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
    actorAvatar: {
      backgroundColor: blue[500]
    },
    removeActor: {
      "& svg": {
        color: red[600]
      }
    },
    instanceControls: {
      padding: theme.spacing(1)
    },
    cardContent: {
      marginTop: theme.spacing(1),
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        flex: 1,
        [theme.breakpoints.down("xs")]: {
          flexBasis: "100%",
          flexShrink: 0,
          marginTop: theme.spacing(1)
        }
      }
    },
    chip: {
      color: orange[600],
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
    addActorButton: {
      background: green[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    deleteActorStart: {
      background: red[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    deleteInstanceButton: {
      background: orange[600],
      marginLeft: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    }
  })
);

type InstanceProps = { [P in keyof ModelInstance]?: ModelInstance[P] } & {
  classes?: { card: string };
  setSortInstance?: (a: ModelInstance) => void;
  deleteInstance?: (i: number) => void;
  setSelected?: (f: boolean) => void;
  selected?: boolean;
};

function Instance(props: InstanceProps) {
  const classes = useStyles(props);
  const [instance, updateInstance] = useInstance(props.id);
  const [deleteActors, setDeleteActors] = useState(false);

  const [openAction, setOpenAction] = useState(false);
  const { expanded, setExpanded } = useRouterMemories(props.id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectActors, setSelectActors] = useState(false);

  useEffect(() => {
    if (!instance) return;
    props.setSortInstance(instance);
  }, [instance]);
  useEffect(() => {
    if (!confirmDelete) return;
    setTimeout(() => setConfirmDelete(false), 1500);
  }, [confirmDelete]);

  const handleExpandClick = e => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  const openActionPanel = e => {
    e.stopPropagation();
    setOpenAction(true);
  };
  const removeActor = id => {
    if (!instance) return;
    updateInstance({ actors: instance.actors.filter(v => v !== id) });
  };
  const deleteInstance = e => {
    if (!instance) return;
    props.deleteInstance(props.id);
  };
  const onAddActors = a => {
    updateInstance({ actors: [...a] });
    setSelectActors(false);
  };

  if (!instance) return null;

  return (
    <>
      <Card className={classes.card}>
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
                  {instance.name[0]}
                </Avatar>
              )}
            </>
          }
          action={
            <>
              <Chip
                icon={<AccessTime />}
                label={moment()
                  .subtract(+new Date() - instance.created, "ms")
                  .calendar()}
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
          title={instance.name}
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Divider />
            <div className={classes.cardContent}>
              <div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={e =>
                      confirmDelete ? deleteInstance(e) : setConfirmDelete(true)
                    }
                    button="true"
                    className={classes.deleteInstanceButton}
                  >
                    <Delete />
                    {confirmDelete ? "...again to confirm" : "Delete Instance"}
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    button="true"
                    onClick={e => setSelectActors(true)}
                    className={classes.addActorButton}
                  >
                    <DirectionsRun />
                    Update Actors
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    button="secondary"
                    onClick={e => setDeleteActors(!deleteActors)}
                    className={classes.deleteActorStart}
                  >
                    <DirectionsRun />
                    {deleteActors ? "...cancel" : "Delete Actors"}
                  </Button>
                </div>
              </div>
              <div>
                <Paper>
                  <List
                    subheader={
                      <ListSubheader component="div">Actors</ListSubheader>
                    }
                  >
                    {instance.actors.map(v => (
                      <ActorEntry
                        key={v}
                        id={v}
                        removeActor={removeActor}
                        deleteActors={deleteActors}
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
          <PageInstancesActions
            updateInstance={updateInstance}
            setOpenAction={setOpenAction}
            {...instance}
          />
        </div>
      </Drawer>
      <Drawer
        anchor="top"
        open={selectActors}
        onClose={e => setSelectActors(false)}
      >
        <PageActorAdd onDone={onAddActors} selected={instance.actors} />
      </Drawer>
    </>
  );
}

interface ActorEntryProps {
  id: number;
  removeActor: (a: number) => void;
  deleteActors: boolean;
}
const ActorEntry = (props: ActorEntryProps) => {
  const classes = useStyles();
  const [actor] = useActor(props.id);

  if (!actor) return null;

  let c = [];
  for (let i in actor.class) {
    c.push(`${i} lvl: ${actor.class[i]}`);
  }

  return (
    <ListItem
      button
      component={Link}
      to={{
        pathname: "/actors",
        state: {
          discover: props.id
        }
      }}
    >
      <ListItemAvatar>
        <Avatar className={clsx(classes.avatar, classes.actorAvatar)}>
          {actor.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={actor.name} secondary={<>{c.join(", ")}</>} />
      {props.deleteActors ? (
        <ListItemSecondaryAction>
          <IconButton
            onClick={e => props.removeActor(props.id)}
            className={classes.removeActor}
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

function useRouterMemories(id: number) {
  const router = useContext(RouterContextView);
  router.location.state = router.location.state || {};
  router.location.state.menuOpen = router.location.state.menuOpen || {};

  const [expanded, setExpanded] = useState(router.location.state.menuOpen[id]);

  useEffect(() => {
    router.history.replace(router.location.pathname, {
      ...(router.location.state || {}),
      menuOpen: { ...router.location.state.menuOpen, [id]: expanded }
    });
  }, [expanded]);

  return {
    expanded,
    setExpanded
  };
}

export default Instance;
