import * as React from "react";
import { ModelImage } from "../models/ModelImage";
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
    tabControls: {
      display: "flex",
      justifyContent: "flex-start",
      background: theme.palette.grey[400]
    },
    tabControlButton: {
      "& svg": {
        margin: "0 0 0 8px"
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

const ImageContent = React.memo((props: ImageContentProps) => {
  const classes = useStyles();

  const [isAttachingInstances, setIsAttachingInstances] = useState(false);
  const [isAttachingActors, setIsAttachingActors] = useState(false);

  const { tab, setTab } = useRouterMemories(props.id);

  const [
    instanceIds,
    attatchInstance,
    detatchInstance
  ] = useInstanceIdsForImage(props.id);
  const [actorIds, attatchActor, detatchActor] = useActorIdsForImage(props.id);

  const onUpdateInstances = async (ids: number[]) => {
    for (let x = 0; x < instanceIds.length; x++) {
      let id = instanceIds[x];
      if (ids.indexOf(id) === -1) await detatchInstance(id);
    }
    for (let x = 0; x < ids.length; x++) {
      let id = ids[x];
      await attatchInstance(id);
    }
    setIsAttachingInstances(false);
  };
  const onUpdateActors = async (ids: number[]) => {
    for (let x = 0; x < actorIds.length; x++) {
      let id = actorIds[x];
      if (ids.indexOf(id) === -1) await detatchActor(id);
    }
    for (let x = 0; x < ids.length; x++) {
      let id = ids[x];
      await attatchActor(id);
    }
    setIsAttachingActors(false);
  };

  return (
    <CardContent>
      <Divider />
      <div className={classes.cardContent}>
        <Tabs
          onChange={(e, v) => setTab(v)}
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Info" icon={<Info />} />
          <Tab label="Instances" icon={<Extension />} />
          <Tab label="Actors" icon={<DirectionsRun />} />
        </Tabs>
        <TabPanel value={tab} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <div className={classes.tabControls}>
            <Button
              className={classes.tabControlButton}
              variant="contained"
              color="secondary"
              button="true"
              onClick={e => setIsAttachingInstances(true)}
            >
              Update
              <Edit />
            </Button>
          </div>
          <Paper>
            <List
              subheader={
                <ListSubheader component="div">Instances</ListSubheader>
              }
            >
              {(instanceIds || []).map(v => (
                <OnInstanceEntry
                  key={v}
                  id={v}
                  detatchInstance={detatchInstance}
                />
              ))}
            </List>
          </Paper>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <div className={classes.tabControls}>
            <Button
              variant="contained"
              color="secondary"
              button="true"
              onClick={e => setIsAttachingActors(true)}
              className={classes.tabControlButton}
            >
              Update
              <Edit />
            </Button>
          </div>
          <Paper>
            <List
              subheader={<ListSubheader component="div">Actors</ListSubheader>}
            >
              {(actorIds || []).map(v => (
                <OnActorEntry key={v} id={v} detatchActor={detatchActor} />
              ))}
            </List>
          </Paper>
        </TabPanel>
      </div>
      <Drawer
        anchor="top"
        open={isAttachingInstances}
        onClose={e => setIsAttachingInstances(false)}
      >
        <PageInstancesAdd onDone={onUpdateInstances} selected={instanceIds} />
      </Drawer>
      <Drawer
        anchor="top"
        open={isAttachingActors}
        onClose={e => setIsAttachingActors(false)}
      >
        <PageActorsAdd onDone={onUpdateActors} selected={actorIds} />
      </Drawer>
    </CardContent>
  );
});

function useRouterMemories(id: number) {
  const { state, updateState } = useHistoryState(`image-content-${id}`, {
    tab: 0
  });

  return {
    ...state,
    setTab: f => updateState({ tab: f })
  };
}

export default ImageContent;
