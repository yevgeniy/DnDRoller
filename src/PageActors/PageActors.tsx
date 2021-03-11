import * as React from "react";
import { useState } from "react";
import { Layout, LayoutControl } from "../components";
import Add from "@material-ui/icons/Add";
import {
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import Actor from "./Actor";
import Actors from "./Actors";
import { useActorIds } from "../util/hooks";

import { ModelRoutedPage } from "../models/ModelRoutedPage";

interface PageActorLocationState {
  discover?: number;
}

const PageActors = (props: ModelRoutedPage<PageActorLocationState>) => {
  props.location.state = props.location.state || {};
  const [actorIds, createActor, deleteActor, cloneActor] = useActorIds();
  const [openNewActorDialog, setOpenNewActorDialog] = useState(false);
  const [newActorName, setNewActorName] = useState("");

  const onAdd = e => {
    setNewActorName("");
    setOpenNewActorDialog(true);
  };
  const onNewActorName = e => {
    e.preventDefault();
    if (!newActorName) return;
    createActor(newActorName);
    setNewActorName("");
    setOpenNewActorDialog(false);
  };
  if (!actorIds) return null;
  return (
    <Layout historyId={props.history.location.key} title="Actor Repository">
      <LayoutControl>
        <IconButton onClick={onAdd} color="inherit">
          <Add />
        </IconButton>
      </LayoutControl>

      <Actors sort="name">
        {actorIds.map(v => (
          <Actor
            key={v}
            id={v}
            deleteActor={deleteActor}
            cloneActor={cloneActor}
            discover={props.location.state.discover}
          />
        ))}
      </Actors>
      <Dialog
        open={openNewActorDialog}
        onClose={e => setOpenNewActorDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Actor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter new actor name. You will be able to set other actor variables
            afterwards.
          </DialogContentText>
          <form onSubmit={onNewActorName}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Actor Name"
              fullWidth
              onChange={e => setNewActorName(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onNewActorName} color="primary">
            Submit
          </Button>
          <Button onClick={e => setOpenNewActorDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default PageActors;
