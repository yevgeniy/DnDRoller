import * as React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useActor } from "../util/hooks";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
} from "@material-ui/core";
import { Link } from "react-router-dom";
import clsx from "clsx";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";

const useStyles = makeStyles(theme => {
  return createStyles({
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
    detatchActor: {
      "& svg": {
        color: red[600]
      }
    }
  });
});

interface onActorEntryProps {
  id: number;
  detatchActor: (a: number) => void;
}
const OnActorEntry = React.memo((props: onActorEntryProps) => {
  const classes = useStyles({});
  const [actor] = useActor(props.id);

  if (!actor) return null;

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
      <ListItemText primary={actor.name} />
    </ListItem>
  );
});

export default OnActorEntry;
