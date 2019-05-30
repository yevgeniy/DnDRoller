import * as React from "react";
import Layout from "./Layout";
import Add from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import Instance from "./components/Instance";
import Instances from "./components/Instances";

function PageInstances(props) {
  const onAdd = e => {};
  return (
    <Layout
      title="Instance"
      control={
        <>
          <IconButton onClick={onAdd} color="inherit">
            <Add />
          </IconButton>
        </>
      }
    >
      <Instances sort="name">
        <Instance id={1} />
        <Instance id={2} />
      </Instances>
    </Layout>
  );
}

export default PageInstances;
