import * as React from "react";
import { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CardHeader } from "../components";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FlashOn from "@material-ui/icons/FlashOn";
import Delete from "@material-ui/icons/Delete";

import { Divider, Paper, List, ListSubheader } from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";

import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";

import Drawer from "@material-ui/core/Drawer";

import Actions from "./Actions";
import { ModelActor } from "../models/ModelActor";
import { useService, useImage } from "../util/hooks";
import ServiceActor from "../services/ServiceActor";

const useActorStyles = makeStyles(theme =>
    createStyles({
        card: {},
        imageContainer: {
            display: "flex",
            flexWrap: "nowrap",
            width: "90vw",
            overflow: "auto"
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
        content: {
            marginTop: theme.spacing(1)
        },
        chip: {
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
        actorControls: {
            display: "flex",
            justifyContent: "space-between"
        },
        imagesContainer: {
            marginTop: theme.spacing(1)
        },
        removeButton: {
            background: orange[600],
            marginLeft: theme.spacing(1),
            "& svg": {
                marginRight: theme.spacing(1)
            }
        }
    })
);

type ActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
    classes?: { card: string };
    setSortActor?: (a: ModelActor) => void;
    resetActor?: number;
    removeActor?: (id: number) => void;
};

function Actor(props: ActorProps) {
    const classes = useActorStyles(props);
    const [actor, updateActor] = useActor(props.id, props.resetActor);
    const [confirmRemove, setConfirmRemove] = useState(false);
    useEffect(() => {
        if (!confirmRemove) return;
        setTimeout(() => setConfirmRemove(false), 1500);
    }, [confirmRemove]);

    useEffect(() => {
        if (!actor) return;
        props.setSortActor(actor);
    }, [actor]);

    const [expanded, setExpanded] = useState(false);
    const [openAction, setOpenAction] = useState(false);

    function removeActor(e) {
        props.removeActor(props.id);
    }
    function handleExpandClick(e) {
        e.stopPropagation();
        setExpanded(!expanded);
    }
    function openActionPanel(e) {
        e.stopPropagation();
        setOpenAction(true);
    }

    if (!actor) return null;

    const c = [];
    for (let i in actor.class) c.push(`${i}: ${actor.class[i]}`);

    return (
        <>
            <Card className={classes.card}>
                <CardHeader
                    onClick={openActionPanel}
                    avatar={
                        <Avatar aria-label="Recipe" className={classes.avatar}>
                            {actor.name[0]}
                        </Avatar>
                    }
                    action={
                        <>
                            {actor.initiative ? (
                                <Chip
                                    icon={<FlashOn />}
                                    label={actor.initiative}
                                    className={classes.chip}
                                    color="primary"
                                    variant="outlined"
                                />
                            ) : null}

                            <Chip
                                icon={<FaceIcon />}
                                label={`${actor.hpCurrent}/${actor.hp}`}
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
                    title={actor.name}
                    subheader={c.join(", ")}
                />
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Divider />
                        <div className={classes.content}>
                            <div className={classes.actorControls}>
                                <div>
                                    <Typography variant="h5">
                                        {actor.race}
                                    </Typography>
                                    <Typography variant="caption">
                                        {actor.size}
                                    </Typography>
                                </div>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={e =>
                                        confirmRemove
                                            ? removeActor(e)
                                            : setConfirmRemove(true)
                                    }
                                    button="true"
                                    className={classes.removeButton}>
                                    <Delete />
                                    {confirmRemove
                                        ? "...again to confirm"
                                        : "Remove from Instance"}
                                </Button>
                            </div>

                            {actor.images && actor.images.length && (
                                <div className={classes.imagesContainer}>
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
                                                    />
                                                ))}
                                            </div>
                                        </List>
                                    </Paper>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Collapse>
            </Card>
            <Drawer
                open={openAction}
                anchor="right"
                onClose={() => setOpenAction(false)}>
                <div>
                    <Actions {...{ updateActor, setOpenAction, ...actor }} />
                </div>
            </Drawer>
        </>
    );
}

const useImageEntryPropsStyles = makeStyles(theme => {
    return createStyles({
        entry: {
            padding: theme.spacing(1 / 2),
            position: "relative",
            "& img": {
                height: "200px"
            }
        }
    });
});
interface ImageEntryProps {
    id: number;
}
const ImageEntry = (props: ImageEntryProps) => {
    const classes = useImageEntryPropsStyles();
    const [image, , , url] = useImage(props.id);
    if (!image) return null;
    if (!url) return null;
    return (
        <div className={classes.entry}>
            <img src={url} alt="" />
        </div>
    );
};

function useActor(id: number, resetActorToken?: number) {
    const serviceActor = useService(ServiceActor);
    const [actor, setActor] = useState(null);

    useEffect(() => {
        if (!serviceActor) return;
        serviceActor.get(id).then(setActor);
    }, [serviceActor]);

    useEffect(() => {
        if (!resetActorToken) return;
        if (!actor) return;

        updateActor({ hp: actor.hpCurrent, initiative: null });
    }, [resetActorToken]);

    function updateActor(updateActor) {
        setActor({ ...actor, ...updateActor });
    }

    return [actor, updateActor];
}

export default Actor;
