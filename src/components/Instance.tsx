import * as React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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

import Collapse from "@material-ui/core/Collapse";

import Drawer from "@material-ui/core/Drawer";

import PageInstanceActions from "./PageInstanceActions";
import { ModelInstance } from "../models/ModelInstance";
import { useService, useActor } from "../util/hooks";
import ServiceInstance from "../services/ServiceInstance";

import {List,ListItem,ListItemText,ListSubheader,ListItemAvatar
  , ListItemSecondaryAction
  , Paper}
 from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  card: {},
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1 / 2)
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
    backgroundColor: blue[500],
  },
  removeActor: {
    '& svg': {
      color:red[600],
    }
  },
  instanceControls: {
    padding:theme.spacing(1),
  },
  cardContent: {
    marginTop: theme.spacing(1),
    display:'flex',
    '& > *': {
      flex:1,
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
    background:green[600],
    marginLeft:theme.spacing(1),
    marginTop:theme.spacing(1),
    '& svg': {
      marginRight:theme.spacing(1)
    }
  },
  deleteInstanceButton: {
    background:orange[600],
    marginTop:theme.spacing(1),
    marginLeft:theme.spacing(1),
    '& svg': {
      marginRight:theme.spacing(1)
    }
  }
}));

type InstanceProps = { [P in keyof ModelInstance]?: ModelInstance[P] } & {
  classes?: { card: string };
  setSortInstance?: (a: ModelInstance) => void;
};

function Instance(props: InstanceProps) {
  const classes = useStyles(props);
  const [instance, updateInstance] = useInstance(props.id);
  useEffect(() => {
    if (!instance) return;
    props.setSortInstance(instance);
  }, [instance]);

  const [expanded, setExpanded] = useState(false);
  const [openAction, setOpenAction] = useState(false);

  function handleExpandClick(e) {
    e.stopPropagation();
    setExpanded(!expanded);
  }
  function openActionPanel(e) {
    e.stopPropagation();
    setOpenAction(true);
  }

  if (!instance) return null;

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          onClick={openActionPanel}
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {instance.name[0]}
            </Avatar>
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
                <Paper>
                  <List
                  subheader={<ListSubheader component="div">Actors</ListSubheader>}
                  >
                  {
                    instance.actors.map(v=><ActorEntry kye={v} id={v} />)
                    }
                  </List>
                </Paper>
              </div>
              <div>
                <div>
                  <Button variant="contained" color="secondary"
                    button className={classes.deleteInstanceButton}>
                    <Delete/>
                    Delete Instance
                  </Button>
                </div>
                <div>
                  <Button variant="contained" color="secondary"
                    button className={classes.addActorButton}>
                    <DirectionsRun/>
                    Add Actor
                  </Button>
                </div>
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
    </>
  );
};

interface ActorEntryProps{
  id:number,
};
const ActorEntry=(props:ActorEntryProps)=> {
  const classes=useStyles();
  const [actor] = useActor(props.id);

  if (!actor)return null;

  let c=[];
  for (let i in actor.class) {
    c.push(`${i} lvl: ${actor.class[i]}`)
  }

  return (
    <ListItem >
      <ListItemAvatar>
        <Avatar className={clsx(classes.avatar,classes.actorAvatar)}>
          {actor.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={actor.name}
        secondary={
          <>
            {c.join(', ')}
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton className={classes.removeActor} edge="end" aria-label="Comments">
          <RemoveCircle />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function useInstance(id: number) {
  const serviceInstance = useService(ServiceInstance);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (!serviceInstance) return;
    serviceInstance.get(id).then(setInstance);
  }, [serviceInstance]);

  function updateInstance(updateInstance) {
    setInstance({ ...instance, ...updateInstance });
  }

  return [instance, updateInstance];
}

export default Instance;
