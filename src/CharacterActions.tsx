import * as React from "react";
import { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import Replay from "@material-ui/icons/Replay";
import { Card, CardHeader, TextField, Fab } from "@material-ui/core";
import { ModelActor } from "./models/ModelActor";

const useStyle = makeStyles(theme => {
  return {
    container: {
      padding: theme.spacing(1),
      minWidth: 200
    },
    nameCard: {
      marginBottom: theme.spacing(1)
    },
    mainEntry: {
      width: "60%",
      marginTop: 0,
      marginRight: theme.spacing(1)
    }
  };
});

type CharacterActionsProps = { [P in keyof ModelActor]: ModelActor[P] } & {
  /*update any prop of actor*/
  updateActor: (a: { [P in keyof ModelActor]?: ModelActor[P] }) => void;
  setOpenAction: (a: boolean) => void;
};

function CharacterActions(props: CharacterActionsProps) {
  const classes = useStyle();
  const [demage, setDemage] = useState();
  const [initiative, setInitiative] = useState();

  const addDemage = (e: any) => {
    e.preventDefault();

    props.updateActor({ hpCurrent: props.hpCurrent - demage });
    props.setOpenAction(false);
  };
  const assignInitiative = (e: any) => {
    e.preventDefault();

    props.updateActor({ initiative: initiative });
    props.setOpenAction(false);
  };
  const onResetInitiative = e => {
    props.updateActor({ initiative: null });
    props.setOpenAction(false);
  };
  const onResetHp = e => {
    props.updateActor({ hpCurrent: props.hp });
    props.setOpenAction(false);
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

      <form onSubmit={addDemage}>
        <TextField
          className={classes.mainEntry}
          id="standard-number"
          label="Add Demage"
          value={demage}
          onChange={e => setDemage(e.target.value)}
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="filled"
        />
        <Fab color="secondary" size="small" onClick={onResetHp}>
          <Replay />
        </Fab>
      </form>
      <form onSubmit={assignInitiative}>
        <TextField
          className={classes.mainEntry}
          id="standard-number"
          label="Set Initiative"
          value={initiative}
          onChange={e => setInitiative(e.target.value)}
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="filled"
        />
        <Fab color="secondary" size="small" onClick={onResetInitiative}>
          <Replay />
        </Fab>
      </form>
    </div>
  );
}

export default CharacterActions;
