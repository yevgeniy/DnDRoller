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
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useInstanceIdsForImage, useActorIdsForImage } from "../util/hooks";

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
    const [attachInstances, setAttachInstances] = useState(false);
    const [attachActors, setAttachActors] = useState(false);
    const [removeInstances, setRemoveInstances] = useState(false);
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
                    <div className={classes.participantsControls}>
                        <Button
                            variant="contained"
                            color="secondary"
                            button="true"
                            onClick={e => setAttachInstances(true)}
                            className={classes.addParticipantButton}>
                            <Extension />
                            Update Instances
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            button="secondary"
                            onClick={e => setRemoveInstances(!removeInstances)}
                            className={classes.removeFromParticipantStart}>
                            <Extension />
                            {removeInstances
                                ? "...cancel"
                                : "Remove from Instances"}
                        </Button>
                    </div>
                </div>
                <div>
                    <Paper>
                        {/* <List
                            subheader={
                                <ListSubheader component="div">
                                    On Instance
                                </ListSubheader>
                            }>
                            {(instanceIds || []).map(v => (
                                <OnInstanceEntry
                                    key={v}
                                    id={v}
                                    removeInstance={removeInstance}
                                    deleteInstances={removeInstances}
                                />
                            ))}
                        </List> */}
                    </Paper>
                </div>
            </div>
        </CardContent>
    );
};

export default ImageContent;
