import * as React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import Layout from "./Layout";
import ServiceInstance from "./services/ServiceInstance";
import { useService } from "./util/hooks";
import { ModelActor } from "./models/ModelActor";

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
  if (!instance) return null;

  return (
    <Layout title="Instance">
      <PageInstanceActors>
        {instance.actors.map(v => (
          <PageInstanceActor key={v} id={v} />
        ))}
      </PageInstanceActors>
    </Layout>
  );
};

export default PageInstance;
