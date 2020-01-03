import * as React from "react";
import { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import moment from "moment";
import green from "@material-ui/core/colors/green";
import { Divider, Card, CardHeader, TextField, Fab } from "@material-ui/core";

import SaveAlt from "@material-ui/icons/SaveAlt";
import AccessTime from "@material-ui/icons/AccessTime";
import Replay from "@material-ui/icons/Replay";
import ReplyAll from "@material-ui/icons/ReplyAll";
import { Link } from "react-router-dom";

import { ModelInstance } from "../models/ModelInstance";

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
    },
    gotoButton: {
      background: green[600],
      color: theme.palette.common.white,
      marginLeft: theme.spacing(1),
      "& svg": {
        transform: "scaleX(-1)"
      }
    }
  });
});

type PageInstancesActionsProps = {
  [P in keyof ModelInstance]: ModelInstance[P];
} & {
  /*update any prop of actor*/
  onDone?: (a: { [P in keyof ModelInstance]?: ModelInstance[P] }) => void;
};

const PageInstancesActions = React.memo((props: PageInstancesActionsProps) => {
  const classes = useStyle({});
  const [name, setName] = useState(props.name);

  const onUpdateInstance = (e: any) => {
    e.preventDefault();
    props.onDone({ name });
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
          action={
            <>
              <Fab
                className={classes.gotoButton}
                component={Link}
                to={{
                  pathname: "/instance",
                  state: {
                    id: props.id
                  }
                }}
              >
                <ReplyAll />
              </Fab>
            </>
          }
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
});

export default PageInstancesActions;
