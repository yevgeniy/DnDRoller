import * as React from "react";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Layout from "./Layout";
import ServiceInstance from "./services/ServiceInstance";
import { IconButton } from "@material-ui/core";
import Sort from "@material-ui/icons/Sort";
import { useService } from "./util/hooks";
import { ModelActor } from "./models/ModelActor";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { PageInstanceActor, PageInstanceActors } from "./PageInstanceActor";

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
  const [sort, setSort] = useState<"initiative" | "name">("initiative");
  const buttonRef = useRef();
  const onShowSort = e => {
    setMenuOpen(true);
  };
  const onSetSort = (by: "initiative" | "name") => {
    return e => {
      setSort(by);
      setMenuOpen(false);
    };
  };
  if (!instance) return null;

  return (
    <Layout
      title="Instance"
      control={
        <>
          <IconButton onClick={onShowSort} color="inherit" ref={buttonRef}>
            <Sort />
          </IconButton>
        </>
      }
    >
      <PageInstanceActors sort={sort}>
        {instance.actors.map(v => (
          <PageInstanceActor key={v} id={v} />
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
    </Layout>
  );
};

export default PageInstance;
