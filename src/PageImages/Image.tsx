import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Extension from "@material-ui/icons/Extension";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import blue from "@material-ui/core/colors/blue";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Delete from "@material-ui/icons/Delete";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import moment from "moment";

import { Link } from "react-router-dom";
import {
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

import FaceIcon from "@material-ui/icons/Face";

import { ModelImage } from "../models/ModelImage";
import {
    useInstance,
    useActor,
    useInstanceIdsForImage,
    useActorIdsForImage,
    useImage
} from "../util/hooks";

const useStyles = makeStyles(theme =>
    createStyles({
        card: {},
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
        addInstanceButton: {
            background: green[600],
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        },
        removeFromInstanceStart: {
            background: red[600],
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        },
        deleteActorButton: {
            background: orange[600],
            marginLeft: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        },
        expand: {
            transform: "rotate(0deg)",
            marginLeft: "auto",
            transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest
            }),
            [theme.breakpoints.down("xs")]: {
                padding: theme.spacing(2)
            }
        },
        expandOpen: {
            transform: "rotate(180deg)"
        },
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
        content: {
            marginTop: theme.spacing(1)
        },
        chip: {
            color: red[600],
            borderColor: orange[600],
            margin: theme.spacing(1),
            minWidth: 70,
            justifyContent: "flex-start",
            [theme.breakpoints.down("xs")]: {
                minWidth: "auto",
                margin: theme.spacing(1 / 2)
            }
        },
        margin: {
            margin: theme.spacing(1)
        },
        extendedIcon: {
            marginRight: theme.spacing(1)
        },
        deleteContainer: {
            display: "flex",
            justifyContent: "flex-end"
        },
        instancesControls: {
            display: "flex",
            justifyContent: "flex-start",
            marginTop: theme.spacing(1)
        }
    })
);

type ImageProps = { [P in keyof ModelImage]?: ModelImage[P] } & {
    classes?: { card: string };
    setSortImage?: (a: ModelImage) => void;
    setSelected?: (f: boolean) => void;
    deleteImage: (i: number) => void;
    selected?: boolean;
    discover?: number;
};

