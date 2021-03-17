import * as React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { SortActorsBy } from "../enums";
import { useService } from "../util/hooks";
import ServiceActor from "../services/ServiceActor";

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

interface ActorsProps {
  children: (ModelActor) => React.ReactElement;
  sort: SortActorsBy;
  ids: number[];
}
const Actors = React.memo(({ children, sort, ids }: ActorsProps) => {
  const classes = useStyles({});
  const [entries, setentries] = useState([]);
  const service = useService(ServiceActor);

  useEffect(() => {
    if (!service) return;

    service.getAll(ids).then(actors => {
      setentries(actors);
    });
  }, [service, ids.join(",")]);

  switch (sort) {
    case "name":
      entries.sort((a, b) => (a.name > b.name ? 1 : -1));
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

export default Actors;
