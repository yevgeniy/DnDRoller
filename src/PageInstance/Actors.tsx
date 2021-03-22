import * as React from "react";
import { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { SortActorsBy } from "../enums";
import { ModelActor } from "../models/ModelActor";
import { useService, useCommonHook, useActor } from "../util/hooks";
import ServiceActor from "../services/ServiceActor";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {},
      card: {
        marginTop: theme.spacing(1),
        "&:first-child": {
          marginTop: 0
        }
      }
    });
  },
  { name: "Actors" }
);

interface ActorsProps {
  children: (v: ModelActor) => React.ReactElement;
  sort: SortActorsBy;
  ids: number[];
}
const Actors = ({ children, sort, ids }: ActorsProps) => {
  const classes = useStyles({});
  const [entries, setentries] = useState([]);
  const service = useService(ServiceActor);

  useEffect(() => {
    if (!service) return;

    service.getAll(ids).then(actors => {
      setentries([...actors]);
    });
  }, [service, ids.join(",")]);

  switch (sort) {
    case "initiative":
      entries.sort((a, b) => (+a.initiative > +b.initiative ? -1 : 1));
      break;
    case "name":
      entries.sort((a, b) => (a.name > b.name ? 1 : -1));
      break;
    default:
  }

  return (
    <div>
      {entries.map(v => (
        <SortableEntry key={v.id} entry={v} setEntries={setentries}>
          {React.cloneElement(children(v), {
            classes
          })}
        </SortableEntry>
      ))}
    </div>
  );
};

function SortableEntry({ entry, children, setEntries }) {
  const [actor] = useCommonHook(useActor, entry.id) || [null];

  useEffect(() => {
    if (!actor) return;

    if (entry.name !== actor.name || entry.initiative !== actor.initiative)
      setEntries(entries => entries.map(v => (v.id === actor.id ? actor : v)));
  }, [actor && actor.initiative, actor && actor.name]);

  if (!actor) return null;

  return children;
}

export default Actors;
