import * as React from "react";
import { useState, useEffect } from "react";
import Layout from "../Layout";
import Add from "@material-ui/icons/Add";
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
  IconButton
} from "@material-ui/core";
import { useImageIds } from "../util/hooks";
import { RouterContextView } from "../util/routerContext";
import Images from "./Images";
import Image from "./Image";

function PageInstances(props) {
  const [imageIds, createImage, deleteImage] = useImageIds();
  const [openNewImageDialog, setOpenNewImageDialog] = useState(false);
  const [newImageName, setNewImageName] = useState("");

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
  if (!imageIds) return null;

  return (
    <RouterContextView.Provider value={props}>
      <Layout
        title="Instance Respository"
        control={
          <>
            <IconButton onClick={onAdd} color="inherit">
              <Add />
            </IconButton>
          </>
        }
      >
        <Images sort="name">
          {imageIds.map(v => (
            <Image key={v} id={v} deleteImage={deleteImage} />
          ))}
        </Images>
        <Dialog
          open={openNewImageDialog}
          onClose={e => setOpenNewImageDialog(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">New Instance</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter new instance name. You will be able to set other instance
              variables afterwards.
            </DialogContentText>
            <form onSubmit={onNewImageName}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Instance Name"
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
    </RouterContextView.Provider>
  );
}

export default PageInstances;
