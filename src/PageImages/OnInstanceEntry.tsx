import * as React from "react";

interface OnInstanceEntryProps {
  id: number;
  removeInstance: (a: number) => void;
  deleteInstances: boolean;
}
const OnInstanceEntry = (props: OnInstanceEntryProps) => {
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

export default OnInstanceEntry;
