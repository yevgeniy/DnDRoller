import * as React from "react";
import { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Replay from "@material-ui/icons/Replay";
import Photo from "@material-ui/icons/Photo";
import Edit from "@material-ui/icons/Edit";
import {
  Card,
  TextField,
  Fab,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputLabel,
  Select,
  FilledInput,
  Button,
  MenuItem,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import { CardHeader, Input } from "../components";
import { ModelImage } from "../models/ModelImage";
import KeywordListInput from "../components/KeywordListInput";
import Uploader from "../components/Uploader";
import File from "../services/ServiceImage";
import { useImage, useResetable, useModalState } from "../util/hooks";

const useStyle = makeStyles(theme => {
  return createStyles({
    reset: {
      margin: theme.spacing(1, 0, 1, 1)
    },
    container: {
      padding: theme.spacing(1),
      width: 200
    },
    formControl: {
      margin: theme.spacing(0, 0, 1, 0),
      minWidth: 120
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
    divider: {
      margin: theme.spacing(2)
    },
    tabControlButton: {
      marginTop: theme.spacing(2),
      "& svg": {
        margin: "0 0 0 8px"
      }
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

  const onReset = e => {
    reset();
  };
  const onUpdateKeyWords = (keywords: string[]) => {
    updateImage({ keywords });
  };

  if (!image) return null;

  const { name, keywords, type } = image;

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
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="filled-size-simple">Type</InputLabel>
          <Select
            defaultValue={type || "image"}
            onChange={e => updateImage({ type: e.target.value })}
            input={<FilledInput name="type" id="filled-size-simple" />}
          >
            <MenuItem value={"image"}>Image</MenuItem>
            <MenuItem value={"text"}>Text</MenuItem>
            <MenuItem value={"site"}>Site</MenuItem>
            <MenuItem value={"filter"}>Filter</MenuItem>
          </Select>
        </FormControl>
        <div>
          <Fab
            className={classes.reset}
            color="secondary"
            variant="extended"
            size="small"
            onClick={onReset}
          >
            <Replay />
            Reset
          </Fab>
        </div>
      </form>

      <KeywordListInput keywords={keywords} onUpdate={onUpdateKeyWords} />

      <ImageContext {...image} classes={classes} upload={upload} />
      <TextContext {...image} classes={classes} updateImage={updateImage} />
      <SiteContext {...image} classes={classes} />
    </div>
  );
});

const ImageContext = ({ classes, upload, type }) => {
  if (type !== "image") return null;

  return (
    <div className={classes.uploaderContainer}>
      <Uploader onSelected={upload} />
    </div>
  );
};

const AddTextModal = ({ isOpen, onDone, doClose, text }) => {
  const [t, settext] = useState(text);
  return (
    <Dialog open={isOpen} onClose={doClose} aria-labelledby="form-dialog-title">
      <DialogContent>
        <DialogContentText>
          Enter text data for this image. The data will percist even if the
          image type changes.
        </DialogContentText>

        <FormControl fullWidth variant="filled">
          <TextField
            id="outlined-multiline-static"
            label="Text"
            multiline
            rows={20}
            defaultValue={t}
            variant="outlined"
            onChange={e => settext(e.target.value)}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onDone(t);
          }}
          color="primary"
        >
          Submit
        </Button>
        <Button onClick={doClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TextContext = ({ classes, type, updateImage, text }) => {
  if (type !== "text") return null;

  const { isOpen, doOpen, doClose, onDone } = useModalState<string>(false);

  const onClick = () => {
    doOpen().then(v => {
      updateImage({ text: v });
    });
  };

  return (
    <div>
      <Button
        className={classes.tabControlButton}
        variant="contained"
        color="secondary"
        button="true"
        onClick={onClick}
      >
        <Edit />
        Enter Text
      </Button>

      <AddTextModal
        isOpen={isOpen}
        doClose={doClose}
        onDone={onDone}
        text={text}
      />
    </div>
  );
};

const SiteContext = () => {
  return null;
};

export default Actions;
