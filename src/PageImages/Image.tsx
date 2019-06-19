import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Extension from "@material-ui/icons/Extension";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import blue from "@material-ui/core/colors/blue";
import purple from "@material-ui/core/colors/purple";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Delete from "@material-ui/icons/Delete";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import moment from "moment";

import { Link } from "react-router-dom";
import {
  CardMedia,
  Divider,
  IconButton,
  Avatar,
  CardContent,
  CardHeader,
  Card,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemSecondaryAction,
  Paper,
  Chip,
  Button,
  Collapse,
  Drawer,
  Checkbox
} from "@material-ui/core";

import { ModelImage } from "../models/ModelImage";
import {
  useInstance,
  useActor,
  useInstanceIdsForImage,
  useActorIdsForImage,
  useImage,
  useDiscover
} from "../util/hooks";
import Actions from "./Actions";

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

    addParticipantButton: {
      background: green[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    removeFromParticipantStart: {
      background: red[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    deleteImageButton: {
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
      backgroundColor: purple[500],
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
    participantsControls: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: theme.spacing(1)
    }
  })
);

type ImageProps = { [P in keyof ModelImage]?: ModelImage[P] } & {
  classes?: { card: string };
  setSortImage?: (a: ModelImage) => void;
  setSelected?: (f: boolean) => void;
  deleteImage: (i: number) => void;
  selected?: boolean;
  discover?: number;
};

function Image(props: ImageProps) {
  const classes = useStyles(props);
  const [image, updateImage] = useImage(props.id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [attachInstances, setAttachInstances] = useState(false);
  const [attachActors, setAttachActors] = useState(false);
  const [removeInstances, setRemoveInstances] = useState(false);
  const [
    instanceIds,
    attatchInstance,
    detatchInstance
  ] = useInstanceIdsForImage(props.id);
  const [actorIds, attatchActor, detatchActor] = useActorIdsForImage(props.id);

  const [expanded, setExpanded] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const elmRef = useDiscover(props.discover, props.id, setExpanded);

  useEffect(() => {
    if (!image) return;
    props.setSortImage(image);
  }, [image]);
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
  function deleteImage(e) {
    console.log(props.id);
    props.deleteImage(props.id);
  }
  function removeInstance(instanceId: number) {
    detatchInstance(instanceId);
  }
  function removeActor(actorId: number) {
    detatchActor(actorId);
  }

  async function onAttachInstances(ids: number[]) {
    for (let x = 0; x < instanceIds.length; x++) {
      let id = instanceIds[x];
      if (ids.indexOf(id) === -1) await detatchInstance(id);
    }
    for (let x = 0; x < ids.length; x++) {
      let id = ids[x];
      await attatchInstance(id);
    }
    setAttachInstances(false);
  }
  async function onAttachActors(ids: number[]) {
    for (let x = 0; x < actorIds.length; x++) {
      let id = actorIds[x];
      if (ids.indexOf(id) === -1) await detatchActor(id);
    }
    for (let x = 0; x < ids.length; x++) {
      let id = ids[x];
      await attatchActor(id);
    }
    setAttachActors(false);
  }

  if (!image) return null;

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
                    {image.name[0]}
                  </Avatar>
                )}
              </>
            }
            action={
              <>
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
              <Button className={classes.avatarName} onClick={openActionPanel}>
                {image.name}
              </Button>
            }
            subheader={(image.keywords || []).sort().join(", ")}
          />
          <CardMedia
            image="http://lorempixel.com/100/100/fashion"
            title={image.name}
          />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {/* <ImageContent /> */}
          </Collapse>
        </Card>
        <Drawer
          open={openAction}
          anchor="right"
          onClose={() => setOpenAction(false)}
        >
          <Actions
            updateImage={updateImage}
            setOpenAction={setOpenAction}
            {...image}
          />
        </Drawer>
        <Drawer
          anchor="top"
          open={attachInstances}
          onClose={e => setAttachInstances(false)}
        >
          {/* <AttachInstance onDone={onAttachInstances}
            selected={instanceIds} /> */}
        </Drawer>
      </>
    );
  };

  return renderView();
}

export default Image;
