import * as React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { SortImagesBy } from "../enums";

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

interface ImageProps {
    children: React.ReactElement | React.ReactElement[];
    sort: SortImagesBy;
}
const Images = ({ children, ...props }: ImageProps) => {
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
};

function useSort(
    by: SortImagesBy,
    children: React.ReactElement | React.ReactElement[]
): [any[]] {
    const [sort, setSort] = useState([]);

    switch (by) {
        case "name":
            sort.sort((a, b) => (a.name > b.name ? 1 : -1));
            break;
        case "newest":
            sort.sort((a, b) => (a.created > b.created ? -1 : 1));
            break;
        case "oldest":
            sort.sort((a, b) => (a.created > b.created ? 1 : -1));
            break;
        default:
    }

    const elms = React.Children.map(children, v => {
        return React.cloneElement(v, {
            setSortImage: a => {
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

export default Images;
