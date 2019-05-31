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
import { ModelInstance } from "../models/ModelInstance";
import moment from "moment";
import AccessTime from "@material-ui/icons/AccessTime";

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
    },
    entry2: {
      marginTop: theme.spacing(1),
      width: "60%"
    }
  });
});

type PageInstancesActionsProps = {
  [P in keyof ModelInstance]: ModelInstance[P]
} & {
  /*update any prop of actor*/
  updateInstance: (
    a: { [P in keyof ModelInstance]?: ModelInstance[P] }
  ) => void;
  setOpenAction: (a: boolean) => void;
};

function PageInstancesActions(props: PageInstancesActionsProps) {
  const classes = useStyle();
  const [name, setName] = useState(props.name);

  const onUpdateInstance = (e: any) => {
    e.preventDefault();
    props.updateInstance({ name });
    props.setOpenAction(false);
  };
  const onReset = e => {
    setName(props.name);
  };

  return (
    <div className={classes.container}>
      <Card className={classes.nameCard}>
        <CardHeader
          avatar={<AccessTime />}
          title={props.name}
          subheader={moment()
            .subtract(+new Date() - props.created, "ms")
            .calendar()}
        />
      </Card>

      <form onSubmit={onUpdateInstance}>
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
    </div>
  );
}

export default PageInstancesActions;