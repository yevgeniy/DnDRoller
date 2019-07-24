import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Link } from "react-router-dom";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import purple from "@material-ui/core/colors/purple";
import blue from "@material-ui/core/colors/blue";
import Photo from "@material-ui/icons/Photo";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import Delete from "@material-ui/icons/Delete";
import AccessTime from "@material-ui/icons/AccessTime";
import DirectionsRun from "@material-ui/icons/DirectionsRun";
import {
    Button,
    Fab,
    Divider,
    IconButton,
    Avatar,
    CardContent,
    Card,
    Chip,
    Checkbox,
    Collapse,
    Drawer
} from "@material-ui/core";
import { CardHeader } from "../components";

import moment from "moment";
import Actions from "./Actions";

import { useActor, useInstance, useImage, useHot } from "../util/hooks";

import PageImagesAdd from "../PageImages/PageImagesAdd";
import PageActorsAdd from "../PageActors/PageActorsAdd";
import { ModelInstance } from "../models/ModelInstance";
import { RouterContextView } from "../util/routerContext";

import {
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
    ListItemSecondaryAction,
    Paper
} from "@material-ui/core";

const useStyles = makeStyles(theme =>
    createStyles({
        card: {},
        deleteButton: {
            "& svg": {
                transition: "all ease 200ms",
                color: purple[600]
            }
        },
        deleteButtonActive: {
            "& svg": {
                transform: "scale(2)"
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
        actorAvatar: {
            backgroundColor: blue[500]
        },
        removeActor: {
            "& svg": {
                color: red[600]
            }
        },
        instanceControls: {
            padding: theme.spacing(1)
        },
        cardContent: {
            marginTop: theme.spacing(1),
            display: "flex",
            flexWrap: "wrap",
            "& > *": {
                flex: 1,
                [theme.breakpoints.down("xs")]: {
                    flexBasis: "100%",
                    flexShrink: 0,
                    marginTop: theme.spacing(1)
                }
            }
        },
        deleteContainer: {
            display: "flex",
            justifyContent: "flex-end"
        },
        catorControls: {
            display: "flex"
        },
        chip: {
            color: orange[600],
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
        addActorButton: {
            background: green[600],
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        },
        deleteActorStart: {
            background: red[600],
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        },
        imageContainer: {
            display: "flex",
            flexWrap: "nowrap",
            width: "90vw",
            overflow: "auto"
        },
        deleteInstanceButton: {
            background: orange[600],
            marginLeft: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        }
    })
);

type InstanceProps = { [P in keyof ModelInstance]?: ModelInstance[P] } & {
    classes?: { card: string };
    setSortInstance?: (a: ModelInstance) => void;
    deleteInstance?: (i: number) => void;
    setSelected?: (f: boolean) => void;
    selected?: boolean;
};

function Instance(props: InstanceProps) {
    const classes = useStyles(props);
    const [instance, updateInstance] = useInstance(props.id);
    const [deleteActors, setDeleteActors] = useState(false);

    const [openAction, setOpenAction] = useState(false);
    const { expanded, setExpanded } = useRouterMemories(props.id);
    const [selectActors, setSelectActors] = useState(false);
    const [attachImages, setAttachImages] = useState(false);
    const [deleteImages, setDeleteImages] = useState(false);
    const { hot: hotDelete, setHot: setHotDelete } = useHot();

    useEffect(() => {
        if (!instance) return;
        props.setSortInstance(instance);
    }, [instance]);

    const removeImage = (imageId: number) => {
        instance.images = (instance.images || []).filter(v => v !== imageId);
        if (!instance.images.length) delete instance.images;
        updateInstance({ ...instance });
    };
    const handleExpandClick = e => {
        e.stopPropagation();
        setExpanded(!expanded);
    };
    const openActionPanel = e => {
        e.stopPropagation();
        setOpenAction(true);
    };
    const removeActor = id => {
        if (!instance) return;
        updateInstance({ actors: instance.actors.filter(v => v !== id) });
    };
    const deleteInstance = (e = null) => {
        if (!instance) return;
        props.deleteInstance(props.id);
    };
    const onAddActors = a => {
        updateInstance({ actors: [...a] });
        setSelectActors(false);
    };
    const onAttachImages = async (ids: number[]) => {
        instance.images = ids;
        if (!instance.images.length) delete instance.images;
        updateInstance({ ...instance });
        setAttachImages(false);
    };
    const deleteAct = () => {
        if (hotDelete) deleteInstance();
        else setHotDelete(true);
    };

    if (!instance) return null;

    return (
        <>
            <Card className={classes.card}>
                <CardHeader
                    contextMenu={
                        <>
                            <div>
                                <Fab
                                    className={clsx(classes.deleteButton, {
                                        [classes.deleteButtonActive]: hotDelete
                                    })}
                                    onClick={deleteAct}
                                    variant="extended"
                                    color="default"
                                    size="small"
                                    type="submit">
                                    <Delete />
                                </Fab>
                            </div>
                        </>
                    }
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
                                    {instance.name[0]}
                                </Avatar>
                            )}
                        </>
                    }
                    action={
                        <>
                            <Chip
                                icon={<AccessTime />}
                                label={moment()
                                    .subtract(
                                        +new Date() - instance.created,
                                        "ms"
                                    )
                                    .calendar()}
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
                    title={instance.name}
                />
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Divider />
                        <div className={classes.cardContent}>
                            <div>
                                <div className={classes.catorControls}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        button="true"
                                        onClick={e => setSelectActors(true)}
                                        className={classes.addActorButton}>
                                        <DirectionsRun />
                                        Update Actors
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        button="secondary"
                                        onClick={e =>
                                            setDeleteActors(!deleteActors)
                                        }
                                        className={classes.deleteActorStart}>
                                        <DirectionsRun />
                                        {deleteActors
                                            ? "...cancel"
                                            : "Delete Actors"}
                                    </Button>
                                </div>
                                <Paper>
                                    <List
                                        subheader={
                                            <ListSubheader component="div">
                                                Actors
                                            </ListSubheader>
                                        }>
                                        {instance.actors.map(v => (
                                            <ActorEntry
                                                key={v}
                                                id={v}
                                                removeActor={removeActor}
                                                deleteActors={deleteActors}
                                            />
                                        ))}
                                    </List>
                                </Paper>
                            </div>
                            <div>
                                <div className={classes.catorControls}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        button="true"
                                        onClick={e => setAttachImages(true)}
                                        className={classes.addActorButton}>
                                        <Photo />
                                        Update Images
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        button="secondary"
                                        onClick={e =>
                                            setDeleteImages(!deleteImages)
                                        }
                                        className={classes.deleteActorStart}>
                                        <Photo />
                                        {deleteImages
                                            ? "...cancel"
                                            : "Delete Images"}
                                    </Button>
                                </div>
                                <Paper>
                                    <List
                                        subheader={
                                            <ListSubheader component="div">
                                                Images
                                            </ListSubheader>
                                        }>
                                        <div className={classes.imageContainer}>
                                            {(instance.images || []).map(v => (
                                                <ImageEntry
                                                    key={v}
                                                    id={v}
                                                    removeImage={removeImage}
                                                    deleteImages={deleteImages}
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
                        updateInstance={updateInstance}
                        setOpenAction={setOpenAction}
                        {...instance}
                    />
                </div>
            </Drawer>
            <Drawer
                anchor="top"
                open={selectActors}
                onClose={e => setSelectActors(false)}>
                <PageActorsAdd
                    onDone={onAddActors}
                    selected={instance.actors}
                />
            </Drawer>
            <Drawer
                anchor="top"
                open={attachImages}
                onClose={e => setAttachImages(false)}>
                <PageImagesAdd
                    onDone={onAttachImages}
                    selected={instance.images || []}
                />
            </Drawer>
        </>
    );
}

interface ActorEntryProps {
    id: number;
    removeActor: (a: number) => void;
    deleteActors: boolean;
}
const ActorEntry = (props: ActorEntryProps) => {
    const classes = useStyles();
    const [actor] = useActor(props.id);

    if (!actor) return null;

    let c = [];
    for (let i in actor.class) {
        c.push(`${i} lvl: ${actor.class[i]}`);
    }

    return (
        <ListItem
            button
            component={Link}
            to={{
                pathname: "/actors",
                state: {
                    discover: props.id
                }
            }}>
            <ListItemAvatar>
                <Avatar className={clsx(classes.avatar, classes.actorAvatar)}>
                    {actor.name[0]}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={actor.name}
                secondary={<>{c.join(", ")}</>}
            />
            {props.deleteActors ? (
                <ListItemSecondaryAction>
                    <IconButton
                        onClick={e => props.removeActor(props.id)}
                        className={classes.removeActor}
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

function useRouterMemories(id: number) {
    const router = useContext(RouterContextView);
    router.location.state = router.location.state || {};
    router.location.state.menuOpen = router.location.state.menuOpen || {};

    const [expanded, setExpanded] = useState(
        router.location.state.menuOpen[id]
    );

    useEffect(() => {
        router.history.replace(router.location.pathname, {
            ...(router.location.state || {}),
            menuOpen: { ...router.location.state.menuOpen, [id]: expanded }
        });
    }, [expanded]);

    return {
        expanded,
        setExpanded
    };
}

export default Instance;
