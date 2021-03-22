import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import blue from "@material-ui/core/colors/blue";
import ReplyAll from "@material-ui/icons/ReplyAll";
import FaceIcon from "@material-ui/icons/Face";
import Replay from "@material-ui/icons/Replay";
import {
  Paper,
  Divider,
  Typography,
  Chip,
  Card,
  CardHeader,
  TextField,
  Fab
} from "@material-ui/core";

import { ModelActor } from "../models/ModelActor";
import { useCommonHook, useActor } from "../util/hooks";
import { Input } from "../components";

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
    },
    gotoButton: {
      background: blue[600],
      color: theme.palette.common.white,
      marginLeft: theme.spacing(1),
      "& svg": {
        transform: "scaleX(-1)"
      }
    }
  };
});

type ActionsProps = { [P in keyof ModelActor]: ModelActor[P] } & {
  /*update any prop of actor*/
  onDone: (a?: { [P in keyof ModelActor]?: ModelActor[P] }) => void;
};

const Actions = React.memo((props: ActionsProps) => {
  const classes = useStyle({});

  const [initiative, setinitiative] = useState(0);
  const [demage, setdemage] = useState(0);
  const [actor, updateActor] = useCommonHook(useActor, props.id) || [
    null,
    null
  ];

  if (!actor) return null;

  const addDemage = e => {
    e.preventDefault();

    updateActor({ hpCurrent: actor.hpCurrent - demage });
    props.onDone();
  };
  const assignInitiative = e => {
    e.preventDefault();

    updateActor({ initiative: initiative });
    props.onDone();
  };
  const onResetInitiative = e => {
    e.preventDefault();
    updateActor({ initiative: null });
    props.onDone();
  };
  const onResetHp = e => {
    e.preventDefault();
    updateActor({ hpCurrent: props.hp });
    props.onDone();
  };

  const c: string[] = [];
  for (let i in actor.class) c.push(`${i} lvl ${actor.class[i]}`);

  return (
    <div className={classes.container}>
      <Card className={classes.nameCard}>
        <CardHeader
          avatar={<FaceIcon />}
          title={actor.name}
          subheader={c.join(", ")}
          action={
            <>
              <Fab
                className={classes.gotoButton}
                component={Link}
                to={{
                  pathname: "/actors",
                  state: {
                    discover: actor.id
                  }
                }}
              >
                <ReplyAll />
              </Fab>
            </>
          }
        />
      </Card>

      <form onSubmit={addDemage}>
        <Input
          className={classes.mainEntry}
          id="standard-number"
          label="Add Demage"
          defaultValue=""
          onChange={v => setdemage(v)}
          type="number"
        />
        <Fab color="secondary" size="small" onClick={onResetHp}>
          <Replay />
        </Fab>
      </form>
      <form onSubmit={assignInitiative}>
        <Input
          className={classes.mainEntry}
          id="standard-number"
          label="Set Initiative"
          defaultValue={initiative || ""}
          onChange={v => setinitiative(v)}
          type="number"
        />
        <Fab color="secondary" size="small" onClick={onResetInitiative}>
          <Replay />
        </Fab>
      </form>
      <Divider />
      <form onSubmit={e => e.preventDefault()}>
        <Input
          className={classes.mainEntry}
          id="standard-number"
          label="Current hp"
          defaultValue={actor.hpCurrent}
          onChange={v => updateActor({ hpCurrent: v })}
          type="number"
        />
      </form>
    </div>
  );
});

export default Actions;
