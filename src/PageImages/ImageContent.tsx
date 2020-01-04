import * as React from "react";
import { ModelImage } from "../models/ModelImage";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import Extension from "@material-ui/icons/Extension";
import DirectionsRun from "@material-ui/icons/DirectionsRun";
import Info from "@material-ui/icons/Info";
import Edit from "@material-ui/icons/Edit";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import Delete from "@material-ui/icons/Delete";
import {
  Tab,
  Tabs,
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
import { TabPanel } from "../components";
import PageInstancesAdd from "../PageInstances/PageInstancesAdd";
import PageActorsAdd from "../PageActors/PageActorsAdd";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  useInstanceIdsForImage,
  useActorIdsForImage,
  useHistoryState
} from "../util/hooks";
import OnInstanceEntry from "./OnInstanceEntry";
import OnActorEntry from "./OnActorEntry";
import {
  EntityContentTabInfo,
  EntityContentTabRelation,
  EntityContentTabImages,
  EntityContentTabs
} from "../components";

const useStyles = makeStyles(
  theme =>
    createStyles({
      root: {},

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
    }),
  { name: "ImageContent" }
);

type ImageContentProps = { [P in keyof ModelImage]: ModelImage[P] } & {
  className?: string;
};

const ImageContent = React.memo((props: ImageContentProps) => {
  const classes = useStyles({});

  const { className, ...image } = props;

  const { instanceIds, setInstances } = useInstanceIdsForImage(props.id);
  const { actorIds, setActors } = useActorIdsForImage(props.id);

  return (
    <EntityContentTabs
      className={clsx(classes.root, props.className)}
      id={image.id}
    >
      <EntityContentTabInfo label="Info" icon={<Info />}>
        Item One
      </EntityContentTabInfo>
      <EntityContentTabRelation
        label="Instances"
        icon={<Extension />}
        listSubheader="Instances"
        ids={instanceIds || []}
        update={setInstances}
        listComponent={OnInstanceEntry}
        updateComponent={PageInstancesAdd}
      />
      <EntityContentTabRelation
        label="Actors"
        icon={<DirectionsRun />}
        listSubheader="Actors"
        ids={actorIds || []}
        update={setActors}
        listComponent={OnActorEntry}
        updateComponent={PageActorsAdd}
      />
    </EntityContentTabs>
  );
});

export default ImageContent;
