import * as React from "react";
import { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { SortActorsBy } from "../enums";

const useActorsStyles = makeStyles(
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
  children: React.ReactElement | React.ReactElement[];
  sort: SortActorsBy;
}
const Actors = React.memo(({ children, ...props }: ActorsProps) => {
  const classes = useActorsStyles(props);
  const [sortedElms] = useSort(props.sort, children);

  return (
    <div className={classes.root}>
      {sortedElms.map(v =>
        React.cloneElement(v, {
          classes
        })
      )}
    </div>
  );
});

function useSort(
  by: SortActorsBy,
  children: React.ReactElement | React.ReactElement[]
): [any[]] {
  const [sortActors, setSortActors] = useState([]);

  switch (by) {
    case "initiative":
      sortActors.sort((a, b) => (a.initiative > b.initiative ? -1 : 1));
      break;
    case "name":
      sortActors.sort((a, b) => (a.name > b.name ? 1 : -1));
      break;
    default:
  }

  const elms = React.Children.map(children, v => {
    return React.cloneElement(v, {
      setSortActor: a => {
        const i = sortActors.findIndex(v => v.id == a.id);
        if (i === -1) setSortActors([...sortActors, a]);
        else {
          sortActors[i] = { ...a };
          setSortActors([...sortActors]);
        }
      }
    });
  });
  const sortedelms = [];

  sortActors.forEach(v => {
    var id = elms.findIndex(z => z.props.id == v.id);
    var elm = elms.splice(id, 1)[0];
    if (elm) sortedelms.push(elm);
  });
  sortedelms.push(...elms);
  return [sortedelms];
}
export default Actors;
