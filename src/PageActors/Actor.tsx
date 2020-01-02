import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import purple from "@material-ui/core/colors/purple";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Delete from "@material-ui/icons/Delete";
import FaceIcon from "@material-ui/icons/Face";
import Clone from "@material-ui/icons/CallSplit";

import {
  CardHeader,
  ContextMenu,
  Chip,
  EntityActions,
  EntityContent,
  EntityHeaderActions,
  Entity
} from "../components";
import ActorContent from "./ActorContent";
import {
  Card,
  Fab,
  Divider,
  CardContent,
  Button,
  Collapse,
  Drawer,
  Checkbox
} from "@material-ui/core";

import { ModelActor } from "../models/ModelActor";
import { useActor, useHot, useDiscover, useModalState } from "../util/hooks";

import Actions from "./Actions";
import { useOpenStream, useMessageStream } from "../util/sync";

const useStyles = makeStyles(theme =>
  createStyles({
    card: {},
    deleteButton: {
      background: "white",
      "& svg": {
        transition: "all ease 200ms",
        transform: "scale(2)",
        color: purple[600],
        [theme.breakpoints.up("sm")]: {
          transform: "scale(1.5)"
        }
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
    deleteButtonActive: {
      "& svg": {
        transform: "scale(1)"
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
      backgroundColor: red[500],
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
  })
);

type ActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
  classes?: { card: string };
  setSortActor?: (a: ModelActor) => void;
  setSelected?: (f: boolean) => void;
  deleteActor?: (i: number) => any;
  cloneActor?: (a: ModelActor) => any;
  selected?: boolean;
  discover?: number;
};

const Actor = React.memo((props: ActorProps) => {
  const classes = useStyles(props);
  const [actor, updateActor] = useActor(props.id);

  useEffect(() => {
    if (!actor) return;
    props.setSortActor(actor);
  }, [actor]);

  if (!actor) return null;

  function deleteActor() {
    props.deleteActor(props.id);
  }

  const doClone = () => {
    props.cloneActor({ ...actor });
  };

  const c = [];
  for (let i in actor.class) c.push(`${i} lvl ${actor.class[i]}`);

  const renderView = () => {
    return (
      <Entity
        id={props.id}
        cloneEntity={doClone}
        deleteEntity={deleteActor}
        discover={props.discover}
        isSelected={props.selected}
        setSelected={props.setSelected}
        title={<Button className={classes.avatarName}>{actor.name}</Button>}
        subheader={c.join(", ")}
        updateEntity={updateActor}
      >
        <Avatar aria-label="Recipe" className={classes.avatar}>
          {actor.name[0]}
        </Avatar>
        <EntityHeaderActions>
          <Chip
            icon={<FaceIcon />}
            label={actor.hp ? `${actor.hpCurrent}/${actor.hp}` : "--"}
            className={classes.chip}
            color="secondary"
            variant="outlined"
          />
        </EntityHeaderActions>
        <EntityContent>
          <ActorContent {...actor} />
        </EntityContent>
        <EntityActions>
          <Actions {...actor} />
        </EntityActions>
      </Entity>
    );
  };

  return renderView();
});

export default Actor;
