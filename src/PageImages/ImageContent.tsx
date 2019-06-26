import * as React from "react";
import { ModelImage } from "../models/ModelImage";
import { useState, useEffect, useRef } from "react";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import Extension from "@material-ui/icons/Extension";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import Delete from "@material-ui/icons/Delete";
import {
    Typography,
    CardMedia,
    Divider,
    IconButton,
    Avatar,
    CardContent,
    CardHeader,
    Card,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
    ListItemSecondaryAction,
    Paper,
    Chip,
    Button,
    Collapse,
    Drawer,
    Checkbox
} from "@material-ui/core";
import PageInstanceAttach from "../PageInstanceAttach";
import PageActorAdd from "../PageActorAdd";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useInstanceIdsForImage, useActorIdsForImage } from "../util/hooks";
import OnInstanceEntry from "./OnInstanceEntry";
import OnActorEntry from "./OnActorEntry";

const useStyles = makeStyles(theme =>
    createStyles({
        cardContent: {
            marginTop: theme.spacing(1),
            display: "flex",
            flexWrap: "wrap",
            "& > *": {
                flex: 1,
                [theme.breakpoints.down("xs")]: {
                    flexBasis: "100%",
                    flexShrink: 0
                }
            }
        },
        removeInstance: {
            "& svg": {
                color: red[600]
            }
        },
        deleteContainer: {
            display: "flex",
            justifyContent: "flex-end"
        },
        deleteImageButton: {
            background: orange[600],
            marginLeft: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        },
        addParticipantButton: {
            background: green[600],
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        },
        removeFromParticipantStart: {
            background: red[600],
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        },
        participantsControls: {
            display: "flex",
            justifyContent: "flex-start",
            marginTop: theme.spacing(1)
        }
    })
);

type ImageContentProps = { [P in keyof ModelImage]: ModelImage[P] } & {
    deleteImage: (id: number) => void;
};

const ImageContent = (props: ImageContentProps) => {
    const classes = useStyles();

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updatingInstances, setUpdatingInstances] = useState(false);
    const [removingInstances, setRemovingInstances] = useState(false);
    const [updatingActors, setUpdatingActors] = useState(false);
    const [removingActors, setRemovingActors] = useState(false);
    const [
        instanceIds,
        attatchInstance,
        detatchInstance
    ] = useInstanceIdsForImage(props.id);
    const [actorIds, attatchActor, detatchActor] = useActorIdsForImage(
        props.id
    );
    function deleteImage(e) {
        props.deleteImage(props.id);
    }
    async function onUpdateInstances(ids: number[]) {
        for (let x = 0; x < instanceIds.length; x++) {
            let id = instanceIds[x];
            if (ids.indexOf(id) === -1) await detatchInstance(id);
        }
        for (let x = 0; x < ids.length; x++) {
            let id = ids[x];
            await attatchInstance(id);
        }
        setUpdatingInstances(false);
    }
    async function onUpdateActors(ids: number[]) {
        for (let x = 0; x < actorIds.length; x++) {
            let id = actorIds[x];
            if (ids.indexOf(id) === -1) await detatchActor(id);
        }
        for (let x = 0; x < ids.length; x++) {
            let id = ids[x];
            await attatchActor(id);
        }
        setUpdatingActors(false);
    }

    const renderInstances = () => {
        return (
            <div>
                <div className={classes.participantsControls}>
                    <Button
                        variant="contained"
                        color="secondary"
                        button="true"
                        onClick={e => setUpdatingInstances(true)}
                        className={classes.addParticipantButton}>
                        <Extension />
                        Update Instances
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        button="secondary"
                        onClick={e => setRemovingInstances(!removingInstances)}
                        className={classes.removeFromParticipantStart}>
                        <Extension />
                        {removingInstances
                            ? "...cancel"
                            : "Remove from Instances"}
                    </Button>
                </div>
                <Paper>
                    <List
                        subheader={
                            <ListSubheader component="div">
                                Instances
                            </ListSubheader>
                        }>
                        {(instanceIds || []).map(v => (
                            <OnInstanceEntry
                                key={v}
                                id={v}
                                detatchInstance={detatchInstance}
                                removingInstances={removingInstances}
                            />
                        ))}
                    </List>
                </Paper>
            </div>
        );
    };
    const renderActors = () => {
        return (
            <div>
                <div className={classes.participantsControls}>
                    <Button
                        variant="contained"
                        color="secondary"
                        button="true"
                        onClick={e => setUpdatingActors(true)}
                        className={classes.addParticipantButton}>
                        <Extension />
                        Update Actors
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        button="secondary"
                        onClick={e => setRemovingActors(!removingActors)}
                        className={classes.removeFromParticipantStart}>
                        <Extension />
                        {removingActors ? "...cancel" : "Remove from Instances"}
                    </Button>
                </div>
                <Paper>
                    <List
                        subheader={
                            <ListSubheader component="div">
                                Actors
                            </ListSubheader>
                        }>
                        {(actorIds || []).map(v => (
                            <OnActorEntry
                                key={v}
                                id={v}
                                detatchActor={detatchActor}
                                removingActors={removingActors}
                            />
                        ))}
                    </List>
                </Paper>
            </div>
        );
    };
    return (
        <CardContent>
            <Divider />
            <div className={classes.cardContent}>
                <div>
                    <div className={classes.deleteContainer}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={e =>
                                confirmDelete
                                    ? deleteImage(e)
                                    : setConfirmDelete(true)
                            }
                            button="true"
                            className={classes.deleteImageButton}>
                            <Delete />
                            {confirmDelete
                                ? "...again to confirm"
                                : "Delete Image"}
                        </Button>
                    </div>
                    {renderInstances()}
                    {renderActors()}
                </div>
            </div>
            <Drawer
                anchor="top"
                open={updatingInstances}
                onClose={e => setUpdatingInstances(false)}>
                <PageInstanceAttach
                    onDone={onUpdateInstances}
                    selected={instanceIds}
                />
            </Drawer>
            <Drawer
                anchor="top"
                open={updatingActors}
                onClose={e => setUpdatingActors(false)}>
                <PageActorAdd onDone={onUpdateActors} selected={actorIds} />
            </Drawer>
        </CardContent>
    );
};

export default ImageContent;
