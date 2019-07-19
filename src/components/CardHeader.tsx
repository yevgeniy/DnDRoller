import * as React from "react";
import {
    CardHeader as MuiCardHeader,
    makeStyles,
    createStyles
} from "@material-ui/core";

const useCardHeaderStyles = makeStyles(theme => {
    return createStyles({
        root: {
            padding: [[7, 10]],
            [theme.breakpoints.up("sm")]: {
                padding: ""
            }
        }
    });
});

const CardHeader = props => {
    const cardHeaderClasses = useCardHeaderStyles(props);
    return <MuiCardHeader classes={cardHeaderClasses} {...props} />;
};

export default CardHeader;
