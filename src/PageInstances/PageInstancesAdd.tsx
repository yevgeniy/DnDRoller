import * as React from "react";
import { useState } from "react";
import Layout from "../Layout";
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
import Instance from "./Instance";
import Instances from "./Instances";

import { useInstanceIds } from "../util/hooks";

interface PageInstanceAttachProps {
  onDone: (actors: number[]) => void;
  selected: number[];
}
const PageInstanceAttach = React.memo((props: PageInstanceAttachProps) => {
  const [instanceIds, createInstance, _, cloneInstance] = useInstanceIds();
  const [openNewInstanceDialog, setOpenNewInstanceDialog] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [selected, setSelected] = useState(props.selected);
  const onAdd = e => {
    setNewInstanceName("");
    setOpenNewInstanceDialog(true);
  };
  const onNewInstanceName = e => {
    e.preventDefault();
    if (!newInstanceName) return;
    createInstance(newInstanceName);
    setNewInstanceName("");
    setOpenNewInstanceDialog(false);
  };
  const onDone = e => {
    console.log(selected);
    props.onDone(selected);
  };
  const onSetSelected = id => f => {
    if (f && selected.indexOf(id) === -1) setSelected([...selected, id]);
    else setSelected([...selected.filter(v => v !== id)]);
  };
  if (!instanceIds) return null;
  return (
    <Layout
      title="Attach Instances..."
      control={
        <>
          <Button variant="contained" color="secondary" onClick={onDone}>
            Done
          </Button>
          <IconButton onClick={onAdd} color="inherit">
            <Add />
          </IconButton>
        </>
      }
    >
      <Instances sort="name">
        {instanceIds.map(v => (
          <Instance
            key={v}
            id={v}
            setSelected={onSetSelected(v)}
            selected={selected.some(z => v === z)}
            cloneInstance={cloneInstance}
          />
        ))}
      </Instances>
      <Dialog
        open={openNewInstanceDialog}
        onClose={e => setOpenNewInstanceDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Instance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter new instance name. You will be able to set other instance
            variables afterwards.
          </DialogContentText>
          <form onSubmit={onNewInstanceName}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Instance Name"
              fullWidth
              onChange={e => setNewInstanceName(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onNewInstanceName} color="primary">
            Submit
          </Button>
          <Button
            onClick={e => setOpenNewInstanceDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
});

export default PageInstanceAttach;
