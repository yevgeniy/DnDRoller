import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Delete from "@material-ui/icons/Delete";
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import blue from "@material-ui/core/colors/blue";
import purple from "@material-ui/core/colors/purple";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";

import {
  Fab,
  Typography,
  CardMedia,
  IconButton,
  Avatar,
  Card,
  Button,
  Collapse,
  Drawer,
  Checkbox
} from "@material-ui/core";
import {
  Chip,
  EntityActions,
  EntityContent,
  EntityHeaderActions,
  Entity,
  EntityTitle,
  EntitySubheader
} from "../components";

import { ModelImage } from "../models/ModelImage";
import {
  useImage,
  useDiscover,
  useHot,
  useHistoryState,
  useCommonHook
} from "../util/hooks";
import { useOpenStream } from "../util/sync";
import Actions from "./Actions";
import ImageContent from "./ImageContent";

const useStyles = makeStyles(theme =>
  createStyles({
    media: {
      height: 0,
      paddingTop: "25.25%",
      backgroundSize: "contain",
      backgroundColor: "gray"
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
    }
  })
);

const useStylesButtonLabel = makeStyles(
  theme =>
    createStyles({
      label: {
        textAlign: "left"
      }
    }),
  { name: "Image-Button-Label" }
);

type ImageProps = { [P in keyof ModelImage]?: ModelImage[P] } & {
  classes?: any;
  setSortImage?: (a: ModelImage) => void;
  setSelected?: (f: boolean) => void;
  deleteImage?: (i: number) => void;
  selected?: boolean;
  discover?: number;
};

const Image = React.memo((props: ImageProps) => {
  const classes = useStyles({});
  const buttonLabelClasses = useStylesButtonLabel({});
  const [image, updateImage, upload, url] = useCommonHook(
    useImage,
    props.id
  ) || [null, null, null, null];

  useEffect(() => {
    if (!image) return;
    props.setSortImage(image);
  }, [image]);

  const [showThumbOnImages] = useOpenStream("showThumbOnImages");

  if (!image) return null;

  const doDelete = () => {
    props.deleteImage(props.id);
  };

  const renderView = () => {
    return (
      <>
        <Entity
          id={props.id}
          deleteEntity={doDelete}
          discover={props.discover}
          isSelected={props.selected}
          setSelected={props.setSelected}
          subheader={(image.keywords || []).sort().join(", ")}
          updateEntity={updateImage}
        >
          <Avatar className={classes.avatar}>
            <Link to={{ pathname: "/image", state: { imageId: image.id } }}>
              {image.type === "image" && url ? (
                <img
                  src={url}
                  style={{ maxWidth: "30px", maxHeight: "30px" }}
                />
              ) : (
                image.name[0]
              )}
            </Link>
          </Avatar>

          <EntityTitle>
            <Button classes={buttonLabelClasses}>{image.name}</Button>
          </EntityTitle>

          <EntitySubheader show={showThumbOnImages}>
            {url ? (
              <CardMedia
                className={classes.media}
                component={Link}
                to={{ pathname: "/image", state: { imageId: image.id } }}
                image={url}
                title={image.name}
              />
            ) : null}
          </EntitySubheader>

          <EntityContent>
            <ImageContent {...image} />
          </EntityContent>
          <EntityActions>
            <Actions {...image} />
          </EntityActions>
        </Entity>
      </>
    );
  };

  return renderView();
});

function useRouterMemories(id: number) {
  const { state, updateState } = useHistoryState(`image-${id}`, {
    isExpanded: false
  });

  return {
    ...state,
    setIsExpanded: f => updateState({ isExpanded: f })
  };
}

export default Image;
