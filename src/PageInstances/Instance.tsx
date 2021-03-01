import * as React from "react";
import { useState, useEffect, useContext, useRef, useReducer } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";

import AccessTime from "@material-ui/icons/AccessTime";

import { Button, Avatar } from "@material-ui/core";
import { Chip } from "../components";

import moment from "moment";
import Actions from "./Actions";

import { useInstance, useCommonHook } from "../util/hooks";

import { ModelInstance } from "../models/ModelInstance";
import InstanceContent from "./InstanceContent";

import {
  EntityActions,
  EntityContent,
  EntityHeaderActions,
  Entity,
  EntityTitle
} from "../components";

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
      color: orange[600],
      borderColor: orange[600],
      margin: theme.spacing(1),
      minWidth: 70,
      justifyContent: "flex-start",
      [theme.breakpoints.down("xs")]: {
        minWidth: "auto",
        margin: theme.spacing(1 / 2)
      }
    }
  })
);

type InstanceProps = { [P in keyof ModelInstance]?: ModelInstance[P] } & {
  classes?: { card: string };
  setSortInstance?: (a: ModelInstance) => void;
  deleteInstance?: (i: number) => void;
  setSelected?: (f: boolean) => void;
  selected?: boolean;
  cloneInstance?: (instance: ModelInstance) => any;
  discover?: number;
};

const Instance = React.memo((props: InstanceProps) => {
  const classes = useStyles({});
  const [instance, updateInstance] = useCommonHook(useInstance, props.id) || [
    null,
    null
  ];

  useEffect(() => {
    if (!instance) return;
    props.setSortInstance(instance);
  }, [instance]);

  if (!instance) return null;

  const deleteInstance = (e = null) => {
    if (!instance) return;
    props.deleteInstance(props.id);
  };

  const doClone = () => {
    props.cloneInstance({ ...instance });
  };

  if (!instance) return null;

  return (
    <Entity
      id={props.id}
      cloneEntity={doClone}
      deleteEntity={deleteInstance}
      discover={props.discover}
      isSelected={props.selected}
      setSelected={props.setSelected}
      updateEntity={updateInstance}
    >
      <Avatar aria-label="Recipe" className={classes.avatar}>
        {instance.name[0]}
      </Avatar>
      <EntityTitle>
        <Button>{instance.name}</Button>
      </EntityTitle>
      <EntityHeaderActions>
        <Chip
          icon={<AccessTime />}
          label={moment()
            .subtract(+new Date() - instance.created, "ms")
            .calendar()}
          className={classes.chip}
          color="secondary"
          variant="outlined"
        />
      </EntityHeaderActions>
      <EntityContent>
        <InstanceContent id={instance.id} />
      </EntityContent>
      <EntityActions>
        <Actions {...instance} />
      </EntityActions>
    </Entity>
  );
});

export default Instance;
