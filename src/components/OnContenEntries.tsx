import React from "react";
import clsx from "clsx";
import {
  Avatar,
  ListItemText,
  ListItem,
  ListItemAvatar,
  makeStyles,
  createStyles
} from "@material-ui/core";
import { Link } from "react-router-dom";
import blue from "@material-ui/core/colors/blue";
import purple from "@material-ui/core/colors/purple";

import { useImage, useActor, useInstance } from "../util/hooks";

const useEntryStyles = makeStyles(theme =>
  createStyles({
    avatar: {
      backgroundColor: blue[500],
      [theme.breakpoints.down("xs")]: {
        width: 30,
        height: 30
      }
    },
    imageAvatar: {
      backgroundColor: purple[500]
    },
    instanceAvatar: {
      backgroundColor: blue[500]
    }
  })
);

interface IImageEntry {
  id: number;
}
export const ImageEntry = React.memo((props: IImageEntry) => {
  const classes = useEntryStyles({});
  const [image, , , url] = useImage(props.id);

  if (!image) return null;

  return (
    <ListItem
      button
      component={Link}
      to={{ pathname: "/image", state: { imageId: image.id } }}
    >
      <ListItemAvatar>
        <Avatar className={clsx(classes.avatar, classes.imageAvatar)}>
          {image.type === "image" && url ? (
            <img src={url} style={{ maxWidth: "30px", maxHeight: "30px" }} />
          ) : (
            image.name[0]
          )}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={image.name} />
    </ListItem>
  );
});

interface IActorEntry {
  id: number;
}
export const ActorEntry = React.memo((props: IActorEntry) => {
  const classes = useEntryStyles({});
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
        <Avatar className={clsx(classes.avatar)}>{actor.name[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={actor.name} secondary={<>{c.join(", ")}</>} />
    </ListItem>
  );
});

interface InstanceEntryProps {
  id?: number;
}
export const InstanceEntry = React.memo((props: InstanceEntryProps) => {
  const classes = useEntryStyles({});
  const [instance] = useInstance(props.id);

  if (!instance) return null;

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
        <Avatar className={(classes.avatar, classes.instanceAvatar)}>
          {instance.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={instance.name} />
    </ListItem>
  );
});
