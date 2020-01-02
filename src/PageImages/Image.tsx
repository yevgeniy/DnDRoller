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
import { CardHeader, ContextMenu } from "../components";

import { ModelImage } from "../models/ModelImage";
import { useImage, useDiscover, useHot, useHistoryState } from "../util/hooks";
import Actions from "./Actions";
import ImageContent from "./ImageContent";

const useStyles = makeStyles(theme =>
  createStyles({
    card: {},
    deleteButton: {
      background: "white",
      "& svg": {
        transition: "all ease 200ms",
        transform: "scale(2)",
        color: purple[600]
      }
    },
    deleteButtonActive: {
      "& svg": {
        transform: "scale(1)"
      }
    },
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

const Image = React.memo((props: ImageProps) => {
  const classes = useStyles(props);
  const { image, updateImage, upload, url } = useImage(props.id);
  const [addInstances, setAddInstances] = useState(false);
  const [openAction, setOpenAction] = useState(false);

  const { isExpanded, setIsExpanded } = useRouterMemories(props.id);

  const elmRef = useDiscover(props.discover === props.id, () =>
    setIsExpanded(true)
  );
  const { hot: hotDelete, setHot: setHotDelete } = useHot();
  const cmcloser = useRef(function() {});

  useEffect(() => {
    if (!image) return;
    props.setSortImage(image);
  }, [image]);

  function handleExpandClick(e) {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }
  function openActionPanel(e) {
    e.stopPropagation();
    setOpenAction(true);
  }
  const deleteAct = () => {
    if (hotDelete) {
      props.deleteImage(props.id);
      cmcloser.current();
    } else setHotDelete(true);
  };

  if (!image) return null;

  const renderView = () => {
    return (
      <>
        <Card className={classes.card} ref={elmRef}>
          <CardHeader
            contextmenu={
              <ContextMenu
                onOpen={c => {
                  cmcloser.current = c;
                }}
              >
                <Fab
                  className={clsx(classes.deleteButton, {
                    [classes.deleteButtonActive]: hotDelete
                  })}
                  onClick={deleteAct}
                  variant="extended"
                  color="default"
                  size="small"
                  type="submit"
                >
                  <Delete />
                </Fab>
              </ContextMenu>
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
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                    {image.name[0]}
                  </Avatar>
                )}
              </>
            }
            action={
              <>
                <Typography className={classes.fileName} variant="caption">
                  {image.file}
                </Typography>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: isExpanded
                  })}
                  onClick={handleExpandClick}
                  aria-expanded={isExpanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </>
            }
            title={
              <Button className={classes.avatarName} onClick={openActionPanel}>
                {image.name}
              </Button>
            }
            subheader={(image.keywords || []).sort().join(", ")}
          />
          {url ? (
            <CardMedia
              className={classes.media}
              component={Link}
              to={{ pathname: "/image", state: { imageId: image.id } }}
              image={url}
              title={image.name}
            />
          ) : null}

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <ImageContent deleteImage={props.deleteImage} {...image} />
          </Collapse>
        </Card>
        <Drawer
          open={openAction}
          anchor="right"
          onClose={() => setOpenAction(false)}
        >
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
          onClose={e => setAddInstances(false)}
        />
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
