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
import Button from "@material-ui/core/Button";

import FaceIcon from "@material-ui/icons/Face";

import Collapse from "@material-ui/core/Collapse";

import Drawer from "@material-ui/core/Drawer";

import Checkbox from "@material-ui/core/Checkbox";

import { ModelActor } from "../models/ModelActor";
import { useActor } from "../util/hooks";
import ServiceActor from "../services/ServiceActor";

import PageActorActions from "./PageActorsActions";
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
  }
}));

type ActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
  classes?: { card: string };
  setSortActor?: (a: ModelActor) => void;
  setSelected?: (f: boolean) => void;
  selected?: boolean;
};

function Actor(props: ActorProps) {
  const classes = useStyles(props);
  const [actor, updateActor] = useActor(props.id);
  const [selected, setSelected] = useState(props.selected);
  useEffect(() => {
    props.setSelected(selected);
  }, [selected]);
  useEffect(() => {
    if (!actor) return;
    props.setSortActor(actor);
  }, [actor]);

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

  if (!actor) return null;
  const c = [];
  for (let i in actor.class) c.push(`${i} lvl ${actor.class[i]}`);

  const renderView = () => {
    return (
      <>
        <Card className={classes.card}>
          <CardHeader
            onClick={e =>
              props.setSelected ? setSelected(!selected) : openActionPanel(e)
            }
            avatar={
              <>
                {props.setSelected ? (
                  <Checkbox
                    checked={selected}
                    inputProps={{
                      "aria-label": "primary checkbox"
                    }}
                  />
                ) : (
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                    {actor.name[0]}
                  </Avatar>
                )}
              </>
            }
            subheader={c.join(", ")}
            action={
              <>
                <Chip
                  icon={<FaceIcon />}
                  label={actor.hp ? `${actor.hpCurrent}/${actor.hp}` : "--"}
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
            title={
              <a type="link" href="#" onClick={openActionPanel}>
                {actor.name}
              </a>
            }
          />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Divider />
              <div className={classes.content}>
                <Typography paragraph>Method:</Typography>
                <Typography paragraph>
                  Heat 1/2 cup of the broth in a pot until simmering, add
                  saffron and set aside for 10 minutes.
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
            <PageActorActions
              updateActor={updateActor}
              setOpenAction={setOpenAction}
              {...actor}
            />
          </div>
        </Drawer>
      </>
    );
  };

  return renderView();
}

export default Actor;
