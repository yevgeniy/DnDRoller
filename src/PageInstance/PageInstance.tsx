import * as React from "react";
import { useRef, useState } from "react";

import { RouteComponentProps } from "react-router-dom";

import Sort from "@material-ui/icons/Sort";
import Replay from "@material-ui/icons/Replay";
import Add from "@material-ui/icons/Add";

import {
  IconButton,
  Button,
  Drawer,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

import Actor from "./Actor";
import Actors from "./Actors";
import { SortActorsBy } from "../enums";

import PageActorsAdd from "../PageActors/PageActorsAdd";
import Layout from "../Layout";
import { useInstance } from "../util/hooks";

import {
  RouterContextView,
  RouterViewContextState
} from "../util/routerContext";

interface PageInstanceLocationState {
  id?: number;
}

const PageInstance = React.memo(
  (
    props: RouteComponentProps<
      {},
      {},
      PageInstanceLocationState & RouterViewContextState
    >
  ) => {
    props.location.state = props.location.state || {};
    const [instance, updateInstance, createInstance, cloneActor] = useInstance(
      props.location.state.id || "empty",
      props.history
    );
    const [menuOpen, setMenuOpen] = useState(false);
    const [resetDialogConfirOpen, setResetDialogConfirOpen] = useState(false);
    const [resetActors, setResetActors] = useState();
    const [sort, setSort] = useState<SortActorsBy>("initiative");
    const [selectActors, setSelectActors] = useState(false);
    const [openNewInstanceDialog, setOpenNewInstanceDialog] = useState(false);
    const [newInstanceName, setNewInstanceName] = useState("");
    const buttonRef = useRef();
    const onShowSort = e => {
      setMenuOpen(true);
    };
    const onAddActors = a => {
      console.log(a);
      updateInstance({ actors: [...a] });
      setSelectActors(false);
    };
    const onSetSort = (by: SortActorsBy) => {
      return e => {
        setSort(by);
        setMenuOpen(false);
      };
    };
    const onReset = e => {
      setResetDialogConfirOpen(true);
    };
    const onHandleResetYes = e => {
      setResetActors(+new Date());
      setResetDialogConfirOpen(false);
    };
    const removeActor = actorId => {
      updateInstance({ actors: instance.actors.filter(v => v !== actorId) });
    };
    const onSave = e => {
      setNewInstanceName("");
      setOpenNewInstanceDialog(true);
    };
    const onNewInstanceName = e => {
      e.preventDefault();
      if (!newInstanceName) return;
      createInstance(newInstanceName, instance);
      setNewInstanceName("");
      setOpenNewInstanceDialog(false);
    };
    if (!instance) return null;

    return (
      <RouterContextView.Provider value={props}>
        <Layout
          title={
            instance.id ? (
              `Instance: ${instance.name}`
            ) : (
              <Button variant="contained" color="default" onClick={onSave}>
                Save
              </Button>
            )
          }
          router={props}
          control={
            <>
              <IconButton onClick={e => setSelectActors(true)} color="inherit">
                <Add />
              </IconButton>
              <IconButton onClick={onReset} color="inherit">
                <Replay />
              </IconButton>
              <IconButton onClick={onShowSort} color="inherit" ref={buttonRef}>
                <Sort />
              </IconButton>
            </>
          }
        >
          <Actors sort={sort}>
            {instance.actors.map(v => (
              <Actor
                key={v}
                id={v}
                resetActor={resetActors}
                removeActor={removeActor}
                cloneActor={cloneActor}
              />
            ))}
          </Actors>
          <Menu
            id="simple-menu"
            anchorEl={buttonRef.current}
            open={Boolean(menuOpen)}
            onClose={() => setMenuOpen(false)}
          >
            <MenuItem onClick={onSetSort("name")}>Name</MenuItem>
            <MenuItem onClick={onSetSort("initiative")}>Initiative</MenuItem>
          </Menu>
          <Dialog
            open={resetDialogConfirOpen}
            onClose={e => setResetDialogConfirOpen(false)}
          >
            <DialogTitle id="alert-dialog-title">
              Reset All Instance Actors?
            </DialogTitle>
            <DialogActions>
              <Button onClick={onHandleResetYes} color="primary" autoFocus>
                Yes
              </Button>
              <Button
                onClick={e => setResetDialogConfirOpen(false)}
                color="primary"
              >
                No
              </Button>
            </DialogActions>
          </Dialog>
          <Drawer
            anchor="top"
            open={selectActors}
            onClose={e => setSelectActors(false)}
          >
            <PageActorsAdd onDone={onAddActors} selected={instance.actors} />
          </Drawer>
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
      </RouterContextView.Provider>
    );
  }
);

export default PageInstance;
