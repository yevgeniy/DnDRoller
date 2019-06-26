import * as React from "react";
import { makeStyles, useTheme, createStyles } from "@material-ui/core/styles";
import { useInstance } from "../util/hooks";
import {
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from "@material-ui/core";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import { Link } from "react-router-dom";
import clsx from "clsx";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";

const useStyles = makeStyles(theme => {
    return createStyles({
        avatar: {
            backgroundColor: red[500],
            [theme.breakpoints.down("xs")]: {
                width: 30,
                height: 30
            }
        },
        instanceAvatar: {
            backgroundColor: blue[500]
        },
        removeInstance: {
            "& svg": {
                color: red[600]
            }
        }
    });
});

interface OnInstanceEntryProps {
    id: number;
    detatchInstance: (a: number) => void;
    removingInstances: boolean;
}
const OnInstanceEntry = (props: OnInstanceEntryProps) => {
    const classes = useStyles();
    const [instance] = useInstance(props.id);

    if (!instance) return null;

    return (
        <ListItem
            button
            component={Link}
            to={{
                pathname: "/instances",
                state: {
                    discover: props.id
                }
            }}>
            <ListItemAvatar>
                <Avatar
                    className={clsx(classes.avatar, classes.instanceAvatar)}>
                    {instance.name[0]}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={instance.name} />
            {props.removingInstances ? (
                <ListItemSecondaryAction>
                    <IconButton
                        onClick={e => props.detatchInstance(props.id)}
                        className={classes.removeInstance}
                        edge="end"
                        aria-label="Comments">
                        <RemoveCircle />
                    </IconButton>
                </ListItemSecondaryAction>
            ) : null}
        </ListItem>
    );
};

export default OnInstanceEntry;
