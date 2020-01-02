import * as React from "react";
import clsx from "clsx";
import { useState } from "react";
import {
  Avatar,
  ListItemText,
  ListItem,
  ListItemAvatar,
  makeStyles,
  createStyles,
  Tab,
  Tabs,
  Button,
  Paper,
  List,
  Drawer,
  ListSubheader
} from "@material-ui/core";
import { TabPanel } from "../components";
import { Link } from "react-router-dom";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";

import Extension from "@material-ui/icons/Extension";
import Photo from "@material-ui/icons/Photo";
import Info from "@material-ui/icons/Info";
import Edit from "@material-ui/icons/Edit";

import PageImagesAdd from "../PageImages/PageImagesAdd";
import PageInstancesAdd from "../PageInstances/PageInstancesAdd";

import {
  useInstance,
  useImage,
  useInstanceIdsForActor,
  useHistoryState
} from "../util/hooks";
import { ModelActor } from "../models/ModelActor";

const useStyles = makeStyles(theme => {
  return createStyles({
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

    imageContainer: {
      display: "flex",
      flexWrap: "nowrap",
      width: "77vw",
      overflow: "auto"
    },

    avatar: {
      backgroundColor: red[500],
      [theme.breakpoints.down("xs")]: {
        width: 30,
        height: 30
      }
    },
    instanceAvatar: {
      backgroundColor: blue[500]
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
    addInstanceButton: {
      background: green[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    removeInstance: {
      "& svg": {
        color: red[600]
      }
    },
    removeFromInstanceStart: {
      background: red[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    }
  });
});

type ActorContentProps = { [T in keyof ModelActor]: ModelActor[T] } & {
  update?: (actor: ModelActor) => any;
};

const ActorContent = React.memo(
  ({ update: updateActor, ...actor }: ActorContentProps) => {
    const classes = useStyles({});

    const [isAttachingInstances, setIsAttachingInstances] = useState(false);
    const [isAttachingImages, setIsAttachingImages] = useState(false);

    const { tab, setTab } = useRouterMemories(actor.id);

    const [
      instanceIds,
      attatchInstance,
      detatchInstance
    ] = useInstanceIdsForActor(actor.id);

    const onAttachInstances = async (ids: number[]) => {
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
    const onAttachImages = async (ids: number[]) => {
      actor.images = ids;
      updateActor({ ...actor });
      setIsAttachingImages(false);
    };

    return (
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
          <Tab label="Images" icon={<Photo />} />
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
                <InstanceEntry key={v} id={v} />
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
              onClick={e => setIsAttachingImages(true)}
              className={classes.tabControlButton}
            >
              Update
              <Edit />
            </Button>
          </div>
          <Paper>
            <List
              subheader={<ListSubheader component="div">Images</ListSubheader>}
            >
              <div className={classes.imageContainer}>
                {(actor.images || []).map(v => (
                  <ImageEntry key={v} id={v} />
                ))}
              </div>
            </List>
          </Paper>
        </TabPanel>
        <Drawer
          anchor="top"
          open={isAttachingInstances}
          onClose={e => setIsAttachingInstances(false)}
        >
          <PageInstancesAdd onDone={onAttachInstances} selected={instanceIds} />
        </Drawer>
        <Drawer
          anchor="top"
          open={isAttachingImages}
          onClose={e => setIsAttachingImages(false)}
        >
          <PageImagesAdd
            onDone={onAttachImages}
            selected={actor.images || []}
          />
        </Drawer>
      </div>
    );
  }
);

interface InstanceEntryProps {
  id: number;
}
const InstanceEntry = React.memo((props: InstanceEntryProps) => {
  const classes = useStyles();
  const [instance] = useInstance(props.id);

  if (!instance) return null;

  return (
    <ListItem
      button
      component={Link}
      to={{
        pathname: "/instances",
        state: {
          discover: props.id
        }
      }}
    >
      <ListItemAvatar>
        <Avatar className={clsx(classes.avatar, classes.instanceAvatar)}>
          {instance.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={instance.name} />
    </ListItem>
  );
});

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
const ImageEntry = React.memo((props: ImageEntryProps) => {
  const classes = useImageEntryPropsStyles();
  const { image, url } = useImage(props.id);

  if (!image) return null;
  if (!url) return null;
  return (
    <div className={classes.entry}>
      <Link to={{ pathname: "/image", state: { imageId: image.id } }}>
        <img src={url} alt="" />
      </Link>
    </div>
  );
});

function useRouterMemories(id: number) {
  const { state, updateState } = useHistoryState(`actor-content-${id}`, {
    tab: 0
  });

  return {
    ...state,
    setTab: f => updateState({ tab: f })
  };
}

export default ActorContent;
