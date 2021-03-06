import * as React from "react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { Layout, LayoutControl, LayoutMenu } from "../components";
import Add from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { File } from "../services/ServiceImage";
import orange from "@material-ui/core/colors/orange";

import {
  Drawer,
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
import {
  useImageIds,
  useModalState,
  usePageImagesHistory
} from "../util/hooks";
import Images from "./Images";
import Image from "./Image";
import Menu from "./Menu";
import Search from "./Search";
import Uploader from "../components/Uploader";

import { ModelRoutedPage } from "../models/ModelRoutedPage";
import { ModelImage } from "../models/ModelImage";

const useStyles = makeStyles(theme => {
  return createStyles({
    or: {
      textAlign: "center",
      margin: theme.spacing(3)
    },
    hasFilter: {
      color: orange[600]
    }
  });
});

interface PageImagesLocationState {
  discover?: number;
  image?: ModelImage;
}

const PageInstances = React.memo(
  (props: ModelRoutedPage<PageImagesLocationState>) => {
    let [
      { currentKeyWords },
      { update: updatePageImages }
    ] = usePageImagesHistory();

    const state = props.history.location.state || {};

    const effectiveKeyWords = Array.from(
      new Set([
        ...currentKeyWords,
        ...(state.image ? state.image.keywords || [] : [])
      ])
    );
    let [imageIds, createImage, deleteImage, possibleKeyWords] = useImageIds(
      effectiveKeyWords.length ? effectiveKeyWords : null
    );
    state.image && (imageIds = imageIds.filter(v => v !== state.image.id));

    const [openNewImageDialog, setOpenNewImageDialog] = useState(false);
    const [newImageName, setNewImageName] = useState("");
    const {
      isOpen: searchIsOpen,
      doOpen: searchDoOpen,
      doClose: searchDoClose
    } = useModalState();

    const classes = useStyles({});

    const onAdd = e => {
      setNewImageName("");
      setOpenNewImageDialog(true);
    };
    const onSearch = () => {
      searchDoOpen();
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
      <Layout
        historyId={props.history.location.key}
        title={state.image ? state.image.name : "Image Respository"}
      >
        <LayoutControl>
          <IconButton onClick={onSearch} color="inherit">
            <SearchIcon
              className={clsx({
                [classes.hasFilter]: currentKeyWords.length
              })}
            />
          </IconButton>

          <IconButton onClick={onAdd} color="inherit">
            <Add />
          </IconButton>
        </LayoutControl>
        <LayoutMenu>
          <Menu />
        </LayoutMenu>
        <Images sort="name" ids={imageIds}>
          {v => <Image deleteImage={deleteImage} {...v} />}
        </Images>
        <Dialog
          open={openNewImageDialog}
          onClose={e => setOpenNewImageDialog(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Upload images. You will be able to set image names afterwards.
            </DialogContentText>

            <Uploader multiple onSelected={onImgSelected} />
            <Typography className={classes.or} variant="h4">
              -or-
            </Typography>
            <DialogContentText>
              Create an image. You will be able to upload a file afterwards.
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
            <Button onClick={e => setOpenNewImageDialog(false)} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Drawer open={searchIsOpen} onClose={searchDoClose} anchor="top">
          <Search
            onUpdate={v => updatePageImages({ currentKeyWords: v })}
            currentKeyWords={effectiveKeyWords}
            immutable={state.image ? state.image.keywords || [] : []}
            possibleKeywords={possibleKeyWords}
          />
        </Drawer>
      </Layout>
    );
  }
);

export default PageInstances;
