import * as React from "react";
import { useState, useEffect } from "react";
import Layout from "./Layout";
import Add from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import Actor from "./components/Actor";
import Actors from "./components/Actors";
import ServiceActor from "./services/ServiceActor";
import ServiceInstance from "./services/ServiceInstance";
import { useService } from "./util/hooks";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import {
  RouterContextView,
  RouterViewContextState
} from "./util/routerContext";
import { RouteComponentProps } from "react-router-dom";

interface PageActorLocationState {
  discover?: number;
}

function PageActors(
  props: RouteComponentProps<
    {},
    {},
    RouterViewContextState & PageActorLocationState
  >
) {
  props.location.state = props.location.state || {};
  const [actorIds, createActor, deleteActor] = useActorIds();
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
    <RouterContextView.Provider value={props}>
      <Layout
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
            <Actor
              key={v}
              id={v}
              deleteActor={deleteActor}
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
              Enter new actor name. You will be able to set other actor
              variables afterwards.
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
    </RouterContextView.Provider>
  );
}

export default PageActors;

function useActorIds() {
  const serviceActor = useService(ServiceActor);
  const serviceInstance = useService(ServiceInstance);
  const [actorIds, setActorIds] = useState();

  useEffect(() => {
    if (!serviceActor) return;
    if (!serviceInstance) return;

    serviceActor.getAll().then(res => {
      setActorIds(res.map(v => v.id));
    });
  }, [serviceActor, serviceInstance]);

  async function createActor(name) {
    const newid = (await serviceActor.createActor(name)).id;
    setActorIds([...actorIds, newid]);
  }
  async function deleteActor(id: number) {
    var instances = await serviceInstance.getForActor(id);
    instances.forEach(instance => {
      instance.actors = instance.actors.filter(v => v !== id);
      serviceInstance.save(instance);
    });
    await serviceActor.deleteActor(id);
    setActorIds([...actorIds.filter(v => v !== id)]);
  }

  return [actorIds, createActor, deleteActor];
}
