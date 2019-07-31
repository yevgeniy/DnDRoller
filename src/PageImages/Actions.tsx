import * as React from "react";
import { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Replay from "@material-ui/icons/Replay";
import Photo from "@material-ui/icons/Photo";
import { Card, TextField, Fab } from "@material-ui/core";
import { CardHeader } from "../components";
import { ModelImage } from "../models/ModelImage";
import KeywordListInput from "../components/KeywordListInput";
import Uploader from "../components/Uploader";
import File from "../services/ServiceImage";

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
    divider: {
      margin: theme.spacing(2)
    }
  });
});

type ActorProps = { [P in keyof ModelImage]: ModelImage[P] } & {
  updateImage: (a: { [P in keyof ModelImage]?: ModelImage[P] }) => void;
  setOpenAction: (a: boolean) => void;
  upload: (f: File) => void;
};

const Actions = React.memo((props: ActorProps) => {
  const classes = useStyle();
  const [name, setName] = useState(props.name);

  const onUpdateName = e => {
    e.preventDefault();
    props.updateImage({ name: name.trim() });
    props.setOpenAction(false);
  };
  const onReset = e => {
    setName(props.name);
  };
  const onUpdateKeyWords = (keywords: string[]) => {
    props.updateImage({ keywords });
  };

  return (
    <div className={classes.container}>
      <Card className={classes.nameCard}>
        <CardHeader avatar={<Photo />} title={props.name} />
      </Card>

      <form onSubmit={onUpdateName}>
        <TextField
          className={classes.mainEntry}
          label="Name"
          value={name || ""}
          onChange={e => setName(e.target.value)}
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
          onClick={onReset}
        >
          <Replay />
        </Fab>
      </form>
      <KeywordListInput keywords={props.keywords} onUpdate={onUpdateKeyWords} />
      <Divider className={classes.divider} />
      <Uploader onSelected={props.upload} />
    </div>
  );
});

export default Actions;
