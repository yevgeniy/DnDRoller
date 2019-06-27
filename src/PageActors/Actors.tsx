import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { SortActorsBy } from "../enums";

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
    children: React.ReactElement | React.ReactElement[];
    sort: SortActorsBy;
}
function Actors({ children, ...props }: ActorsProps) {
    const classes = useStyles(props);
    const [sortedElms] = useSort(props.sort, children);

    return (
        <div>
            {sortedElms.map(v =>
                React.cloneElement(v, {
                    classes
                })
            )}
        </div>
    );
}

function useSort(
    by: SortActorsBy,
    children: React.ReactElement | React.ReactElement[]
): [any[]] {
    const [sort, setSort] = useState([]);

    switch (by) {
        case "name":
            sort.sort((a, b) => (a.name > b.name ? 1 : -1));
            break;
        case "initiative":
            sort.sort((a, b) => (a.initiative > b.initiative ? -1 : 1));
            break;
        default:
    }

    const elms = React.Children.map(children, v => {
        return React.cloneElement(v, {
            setSortActor: a => {
                const i = sort.findIndex(v => v.id === a.id);
                if (i === -1) setSort([...sort, a]);
                else {
                    sort[i] = { ...a };
                    setSort([...sort]);
                }
            }
        });
    });
    const sortedelms = [];

    sort.forEach(v => {
        var id = elms.findIndex(z => z.props.id === v.id);
        var elm = elms.splice(id, 1)[0];
        if (elm) sortedelms.push(elm);
    });
    sortedelms.push(...elms);
    return [sortedelms];
}

export default Actors;
