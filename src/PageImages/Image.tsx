import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import blue from "@material-ui/core/colors/blue";
import purple from "@material-ui/core/colors/purple";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Link } from "react-router-dom";
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
import RemoveCircle from "@material-ui/icons/RemoveCircle";

import { ModelImage } from "../models/ModelImage";
import {
    useInstance,
    useActor,
    useInstanceIdsForImage,
    useActorIdsForImage,
    useImage,
    useDiscover
} from "../util/hooks";
import Actions from "./Actions";
import ImageContent from "./ImageContent";

const useStyles = makeStyles(theme =>
    createStyles({
        card: {},
        media: {
            height: 0,
            paddingTop: "25.25%",
            backgroundSize: "contain",
            backgroundColor: "gray"
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
            backgroundColor: purple[500],
            [theme.breakpoints.down("xs")]: {
                width: 30,
                height: 30
            }
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
        fileName: {
            marginRight: theme.spacing(2)
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
        }
    })
);

type ImageProps = { [P in keyof ModelImage]?: ModelImage[P] } & {
    classes?: { card: string };
    setSortImage?: (a: ModelImage) => void;
    setSelected?: (f: boolean) => void;
    deleteImage?: (i: number) => void;
    selected?: boolean;
    discover?: number;
};

function Image(props: ImageProps) {
    const classes = useStyles(props);
    const [image, updateImage, upload, url] = useImage(props.id);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [addInstances, setAddInstances] = useState(false);
    const [addActors, setAddActors] = useState(false);
    const [removeInstances, setRemoveInstances] = useState(false);

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

    if (!image) return null;

    console.log(image.name, url);
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
                        action={
                            <>
                                <Typography
                                    className={classes.fileName}
                                    variant="caption">
                                    {image.file}
                                </Typography>
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
                                {image.name}
                            </Button>
                        }
                        subheader={(image.keywords || []).sort().join(", ")}
                    />
                    {url ? (
                        <CardMedia
                            className={classes.media}
                            image={url}
                            title={image.name}
                        />
                    ) : null}

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <ImageContent
                            deleteImage={props.deleteImage}
                            {...image}
                        />
                    </Collapse>
                </Card>
                <Drawer
                    open={openAction}
                    anchor="right"
                    onClose={() => setOpenAction(false)}>
                    <Actions
                        updateImage={updateImage}
                        setOpenAction={setOpenAction}
                        upload={upload}
                        {...image}
                    />
                </Drawer>
                <Drawer
                    anchor="top"
                    open={addInstances}
                    onClose={e => setAddInstances(false)}>
                    {/* <AttachInstance onDone={onAttachInstances}
            selected={instanceIds} /> */}
                </Drawer>
            </>
        );
    };

    return renderView();
}

export default Image;
