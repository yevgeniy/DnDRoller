import * as React from "react";

interface onActorEntryProps {
  id: number;
  removeActor: (a: number) => void;
  deleteActors: boolean;
}
const OnActorEntry = (props: onActorEntryProps) => {
  const classes = useStyles();
  const [actor] = useActor(props.id);

  if (!actor) return null;

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
          {actor.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={actor.name} />
      {props.deleteActors ? (
        <ListItemSecondaryAction>
          <IconButton
            onClick={e => props.removeActor(props.id)}
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

export default OnActorEntry;