function Image(props: ImageProps) {
    const classes = useStyles(props);
    const [image, updateImage] = useImage(props.id);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [attachInstances, setAttachInstances] = useState(false);
    const [attachActors, setAttachActors] = useState(false);
    const [deleteImages, setDeleteImages] = useState(false);
    const [
        instanceIds,
        attatchInstance,
        detatchInstance
    ] = useInstanceIdsForImage(props.id);
    const [actorIds, attatchActor, detatchActor] = useActorIdsForImage(
        props.id
    );

    const [expanded, setExpanded] = useState(false);
    const [openAction, setOpenAction] = useState(false);
    const elmRef = useDiscover(props.discover, props.id, setExpanded);

    useEffect(() => {
        if (!image) return;
        props.setSortImage(image);
    }, [image]);
    useEffect(() => {
        if (!confirmDelete) return;
        setTimeout(() => setConfirmDelete(false), 1500);
    }, [confirmDelete]);

    function handleExpandClick(e) {
        e.stopPropagation();
        setExpanded(!expanded);
    }
    function openActionPanel(e) {
        e.stopPropagation();
        setOpenAction(true);
    }
    function deleteImage(e) {
        console.log(props.id);
        props.deleteImage(props.id);
    }
    function removeInstance(instanceId: number) {
        detatchInstance(instanceId);
    }
    function removeActor(actorId: number) {
        detatchActor(actorId);
    }

    async function onAttachInstances(ids: number[]) {
        for (let x = 0; x < instanceIds.length; x++) {
            let id = instanceIds[x];
            if (ids.indexOf(id) === -1) await detatchInstance(id);
        }
        for (let x = 0; x < ids.length; x++) {
            let id = ids[x];
            await attatchInstance(id);
        }
        setAttachInstances(false);
    }
    async function onAttachActors(ids: number[]) {
        for (let x = 0; x < actorIds.length; x++) {
            let id = actorIds[x];
            if (ids.indexOf(id) === -1) await detatchActor(id);
        }
        for (let x = 0; x < ids.length; x++) {
            let id = ids[x];
            await attatchActor(id);
        }
        setAttachActors(false);
    }

    if (!image) return null;

    const renderView = () => {
        return (
            <>
                <Card className={classes.card} ref={elmRef}>
                    <CardHeader
                        onClick={e =>
                            props.setSelected
                                ? props.setSelected(!props.selected)
                                : openActionPanel(e)
                        }
                        avatar={
                            <>
                                {props.setSelected ? (
                                    <Checkbox
                                        checked={props.selected}
                                        inputProps={{
                                            "aria-label": "primary checkbox"
                                        }}
                                    />
                                ) : (
                                    <Avatar
                                        aria-label="Recipe"
                                        className={classes.avatar}>
                                        {image.name[0]}
                                    </Avatar>
                                )}
                            </>
                        }
                        subheader={c.join(", ")}
                        action={
                            <>
                                <Chip
                                    icon={<FaceIcon />}
                                    label={
                                        image.hp
                                            ? `${image.hpCurrent}/${image.hp}`
                                            : "--"
                                    }
                                    className={classes.chip}
                                    color="secondary"
                                    variant="outlined"
                                />
                                <IconButton
                                    className={clsx(classes.expand, {
                                        [classes.expandOpen]: expanded
                                    })}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="Show more">
                                    <ExpandMoreIcon />
                                </IconButton>
                            </>
                        }
                        title={
                            <a type="link" href="#" onClick={openActionPanel}>
                                {image.name}
                            </a>
                        }
                    />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
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
                                            className={
                                                classes.deleteActorButton
                                            }>
                                            <Delete />
                                            {confirmDelete
                                                ? "...again to confirm"
                                                : "Delete Actor"}
                                        </Button>
                                    </div>
                                    <div className={classes.instancesControls}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            button="true"
                                            onClick={e =>
                                                setAttachInstances(true)
                                            }
                                            className={
                                                classes.addInstanceButton
                                            }>
                                            <Extension />
                                            Update Instances
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            button="secondary"
                                            onClick={e =>
                                                setDeleteImages(!deleteImages)
                                            }
                                            className={
                                                classes.removeFromInstanceStart
                                            }>
                                            <Extension />
                                            {deleteImages
                                                ? "...cancel"
                                                : "Remove from Instances"}
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Paper>
                                        <List
                                            subheader={
                                                <ListSubheader component="div">
                                                    Instances
                                                </ListSubheader>
                                            }>
                                            {(instanceIds || []).map(v => (
                                                <InstanceEntry
                                                    key={v}
                                                    id={v}
                                                    removeInstance={
                                                        removeInstance
                                                    }
                                                    deleteInstances={
                                                        deleteImages
                                                    }
                                                />
                                            ))}
                                        </List>
                                    </Paper>
                                </div>
                            </div>
                        </CardContent>
                    </Collapse>
                </Card>
                <Drawer
                    open={openAction}
                    anchor="right"
                    onClose={() => setOpenAction(false)}>
                    <div>
                        <PageActorActions
                            updateActor={updateImage}
                            setOpenAction={setOpenAction}
                            {...image}
                        />
                    </div>
                </Drawer>
                <Drawer
                    anchor="top"
                    open={attachInstances}
                    onClose={e => setAttachInstances(false)}>
                    <PageInstanceAttach
                        onDone={onAttachInstances}
                        selected={instanceIds}
                    />
                </Drawer>
            </>
        );
    };

    return renderView();
}

function useDiscover(
    discover: number,
    id: number,
    setExpanded: (f: boolean) => void
) {
    const ref = useRef();
    const [discovered, setDiscovered] = useState(false);

    useEffect(() => {
        if (discover !== id) return;
        setExpanded(true);
    }, []);
    useEffect(() => {
        if (discovered) return;
        if (discover !== id) return;
        if (!ref.current) return;
        //@ts-ignore
        ref.current.scrollIntoView();
        setDiscovered(true);
    });

    return ref;
}

interface ActorEntryProps {
    id: number;
    removeInstance: (a: number) => void;
    deleteInstances: boolean;
}
const InstanceEntry = (props: ActorEntryProps) => {
    const classes = useStyles();
    const [instance] = useInstance(props.id);

    if (!instance) return null;

    let c = [];

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
            {props.deleteInstances ? (
                <ListItemSecondaryAction>
                    <IconButton
                        onClick={e => props.removeInstance(props.id)}
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

export default Image;
