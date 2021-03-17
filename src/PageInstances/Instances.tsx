import * as React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { SortInstancesBy } from "../enums";
import { ModelInstance } from "../models/ModelInstance";
import { useService } from "../util/hooks";
import ServiceInstance from "../services/ServiceInstance";

const useStyles = makeStyles(theme => {
  return {
    card: {
      marginTop: theme.spacing(1),
      "&:first-child": {
        marginTop: 0
      }
    }
  };
});

interface InstancesProps {
  children: (v: ModelInstance) => React.ReactElement;
  sort: SortInstancesBy;
  ids: number[];
}
const Instances = React.memo(({ children, sort, ids }: InstancesProps) => {
  const classes = useStyles({});
  const [entries, setentries] = useState([]);
  const service = useService(ServiceInstance);

  useEffect(() => {
    if (!service) return;

    service.getAll(ids).then(instances => {
      setentries(instances);
    });
  }, [service, ids.join(",")]);

  switch (sort) {
    case "name":
      entries.sort((a, b) => (a.name > b.name ? 1 : -1));
      break;
    case "newest":
      entries.sort((a, b) => (a.created > b.created ? -1 : 1));
      break;
    case "oldest":
      entries.sort((a, b) => (a.created > b.created ? 1 : -1));
      break;
    default:
  }

  return (
    <div>
      {entries.map(v =>
        React.cloneElement(children(v), {
          key: v.id,
          classes
        })
      )}
    </div>
  );
});

export default Instances;
