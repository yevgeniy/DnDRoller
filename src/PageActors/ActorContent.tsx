import * as React from "react";
import clsx from "clsx";
import { useState } from "react";
import {
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  ListItemAvatar,
  makeStyles,
  createStyles,
  IconButton,
  Button,
  Paper,
  List,
  Drawer,
  ListSubheader
} from "@material-ui/core";
import { Link } from "react-router-dom";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";

import Extension from "@material-ui/icons/Extension";
import RemoveCircle from "@material-ui/icons/RemoveCircle";

import PageImagesAdd from "../PageImages/PageImagesAdd";
import PageInstancesAdd from "../PageInstances/PageInstancesAdd";

import { useInstance, useImage, useInstanceIdsForActor } from "../util/hooks";
import { ModelActor } from "../models/ModelActor";

const useStyles = makeStyles(theme => {
  return createStyles({
    imageContainer: {
      display: "flex",
      flexWrap: "nowrap",
      width: "90vw",
      overflow: "auto"
    },
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
    instancesControls: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: theme.spacing(1)
    },
    addInstanceButton: {
      background: green[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    removeInstance: {
      "& svg": {
        color: red[600]
      }
    },
    removeFromInstanceStart: {
      background: red[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    }
  });
});

type ActorContentProps = { [T in keyof ModelActor]: ModelActor[T] } & {
  updateActor: (actor: ModelActor) => any;
};

const ActorContent = React.memo(
  ({ updateActor, ...actor }: ActorContentProps) => {
    const classes = useStyles();

    const [attachInstances, setAttachInstances] = useState(false);
    const [attachImages, setAttachImages] = useState(false);
    const [deleteInstances, setDeleteInstances] = useState(false);
    const [deleteImages, setDeleteImages] = useState(false);
    const [
      instanceIds,
      attatchInstance,
      detatchInstance
    ] = useInstanceIdsForActor(actor.id);

    const removeInstance = (instanceId: number) => {
      detatchInstance(instanceId);
    };
    const removeImage = (imageId: number) => {
      actor.images = (actor.images || []).filter(v => v !== imageId);
      if (!actor.images.length) delete actor.images;
      updateActor({ ...actor });
    };
    const onAttachInstances = async (ids: number[]) => {
      for (let x = 0; x < instanceIds.length; x++) {
        let id = instanceIds[x];
        if (ids.indexOf(id) === -1) await detatchInstance(id);
      }
      for (let x = 0; x < ids.length; x++) {
        let id = ids[x];
        await attatchInstance(id);
      }
      setAttachInstances(false);
    };
    const onAttachImages = async (ids: number[]) => {
      actor.images = ids;
      if (!actor.images.length) delete actor.images;
      updateActor({ ...actor });
      setAttachImages(false);
    };

    return (
      <div className={classes.cardContent}>
        <div>
          <div className={classes.instancesControls}>
            <Button
              variant="contained"
              color="secondary"
              button="true"
              onClick={e => setAttachInstances(true)}
              className={classes.addInstanceButton}
            >
              <Extension />
              Update Instances
            </Button>
            <Button
              variant="contained"
              color="secondary"
              button="secondary"
              onClick={e => setDeleteInstances(!deleteInstances)}
              className={classes.removeFromInstanceStart}
            >
              <Extension />
              {deleteInstances ? "...cancel" : "Remove from Instances"}
            </Button>
          </div>
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
        <div>
          <div className={classes.instancesControls}>
            <Button
              variant="contained"
              color="secondary"
              button="true"
              onClick={e => setAttachImages(true)}
              className={classes.addInstanceButton}
            >
              <Extension />
              Update Images
            </Button>
            <Button
              variant="contained"
              color="secondary"
              button="secondary"
              onClick={e => setDeleteImages(!deleteImages)}
              className={classes.removeFromInstanceStart}
            >
              <Extension />
              {deleteImages ? "...cancel" : "Remove Images"}
            </Button>
          </div>
          <Paper>
            <List
              subheader={<ListSubheader component="div">Images</ListSubheader>}
            >
              <div className={classes.imageContainer}>
                {(actor.images || []).map(v => (
                  <ImageEntry
                    key={v}
                    id={v}
                    removeImage={removeImage}
                    deleteImages={deleteImages}
                  />
                ))}
              </div>
            </List>
          </Paper>
        </div>
        <Drawer
          anchor="top"
          open={attachInstances}
          onClose={e => setAttachInstances(false)}
        >
          <PageInstancesAdd onDone={onAttachInstances} selected={instanceIds} />
        </Drawer>
        <Drawer
          anchor="top"
          open={attachImages}
          onClose={e => setAttachImages(false)}
        >
          <PageImagesAdd
            onDone={onAttachImages}
            selected={actor.images || []}
          />
        </Drawer>
      </div>
    );
  }
);

interface ActorEntryProps {
  id: number;
  removeInstance: (a: number) => void;
  deleteInstances: boolean;
}
const InstanceEntry = React.memo((props: ActorEntryProps) => {
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
});

const useImageEntryPropsStyles = makeStyles(theme => {
  return createStyles({
    entry: {
      padding: theme.spacing(1 / 2),
      position: "relative",
      "& img": {
        height: "200px"
      }
    },
    removeButton: {
      position: "absolute",
      top: 10,
      right: 22,
      background: red[600],
      color: "white"
    }
  });
});
interface ImageEntryProps {
  id: number;
  removeImage: (a: number) => void;
  deleteImages: boolean;
}
const ImageEntry = React.memo((props: ImageEntryProps) => {
  const classes = useImageEntryPropsStyles();
  const [image, , , url] = useImage(props.id);
  if (!image) return null;
  if (!url) return null;
  return (
    <div className={classes.entry}>
      {props.deleteImages ? (
        <IconButton
          onClick={e => props.removeImage(props.id)}
          className={classes.removeButton}
          edge="end"
          aria-label="Comments"
        >
          <RemoveCircle />
        </IconButton>
      ) : null}

      <img src={url} alt="" />
    </div>
  );
});

export default ActorContent;
