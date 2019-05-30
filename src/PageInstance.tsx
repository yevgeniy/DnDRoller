import * as React from "react";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Layout from "./Layout";
import ServiceInstance from "./services/ServiceInstance";
import { IconButton, Button } from "@material-ui/core";
import Sort from "@material-ui/icons/Sort";
import Replay from "@material-ui/icons/Replay";
import { useService } from "./util/hooks";
import { ModelActor } from "./models/ModelActor";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { PageInstanceActor } from "./components/PageInstanceActor";
import { PageInstanceActors } from "./components/PageInstanceActors";
import { SortBy } from "./enums";

interface PageInstanceProps {
  id: number;
}

function useInstance(id) {
  const serviceInstance: ServiceInstance = useService(ServiceInstance);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (!serviceInstance) return;
    serviceInstance.get(id).then(v => {
      setInstance(v);
    });
  }, [serviceInstance]);

  return [instance];
}

const INSTANCE_ID = 1;
const PageInstance = props => {
  const [instance] = useInstance(INSTANCE_ID);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetDialogConfirOpen, setResetDialogConfirOpen] = useState(false);
  const [resetActors, setResetActors] = useState();
  const [sort, setSort] = useState<SortBy>("initiative");
  const buttonRef = useRef();
  const onShowSort = e => {
    setMenuOpen(true);
  };
  const onSetSort = (by: SortBy) => {
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
    <Layout
      title="Instance"
      control={
        <>
          <IconButton onClick={onReset} color="inherit" ref={buttonRef}>
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
          <PageInstanceActor key={v} id={v} resetActor={resetActors} />
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
    </Layout>
  );
};

export default PageInstance;
