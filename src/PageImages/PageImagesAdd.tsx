import * as React from "react";
import { useState, useEffect } from "react";
import { Layout, LayoutControl } from "../components";
import Add from "@material-ui/icons/Add";
import { IconButton, Typography } from "@material-ui/core";
import Image from "../PageImages/Image";
import Images from "../PageImages/Images";
import { useImageIds } from "../util/hooks";
import { File } from "../services/ServiceImage";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Uploader from "../components/Uploader";

import { makeStyles, useTheme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => {
  return createStyles({
    or: {
      textAlign: "center",
      margin: theme.spacing(3)
    }
  });
});

interface PageImageAttachProps {
  onDone: (actors: number[]) => void;
  selected: number[];
}
const PageImagesAdd = React.memo((props: PageImageAttachProps) => {
  const [imageIds, createImage, deleteImage] = useImageIds();
  const [openNewImageDialog, setOpenNewImageDialog] = useState(false);
  const [newImageName, setNewImageName] = useState("");
  const classes = useStyles({});
  const [selected, setSelected] = useState(props.selected);
  const onAdd = e => {
    setNewImageName("");
    setOpenNewImageDialog(true);
  };
  const onNewImageName = e => {
    e.preventDefault();
    if (!newImageName) return;
    createImage(newImageName);
    setNewImageName("");
    setOpenNewImageDialog(false);
  };
  const onImgSelected = (f: File) => {
    createImage(+new Date() + "", f);
    setOpenNewImageDialog(false);
  };

  const onSetSelected = id => f => {
    if (f && selected.indexOf(id) === -1) setSelected([...selected, id]);
    else setSelected([...selected.filter(v => v !== id)]);
  };
  const onDone = e => {
    console.log(selected);
    props.onDone(selected);
  };

  if (!imageIds) return null;

  return (
    <Layout title="Attach Image...">
      <LayoutControl>
        <Button variant="contained" color="secondary" onClick={onDone}>
          Done
        </Button>
      </LayoutControl>
      <LayoutControl>
        <IconButton onClick={onAdd} color="inherit">
          <Add />
        </IconButton>
      </LayoutControl>
      <Images sort="name">
        {imageIds.map(v => (
          <Image
            key={v}
            id={v}
            setSelected={onSetSelected(v)}
            selected={selected.some(z => v === z)}
            deleteImage={deleteImage}
          />
        ))}
      </Images>
      <Dialog
        open={openNewImageDialog}
        onClose={e => setOpenNewImageDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Upload images. You will be able to set image names afterwards.
          </DialogContentText>

          <Uploader multiple onSelected={onImgSelected} />
          <Typography className={classes.or} variant="h4">
            -or-
          </Typography>
          <DialogContentText>
            Create an image. You will be able to upload a file afterwards.
          </DialogContentText>
          <form onSubmit={onNewImageName}>
            <TextField
              margin="dense"
              id="name"
              label="Image Name"
              fullWidth
              onChange={e => setNewImageName(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onNewImageName} color="primary">
            Submit
          </Button>
          <Button onClick={e => setOpenNewImageDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
});

export default PageImagesAdd;
