import * as React from "react";
import { useState, useEffect } from "react";
import Layout from "../Layout";
import Add from "@material-ui/icons/Add";
import { File } from "../services/ServiceImage";
import {
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    Dialog,
    TextField,
    Button,
    IconButton,
    Typography
} from "@material-ui/core";
import { makeStyles, useTheme, createStyles } from "@material-ui/core/styles";
import { useImageIds } from "../util/hooks";
import { RouterContextView } from "../util/routerContext";
import Images from "./Images";
import Image from "./Image";
import Uploader from "../components/Uploader";

const useStyles = makeStyles(theme => {
    return createStyles({
        or: {
            textAlign: "center",
            margin: theme.spacing(3)
        }
    });
});

function PageInstances(props) {
    const [imageIds, createImage, deleteImage] = useImageIds();
    const [openNewImageDialog, setOpenNewImageDialog] = useState(false);
    const [newImageName, setNewImageName] = useState("");
    const classes = useStyles();

    const onAdd = e => {
        setNewImageName("");
        setOpenNewImageDialog(true);
    };
    const onNewImageName = e => {
        e.preventDefault();
        if (!newImageName) return;
        createImage(newImageName);
        setNewImageName("");
        setOpenNewImageDialog(false);
    };
    const onImgSelected = (f: File) => {
        createImage(+new Date() + "", f);
        setOpenNewImageDialog(false);
    };
    if (!imageIds) return null;

    return (
        <RouterContextView.Provider value={props}>
            <Layout
                title="Image Respository"
                control={
                    <>
                        <IconButton onClick={onAdd} color="inherit">
                            <Add />
                        </IconButton>
                    </>
                }>
                <Images sort="name">
                    {imageIds.map(v => (
                        <Image key={v} id={v} deleteImage={deleteImage} />
                    ))}
                </Images>
                <Dialog
                    open={openNewImageDialog}
                    onClose={e => setOpenNewImageDialog(false)}
                    aria-labelledby="form-dialog-title">
                    <DialogContent>
                        <DialogContentText>
                            Upload images. You will be able to set image names
                            afterwards.
                        </DialogContentText>

                        <Uploader multiple onSelected={onImgSelected} />
                        <Typography className={classes.or} variant="h4">
                            -or-
                        </Typography>
                        <DialogContentText>
                            Create an image. You will be able to upload a file
                            afterwards.
                        </DialogContentText>
                        <form onSubmit={onNewImageName}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Image Name"
                                fullWidth
                                onChange={e => setNewImageName(e.target.value)}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onNewImageName} color="primary">
                            Submit
                        </Button>
                        <Button
                            onClick={e => setOpenNewImageDialog(false)}
                            color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Layout>
        </RouterContextView.Provider>
    );
}

export default PageInstances;
