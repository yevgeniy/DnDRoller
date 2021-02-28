import * as React from "react";
import { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Replay from "@material-ui/icons/Replay";
import Photo from "@material-ui/icons/Photo";
import { Card, TextField, Fab } from "@material-ui/core";
import { CardHeader, Input } from "../components";
import { ModelImage } from "../models/ModelImage";
import KeywordListInput from "../components/KeywordListInput";
import Uploader from "../components/Uploader";
import File from "../services/ServiceImage";
import { useImage, useResetable } from "../util/hooks";

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
    },
    uploaderContainer: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    }
  });
});

type ActorProps = { [P in keyof ModelImage]: ModelImage[P] } & {
  id: number;
};

const Actions = React.memo((props: ActorProps) => {
  const classes = useStyle({});

  const [image, updateImage, reset, resetToken, upload] = useResetable(
    useImage,
    props.id
  ) || [null, null, null, null, null];

  console.log(resetToken);
  const onReset = e => {
    reset();
  };
  const onUpdateKeyWords = (keywords: string[]) => {
    updateImage({ keywords });
  };

  if (!image) return null;

  const { name, keywords } = image;

  return (
    <div className={classes.container}>
      <Card className={classes.nameCard}>
        <CardHeader avatar={<Photo />} title={name} />
      </Card>

      <form onSubmit={e => e.preventDefault()}>
        <Input
          className={classes.mainEntry}
          label="Name"
          defaultValue={name || ""}
          onChange={v => updateImage({ name: v.trim() })}
          resetToken={resetToken}
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

      <div className={classes.uploaderContainer}>
        <Uploader onSelected={upload} />
      </div>

      <KeywordListInput keywords={keywords} onUpdate={onUpdateKeyWords} />
    </div>
  );
});

export default Actions;
