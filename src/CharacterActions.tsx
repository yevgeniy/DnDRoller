import * as React from "react";
import { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import { Card, CardHeader, TextField } from "@material-ui/core";
import { ModelActor } from "./models/ModelActor";

const useStyle = makeStyles(theme => {
  return {
    root: {
      padding: theme.spacing(1),
      minWidth: 300
    }
  };
});

interface CharacterActionsProps {
  actor: ModelActor;
  setActor: (a: ModelActor) => void;
}

export default function(props: CharacterActionsProps) {
  const classes = useStyle();
  const [demage, setDemage] = useState();

  function addDemage(e) {
    e.preventDefault();

    console.log("a", demage);
  }
  return (
    <div className={classes.root}>
      <Card>
        <CardHeader
          avatar={<FaceIcon />}
          title="Arhail"
          subheader="Priest lvl 3"
          action={<Chip label="10/40" color="secondary" variant="outlined" />}
        />
      </Card>

      <form onSubmit={addDemage}>
        <TextField
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
      </form>
    </div>
  );
}
