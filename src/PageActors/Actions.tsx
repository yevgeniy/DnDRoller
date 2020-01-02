import * as React from "react";
import { useState } from "react";
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
import { CardHeader } from "../components";

import { ActorSize } from "../enums";
import ClassListInput from "../components/ClassListInput";
import { ModelActor } from "../models/ModelActor";

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

type PageActorsActionsProps = { [P in keyof ModelActor]: ModelActor[P] } & {
  /*update any prop of actor*/
  onDone?: (a: { [P in keyof ModelActor]?: ModelActor[P] }) => void;
};

const PageActorsActions = React.memo((props: PageActorsActionsProps) => {
  const classes = useStyle({});
  const [name, setName] = useState(props.name);
  const [hp, setHp] = useState(props.hp);
  const [cls, setCls] = useState(props.class);
  const [race, setRace] = useState(props.race);
  const [size, setSize] = useState(props.size);
  const [hpCurrent, setHpCurrent] = useState(props.hpCurrent);

  const onUpdateActor = (e: any) => {
    e.preventDefault();
    props.onDone({
      name,
      hp,
      hpCurrent: hpCurrent === null ? hp : hpCurrent,
      class: cls,
      race,
      size
    });
  };
  const onReset = e => {
    setName(props.name);
    setHp(props.hp);
    setCls(props.class);
    setRace(props.race);
    setSize(props.size);
  };
  const onResetHpCurrent = e => {
    props.onDone({ hpCurrent: hp });
  };
  const onSetHpCurrent = e => {
    e.preventDefault();
    props.onDone({ hpCurrent: hpCurrent });
  };

  const c: string[] = [];
  for (let i in props.class) c.push(`${i} lvl ${props.class[i]}`);

  return (
    <div className={classes.container}>
      <Card className={classes.nameCard}>
        <CardHeader
          avatar={<FaceIcon />}
          title={props.name}
          subheader={c.join(", ")}
        />
      </Card>

      <form onSubmit={onUpdateActor}>
        <TextField
          className={classes.mainEntry}
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
          margin="dense"
          variant="filled"
        />
        <TextField
          className={classes.mainEntry}
          label="Hp"
          value={hp || ""}
          type="number"
          onChange={e => setHp(+e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
          margin="dense"
          variant="filled"
        />
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="filled-size-simple">Size</InputLabel>
          <Select
            value={size}
            onChange={e => setSize(e.target.value as ActorSize)}
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
        <TextField
          className={classes.mainEntry}
          label="Race"
          value={race || ""}
          onChange={e => setRace(e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
          margin="dense"
          variant="filled"
        />
        <ClassListInput classes={cls} onUpdate={setCls} />
        <div>
          <Fab
            className={classes.reset}
            variant="extended"
            color="primary"
            size="small"
            type="submit"
          >
            <SaveAlt />
            Save
          </Fab>
          <Fab
            className={classes.reset}
            variant="extended"
            color="secondary"
            size="small"
            onClick={onReset}
          >
            <Replay />
            Reset
          </Fab>
        </div>
      </form>
      <Divider />
      <form onSubmit={onSetHpCurrent}>
        <TextField
          className={classes.entry2}
          label="Current Hp"
          value={hpCurrent || ""}
          type="number"
          onChange={e => setHpCurrent(+e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
          margin="dense"
          variant="filled"
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
