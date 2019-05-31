import * as React from "react";
import { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import Replay from "@material-ui/icons/Replay";
import SaveAlt from "@material-ui/icons/SaveAlt";
import { Card, CardHeader, TextField, Fab } from "@material-ui/core";
import { ModelActor } from "../models/ModelActor";

import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { ActorSize } from "../enums";
import AutoFill from "./AutoFill";
import ClassListInput from "./ClassListInput";

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
    }
  });
});

type PageActorsActionsProps = { [P in keyof ModelActor]: ModelActor[P] } & {
  /*update any prop of actor*/
  updateActor: (a: { [P in keyof ModelActor]?: ModelActor[P] }) => void;
  setOpenAction: (a: boolean) => void;
};

function PageActorsActions(props: PageActorsActionsProps) {
  const classes = useStyle();
  const [name, setName] = useState(props.name);
  const [hp, setHp] = useState(props.hp);
  const [cls, setCls] = useState(props.class);
  const [race, setRace] = useState(props.race);
  const [size, setSize] = useState(props.size);

  const onUpdateActor = (e: any) => {
    e.preventDefault();

    props.updateActor({ name, hp, class: cls, race, size });
    props.setOpenAction(false);
  };
  const onReset = e => {
    setName(props.name);
    setHp(props.hp);
    setCls(props.class);
    setRace(props.race);
    setSize(props.size);
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
          action={
            <Chip
              label={`${props.hpCurrent}/${props.hp}`}
              color="secondary"
              variant="outlined"
            />
          }
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
          value={hp}
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
          value={race}
          onChange={e => setRace(e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
          margin="dense"
          variant="filled"
        />
        <ClassListInput classes={cls} />
        <div>
          <Fab
            className={classes.reset}
            variant="extended"
            color="primary"
            size="small"
            onClick={onReset}
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
    </div>
  );
}

export default PageActorsActions;
