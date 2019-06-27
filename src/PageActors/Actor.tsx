import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import Extension from "@material-ui/icons/Extension";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import blue from "@material-ui/core/colors/blue";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Delete from "@material-ui/icons/Delete";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import FaceIcon from "@material-ui/icons/Face";

import { Link } from "react-router-dom";
import {
    Divider,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
    ListItemSecondaryAction,
    Paper,
    Button,
    Chip,
    Collapse,
    Drawer,
    Checkbox
} from "@material-ui/core";

import { ModelActor } from "../models/ModelActor";
import {
    useInstance,
    useActor,
    useInstanceIdsForActor,
    useImage
} from "../util/hooks";

import PageImagesAdd from "../PageImages/PageImagesAdd";
import Actions from "./Actions";
import PageInstancesAdd from "../PageInstances/PageInstancesAdd";

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
        imageContainer: {
            display: "flex",
            flexWrap: "nowrap",
            width: "90vw",
            overflow: "auto"
        },
        avatarName: {
            textTransform: "none",
            padding: 0,
            background: 0,
            minWidth: "auto"
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

type ActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
    classes?: { card: string };
    setSortActor?: (a: ModelActor) => void;
    setSelected?: (f: boolean) => void;
    deleteActor?: (i: number) => void;
    selected?: boolean;
    discover?: number;
};

function Actor(props: ActorProps) {
    const classes = useStyles(props);
    const [actor, updateActor] = useActor(props.id);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [attachInstances, setAttachInstances] = useState(false);
    const [deleteInstances, setDeleteInstances] = useState(false);
    const [attachImages, setAttachImages] = useState(false);
    const [deleteImages, setDeleteImages] = useState(false);
    const [
        instanceIds,
        attatchInstance,
        detatchInstance
    ] = useInstanceIdsForActor(props.id);

    const [expanded, setExpanded] = useState(false);
    const [openAction, setOpenAction] = useState(false);
    const elmRef = useDiscover(props.discover, props.id, setExpanded);

    useEffect(() => {
        if (!actor) return;
        props.setSortActor(actor);
    }, [actor]);
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
    function deleteActor(e) {
        console.log(props.id);
        props.deleteActor(props.id);
    }
    function removeInstance(instanceId: number) {
        detatchInstance(instanceId);
    }
    function removeImage(imageId: number) {
        actor.images = (actor.images || []).filter(v => v !== imageId);
        if (!actor.images.length) delete actor.images;
        updateActor({ ...actor });
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
    async function onAttachImages(ids: number[]) {
        actor.images = ids;
        if (!actor.images.length) delete actor.images;
        updateActor({ ...actor });
        setAttachImages(false);
    }

    if (!actor) return null;
    const c = [];
    for (let i in actor.class) c.push(`${i} lvl ${actor.class[i]}`);

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
                                        {actor.name[0]}
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
                                        actor.hp
                                            ? `${actor.hpCurrent}/${actor.hp}`
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
                            <Button
                                className={classes.avatarName}
                                onClick={openActionPanel}>
                                {actor.name}
                            </Button>
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
                                                    ? deleteActor(e)
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
                                </div>
                                <div>
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
                                                setDeleteInstances(
                                                    !deleteInstances
                                                )
                                            }
                                            className={
                                                classes.removeFromInstanceStart
                                            }>
                                            <Extension />
                                            {deleteInstances
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
                                                <InstanceEntry
                                                    key={v}
                                                    id={v}
                                                    removeInstance={
                                                        removeInstance
                                                    }
                                                    deleteInstances={
                                                        deleteInstances
                                                    }
                                                />
                                            ))}
                                        </List>
                                    </Paper>
                                </div>
                                <div>
                                    <div className={classes.instancesControls}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            button="true"
                                            onClick={e => setAttachImages(true)}
                                            className={
                                                classes.addInstanceButton
                                            }>
                                            <Extension />
                                            Update Images
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
                                                : "Remove Images"}
                                        </Button>
                                    </div>
                                    <Paper>
                                        <List
                                            subheader={
                                                <ListSubheader component="div">
                                                    Images
                                                </ListSubheader>
                                            }>
                                            <div
                                                className={
                                                    classes.imageContainer
                                                }>
                                                {(actor.images || []).map(v => (
                                                    <ImageEntry
                                                        key={v}
                                                        id={v}
                                                        removeImage={
                                                            removeImage
                                                        }
                                                        deleteImages={
                                                            deleteImages
                                                        }
                                                    />
                                                ))}
                                            </div>
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
                        <Actions
                            updateActor={updateActor}
                            setOpenAction={setOpenAction}
                            {...actor}
                        />
                    </div>
                </Drawer>
                <Drawer
                    anchor="top"
                    open={attachInstances}
                    onClose={e => setAttachInstances(false)}>
                    <PageInstancesAdd
                        onDone={onAttachInstances}
                        selected={instanceIds}
                    />
                </Drawer>
                <Drawer
                    anchor="top"
                    open={attachImages}
                    onClose={e => setAttachImages(false)}>
                    <PageImagesAdd
                        onDone={onAttachImages}
                        selected={actor.images || []}
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

const useImageEntryPropsStyles = makeStyles(theme => {
    return createStyles({
        entry: {
            padding: theme.spacing(1 / 2),
            position: "relative",
            "& img": {
                height: "200px"
            }
        },
        removeButton: {
            position: "absolute",
            top: 10,
            right: 22,
            background: red[600],
            color: "white"
        }
    });
});
interface ImageEntryProps {
    id: number;
    removeImage: (a: number) => void;
    deleteImages: boolean;
}
const ImageEntry = (props: ImageEntryProps) => {
    const classes = useImageEntryPropsStyles();
    const [image, , , url] = useImage(props.id);
    if (!image) return null;
    if (!url) return null;
    return (
        <div className={classes.entry}>
            {props.deleteImages ? (
                <IconButton
                    onClick={e => props.removeImage(props.id)}
                    className={classes.removeButton}
                    edge="end"
                    aria-label="Comments">
                    <RemoveCircle />
                </IconButton>
            ) : null}

            <img src={url} alt="" />
        </div>
    );
};

export default Actor;
