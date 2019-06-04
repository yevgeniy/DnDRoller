import * as React from "react";
import { useState, useEffect } from "react";
import Layout from "./Layout";
import Add from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import Actor from "./components/Actor";
import Actors from "./components/Actors";
import ServiceActor from "./services/ServiceActor";
import { useService } from "./util/hooks";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function PageActors(props) {
  const [actorIds, createActor] = useActorIds();
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
    <Layout
      router={props}
      title="Actor Repository"
      control={
        <>
          <IconButton onClick={onAdd} color="inherit">
            <Add />
          </IconButton>
        </>
      }
    >
      <Actors sort="name">
        {actorIds.map(v => (
          <Actor key={v} id={v} />
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
}

export default PageActors;

function useActorIds() {
  const serviceActor = useService(ServiceActor);
  const [actorIds, setActorIds] = useState();

  useEffect(() => {
    if (!serviceActor) return;

    serviceActor.getAll().then(res => {
      setActorIds(res.map(v => v.id));
    });
  }, [serviceActor]);

  const createActor = async name => {
    const newid = (await serviceActor.createActor(name)).id;
    setActorIds([...actorIds, newid]);
  };

  return [actorIds, createActor];
}
