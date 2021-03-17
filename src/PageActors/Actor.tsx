import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import Avatar from "@material-ui/core/Avatar";

import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import grey from "@material-ui/core/colors/grey";

import FaceIcon from "@material-ui/icons/Face";

import ActorContent from "./ActorContent";

import {
  Chip,
  EntityActions,
  EntityContent,
  EntityHeaderActions,
  Entity,
  EntityTitle
} from "../components";
import { Button } from "@material-ui/core";

import { ModelActor } from "../models/ModelActor";
import {
  useActor,
  useHot,
  useDiscover,
  useModalState,
  useCommonHook
} from "../util/hooks";

import Actions from "./Actions";

const useStyles = makeStyles(theme =>
  createStyles({
    avatar: {
      backgroundColor: red[500],
      [theme.breakpoints.down("xs")]: {
        width: 30,
        height: 30
      }
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
    isTemplate: {
      backgroundColor: grey[700]
    }
  })
);

type ActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
  classes?: any;
  setSelected?: (f: boolean) => void;
  deleteActor?: (i: number) => any;
  cloneActor?: (a: ModelActor) => any;
  selected?: boolean;
  discover?: number;
};

const Actor = React.memo((props: ActorProps) => {
  const classes = useStyles({});
  const [actor, updateActor] = useCommonHook(useActor, props.id) || [
    null,
    null
  ];

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
        subheader={c.join(", ")}
        updateEntity={updateActor}
      >
        <Avatar
          className={clsx(classes.avatar, {
            [classes.isTemplate]: actor.isTemplate
          })}
        >
          {actor.name[0]}
        </Avatar>
        <EntityTitle>
          <Button>{actor.name}</Button>
        </EntityTitle>

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
          <ActorContent {...actor} updateActor={updateActor} />
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
