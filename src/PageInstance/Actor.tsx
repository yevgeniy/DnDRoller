import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";

import red from "@material-ui/core/colors/red";
import purple from "@material-ui/core/colors/purple";
import orange from "@material-ui/core/colors/orange";

import FlashOn from "@material-ui/icons/FlashOn";

import FaceIcon from "@material-ui/icons/Face";

import ActorContent from "./ActorContent";

import Actions from "./Actions";
import { ModelActor } from "../models/ModelActor";
import { useHistoryState, useService, useImage, useHot } from "../util/hooks";
import ServiceActor from "../services/ServiceActor";

import {
  Chip,
  EntityActions,
  EntityContent,
  EntityHeaderActions,
  Entity,
  EntityTitle
} from "../components";

const useActorStyles = makeStyles(theme =>
  createStyles({
    card: {},
    deleteButton: {
      background: "white",
      "& svg": {
        transition: "all ease 200ms",
        transform: "scale(2)",
        color: purple[600]
      }
    },
    deleteButtonActive: {
      "& svg": {
        transform: "scale(1)"
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
    imageContainer: {
      display: "flex",
      flexWrap: "nowrap",
      width: "90vw",
      overflow: "auto"
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
    content: {
      marginTop: theme.spacing(1)
    },
    chip: {
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
    actorControls: {
      display: "flex",
      justifyContent: "space-between"
    },
    imagesContainer: {
      marginTop: theme.spacing(1)
    },
    removeButton: {
      background: orange[600],
      marginLeft: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    }
  })
);

type IActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
  classes?: any;
  setSortActor?: (a: ModelActor) => void;
  resetActor?: number;
  removeActor?: (id: number) => void;
  cloneActor?: (actor: ModelActor) => any;
};

const Actor = React.memo((props: IActorProps) => {
  const classes = useActorStyles({});
  const [actor, updateActor] = useActor(props.id, props.resetActor);

  useEffect(() => {
    if (!actor) return;
    props.setSortActor(actor);
  }, [actor]);

  if (!actor) return null;

  function removeActor(e = null) {
    props.removeActor(props.id);
  }

  const doClone = () => {
    props.cloneActor(actor);
  };

  if (!actor) return null;

  const c = [];
  for (let i in actor.class) c.push(`${i}: ${actor.class[i]}`);

  return (
    <Entity
      id={props.id}
      cloneEntity={doClone}
      deleteEntity={removeActor}
      subheader={c.join(", ")}
      updateEntity={updateActor}
    >
      <Avatar aria-label="Recipe" className={classes.avatar}>
        {actor.name[0]}
      </Avatar>
      <EntityTitle>{actor.name}</EntityTitle>
      <EntityHeaderActions>
        {actor.initiative ? (
          <Chip
            icon={<FlashOn />}
            label={actor.initiative}
            className={classes.chip}
            color="primary"
            variant="outlined"
          />
        ) : null}

        <Chip
          icon={<FaceIcon />}
          label={`${actor.hpCurrent}/${actor.hp}`}
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
});

const useImageEntryPropsStyles = makeStyles(theme => {
  return createStyles({
    entry: {
      padding: theme.spacing(1 / 2),
      position: "relative",
      "& img": {
        height: "200px"
      }
    }
  });
});

function useActor(id: number, resetActorToken?: number) {
  const serviceActor = useService(ServiceActor);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    if (!serviceActor) return;
    serviceActor.get(id).then(setActor);
  }, [serviceActor]);

  useEffect(() => {
    if (!resetActorToken) return;
    if (!actor) return;

    updateActor({ hpCurrent: actor.hp, initiative: null });
  }, [resetActorToken]);

  async function updateActor(updateActor) {
    const na = { ...actor, ...updateActor };
    serviceActor.save(na);
    setActor(na);
  }

  return [actor, updateActor];
}

export default Actor;
