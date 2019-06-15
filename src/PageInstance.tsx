import * as React from "react";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Layout from "./Layout";
import ServiceInstance from "./services/ServiceInstance";
import { IconButton, Button, Drawer } from "@material-ui/core";
import Sort from "@material-ui/icons/Sort";
import Replay from "@material-ui/icons/Replay";
import { useService } from "./util/hooks";
import { ModelActor } from "./models/ModelActor";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Add from "@material-ui/icons/Add";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import PageInstanceActor from "./components/PageInstanceActor";
import PageInstanceActors from "./components/PageInstanceActors";
import { SortActorsBy } from "./enums";
import { RouteComponentProps } from "react-router-dom";
import PageActorAdd from "./PageActorAdd";

import {
  RouterContextView,
  RouterViewContextState
} from "./util/routerContext";

interface PageInstanceLocationState {
  id?: number;
}

const PageInstance = (
  props: RouteComponentProps<
    {},
    {},
    PageInstanceLocationState & RouterViewContextState
  >
) => {
  props.location.state = props.location.state || {};
  const [instance, removeActor] = useInstance(props.location.state.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetDialogConfirOpen, setResetDialogConfirOpen] = useState(false);
  const [resetActors, setResetActors] = useState();
  const [sort, setSort] = useState<SortActorsBy>("initiative");
  const [selectActors, setSelectActors] = useState(false);
  const buttonRef = useRef();
  const onShowSort = e => {
    setMenuOpen(true);
  };
  const onAddActors = a => {
    console.log(a);
    //updateInstance({ actors: [...a] });
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
  if (!instance) return null;

  return (
    <RouterContextView.Provider value={props}>
      <Layout
        title={`Instance: ${instance.name}`}
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
        <PageInstanceActors sort={sort}>
          {instance.actors.map(v => (
            <PageInstanceActor
              key={v}
              id={v}
              resetActor={resetActors}
              removeActor={removeActor}
            />
          ))}
        </PageInstanceActors>
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
          <PageActorAdd onDone={onAddActors} selected={instance.actors} />
        </Drawer>
      </Layout>
    </RouterContextView.Provider>
  );
};

function useInstance(id) {
  const serviceInstance: ServiceInstance = useService(ServiceInstance);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (!serviceInstance) return;
    serviceInstance.get(id).then(v => {
      setInstance(v);
    });
  }, [serviceInstance]);

  function removeActor(actorId) {
    serviceInstance.removeActor(instance.id, actorId).then(() => {
      setInstance({
        ...instance,
        actors: instance.actors.filter(v => v !== actorId)
      });
    });
  }
  return [instance, removeActor];
}

export default PageInstance;
