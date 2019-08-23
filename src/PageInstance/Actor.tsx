import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CardHeader, ContextMenu } from "../components";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import purple from "@material-ui/core/colors/purple";
import orange from "@material-ui/core/colors/orange";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FlashOn from "@material-ui/icons/FlashOn";
import Delete from "@material-ui/icons/Delete";
import Clone from "@material-ui/icons/CallSplit";

import { Divider, Paper, List, ListSubheader, Fab } from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";

import Collapse from "@material-ui/core/Collapse";

import Drawer from "@material-ui/core/Drawer";

import Actions from "./Actions";
import { ModelActor } from "../models/ModelActor";
import { useHistoryState, useService, useImage, useHot } from "../util/hooks";
import ServiceActor from "../services/ServiceActor";

const useActorStyles = makeStyles(theme =>
  createStyles({
    card: {},
    deleteButton: {
      background: "white",
      "& svg": {
        transition: "all ease 200ms",
        transform: "scale(2)",
        color: purple[600]
      }
    },
    deleteButtonActive: {
      "& svg": {
        transform: "scale(1)"
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
    imageContainer: {
      display: "flex",
      flexWrap: "nowrap",
      width: "90vw",
      overflow: "auto"
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
    content: {
      marginTop: theme.spacing(1)
    },
    chip: {
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
    actorControls: {
      display: "flex",
      justifyContent: "space-between"
    },
    imagesContainer: {
      marginTop: theme.spacing(1)
    },
    removeButton: {
      background: orange[600],
      marginLeft: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    }
  })
);

type ActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
  classes?: { card: string };
  setSortActor?: (a: ModelActor) => void;
  resetActor?: number;
  removeActor?: (id: number) => void;
  cloneActor?: (actor: ModelActor) => any;
};

const Actor = React.memo((props: ActorProps) => {
  const classes = useActorStyles(props);
  const [actor, updateActor] = useActor(props.id, props.resetActor);
  const { hot: hotDelete, setHot: setHotDelete } = useHot();
  const cmcloser = useRef(function() {});
  const { isExpanded, setIsExpanded } = useRouterMemories(props.id);

  useEffect(() => {
    if (!actor) return;
    props.setSortActor(actor);
  }, [actor]);

  const [openAction, setOpenAction] = useState(false);

  function removeActor(e = null) {
    props.removeActor(props.id);
  }
  function handleExpandClick(e) {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }
  function openActionPanel(e) {
    e.stopPropagation();
    setOpenAction(true);
  }
  const doDelete = () => {
    if (hotDelete) {
      removeActor();
      cmcloser.current();
    } else setHotDelete(true);
  };
  const doClone = () => {
    props.cloneActor(actor);
    removeActor();
  };

  if (!actor) return null;

  const c = [];
  for (let i in actor.class) c.push(`${i}: ${actor.class[i]}`);

  return (
    <>
      <Card className={classes.card}>
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
          onClick={openActionPanel}
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {actor.name[0]}
            </Avatar>
          }
          action={
            <>
              {actor.initiative ? (
                <Chip
                  icon={<FlashOn />}
                  label={actor.initiative}
                  className={classes.chip}
                  color="primary"
                  variant="outlined"
                />
              ) : null}

              <Chip
                icon={<FaceIcon />}
                label={`${actor.hpCurrent}/${actor.hp}`}
                className={classes.chip}
                color="secondary"
                variant="outlined"
              />
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: isExpanded
                })}
                onClick={handleExpandClick}
                aria-expanded={isExpanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </>
          }
          title={actor.name}
          subheader={c.join(", ")}
        />
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Divider />
            <div className={classes.content}>
              <div className={classes.actorControls}>
                <div>
                  <Typography variant="h5">{actor.race}</Typography>
                  <Typography variant="caption">{actor.size}</Typography>
                </div>
              </div>

              {actor.images && actor.images.length && (
                <div className={classes.imagesContainer}>
                  <Paper>
                    <List
                      subheader={
                        <ListSubheader component="div">Images</ListSubheader>
                      }
                    >
                      <div className={classes.imageContainer}>
                        {(actor.images || []).map(v => (
                          <ImageEntry key={v} id={v} />
                        ))}
                      </div>
                    </List>
                  </Paper>
                </div>
              )}
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
          <Actions {...{ updateActor, setOpenAction, ...actor }} />
        </div>
      </Drawer>
    </>
  );
});

const useImageEntryPropsStyles = makeStyles(theme => {
  return createStyles({
    entry: {
      padding: theme.spacing(1 / 2),
      position: "relative",
      "& img": {
        height: "200px"
      }
    }
  });
});
interface ImageEntryProps {
  id: number;
}
const ImageEntry = React.memo((props: ImageEntryProps) => {
  const classes = useImageEntryPropsStyles();
  const { image, url } = useImage(props.id);
  if (!image) return null;
  if (!url) return null;
  return (
    <div className={classes.entry}>
      <Link to={{ pathname: "/image", state: { imageId: image.id } }}>
        <img src={url} alt="" />
      </Link>
    </div>
  );
});

function useActor(id: number, resetActorToken?: number) {
  const serviceActor = useService(ServiceActor);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    if (!serviceActor) return;
    serviceActor.get(id).then(setActor);
  }, [serviceActor]);

  useEffect(() => {
    if (!resetActorToken) return;
    if (!actor) return;

    updateActor({ hp: actor.hpCurrent, initiative: null });
  }, [resetActorToken]);

  function updateActor(updateActor) {
    setActor({ ...actor, ...updateActor });
  }

  return [actor, updateActor];
}
function useRouterMemories(id: number) {
  const { state, updateState } = useHistoryState(`actor-${id}`, {
    isExpanded: false
  });

  return {
    ...state,
    setIsExpanded: f => updateState({ isExpanded: f })
  };
}

export default Actor;
