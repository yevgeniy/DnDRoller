import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import FaceIcon from "@material-ui/icons/Face";
import Replay from "@material-ui/icons/Replay";
import SaveAlt from "@material-ui/icons/SaveAlt";

import {
  Select,
  Divider,
  MenuItem,
  InputLabel,
  FilledInput,
  Card,
  TextField,
  Fab,
  FormControl
} from "@material-ui/core";
import { CardHeader, Input } from "../components";

import { ActorSize } from "../enums";
import ClassListInput from "../components/ClassListInput";
import { ModelActor } from "../models/ModelActor";
import { useActor, useResetable } from "../util/hooks";

const useStyle = makeStyles(theme => {
  return createStyles({
    reset: {
      margin: theme.spacing(1, 0, 1, 1)
    },
    container: {
      padding: theme.spacing(1),
      width: 200
    },
    nameCard: {
      marginBottom: theme.spacing(1)
    },
    mainEntry: {
      width: "60%",
      marginTop: 0,
      marginRight: theme.spacing(1)
    },
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: theme.spacing(0, 0, 1, 0),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    entry2: {
      marginTop: theme.spacing(1),
      width: "60%"
    }
  });
});

type PageActorsActionsProps = {
  /*update any prop of actor*/
  id: number;
  onDone?: (a?: { [P in keyof ModelActor]?: ModelActor[P] }) => void;
};

const PageActorsActions = React.memo((props: PageActorsActionsProps) => {
  const classes = useStyle({});
  const [actor, updateActor, resetActor, resetToken] = useResetable(
    useActor,
    props.id
  ) || [null, null, null, null];

  if (!actor) return null;

  const { name, hp, class: cl, race, size, hpCurrent } = actor;

  const onResetHpCurrent = e => {
    updateActor({ hpCurrent: hp });
    props.onDone();
  };

  const c: string[] = [];
  for (let i in cl) c.push(`${i} lvl ${cl[i]}`);

  return (
    <div className={classes.container}>
      <Card className={classes.nameCard}>
        <CardHeader
          avatar={<FaceIcon />}
          title={name}
          subheader={c.join(", ")}
        />
      </Card>

      <form>
        <Input
          className={classes.mainEntry}
          label="Name"
          defaultValue={name}
          onChange={v => updateActor({ name: v })}
          resetToken={resetToken}
        />
        <Input
          className={classes.mainEntry}
          label="Hp"
          defaultValue={hp || ""}
          type="number"
          onChange={v => updateActor({ hp: +v })}
          resetToken={resetToken}
        />
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="filled-size-simple">Size</InputLabel>
          <Select
            defaultValue={size}
            onChange={e => updateActor({ size: e.target.value as ActorSize })}
            input={<FilledInput name="size" id="filled-size-simple" />}
          >
            <MenuItem value={null}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={"diminutive"}>diminutive</MenuItem>
            <MenuItem value={"tiny"}>tiny</MenuItem>
            <MenuItem value={"small"}>small</MenuItem>
            <MenuItem value={"medium"}>medium</MenuItem>
            <MenuItem value={"large"}>large</MenuItem>
            <MenuItem value={"huge"}>huge</MenuItem>
          </Select>
        </FormControl>
        <Input
          className={classes.mainEntry}
          label="Race"
          defaultValue={race || ""}
          onChange={v => updateActor({ race: v })}
          resetToken={resetToken}
        />
        <ClassListInput
          classes={cl}
          onUpdate={v => updateActor({ class: v })}
        />
      </form>

      <Fab
        className={classes.reset}
        color="secondary"
        variant="extended"
        size="small"
        onClick={resetActor}
      >
        <Replay />
        Reset
      </Fab>
      <Divider />
      <form onSubmit={e => e.preventDefault()}>
        <Input
          className={classes.entry2}
          label="Current Hp"
          defaultValue={hpCurrent || ""}
          type="number"
          onChange={v => updateActor({ hpCurrent: +v })}
        />
        <Fab
          className={classes.reset}
          color="secondary"
          size="small"
          onClick={onResetHpCurrent}
        >
          <Replay />
        </Fab>
      </form>
    </div>
  );
});

export default PageActorsActions;
