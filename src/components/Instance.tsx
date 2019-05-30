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
import orange from "@material-ui/core/colors/orange";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccessTime from "@material-ui/icons/AccessTime";
import FlashOn from "@material-ui/icons/FlashOn";
import Divider from "@material-ui/core/Divider";
import moment from "moment";

import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";

import Collapse from "@material-ui/core/Collapse";

import Drawer from "@material-ui/core/Drawer";

import PageInstanceActions from "./PageInstanceActions";
import { ModelInstance } from "../models/ModelInstance";
import { useService } from "../util/hooks";
import ServiceInstance from "../services/ServiceInstance";

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
  content: {
    marginTop: theme.spacing(1)
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
  }
}));

type InstanceProps = { [P in keyof ModelInstance]?: ModelInstance[P] } & {
  classes?: { card: string };
  setSortInstance?: (a: ModelInstance) => void;
};

function PageInstanceActor(props: InstanceProps) {
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
            <div className={classes.content}>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron
                and set aside for 10 minutes.
              </Typography>
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
          {/* <PageInstanceActions {...{ updateActor, setOpenAction, ...actor }} /> */}
          hi
        </div>
      </Drawer>
    </>
  );
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

export default PageInstanceActor;
