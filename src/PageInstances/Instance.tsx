import * as React from "react";
import { useState, useEffect, useContext, useRef, useReducer } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Link } from "react-router-dom";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import purple from "@material-ui/core/colors/purple";
import blue from "@material-ui/core/colors/blue";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Delete from "@material-ui/icons/Delete";
import AccessTime from "@material-ui/icons/AccessTime";
import DirectionsRun from "@material-ui/icons/DirectionsRun";
import Info from "@material-ui/icons/Info";
import Edit from "@material-ui/icons/Edit";
import Photo from "@material-ui/icons/Photo";
import Clone from "@material-ui/icons/CallSplit";
import {
  Tabs,
  Tab,
  Button,
  Fab,
  Divider,
  IconButton,
  Avatar,
  CardContent,
  Card,
  Checkbox,
  Collapse,
  Drawer
} from "@material-ui/core";
import { CardHeader, ContextMenu, TabPanel, Chip } from "../components";

import moment from "moment";
import Actions from "./Actions";

import {
  useActor,
  useInstance,
  useImage,
  useHot,
  useHistoryState
} from "../util/hooks";

import PageImagesAdd from "../PageImages/PageImagesAdd";
import PageActorsAdd from "../PageActors/PageActorsAdd";
import { ModelInstance } from "../models/ModelInstance";
import { RouterContextView } from "../util/routerContext";

import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  Paper
} from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    card: {},
    deleteButton: {
      background: "white",
      "& svg": {
        transition: "all ease 200ms",
        transform: "scale(2)",
        color: purple[600],
        [theme.breakpoints.up("sm")]: {
          transform: "scale(1.5)"
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
    cloneButton: {
      background: "white",
      marginLeft: theme.spacing(2),
      "& svg": {
        color: purple[600],
        transform: "scale(2)",
        [theme.breakpoints.up("sm")]: {
          transform: "scale(1.5)"
        }
      }
    },
    deleteButtonActive: {
      "& svg": {
        transform: "scale(1)"
      }
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
    actorAvatar: {
      backgroundColor: blue[500]
    },
    removeActor: {
      "& svg": {
        color: red[600]
      }
    },
    instanceControls: {
      padding: theme.spacing(1)
    },
    cardContent: {
      marginTop: theme.spacing(1),
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        flex: 1,
        [theme.breakpoints.down("xs")]: {
          flexBasis: "100%",
          flexShrink: 0,
          marginTop: theme.spacing(1)
        }
      }
    },
    deleteContainer: {
      display: "flex",
      justifyContent: "flex-end"
    },
    catorControls: {
      display: "flex"
    },
    chip: {
      color: orange[600],
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
    },
    addActorButton: {
      background: green[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    deleteActorStart: {
      background: red[600],
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    },
    imageContainer: {
      display: "flex",
      flexWrap: "nowrap",
      width: "90vw",
      overflow: "auto"
    },
    deleteInstanceButton: {
      background: orange[600],
      marginLeft: theme.spacing(1),
      "& svg": {
        marginRight: theme.spacing(1)
      }
    }
  })
);

type InstanceProps = { [P in keyof ModelInstance]?: ModelInstance[P] } & {
  classes?: { card: string };
  setSortInstance?: (a: ModelInstance) => void;
  deleteInstance?: (i: number) => void;
  setSelected?: (f: boolean) => void;
  selected?: boolean;
  cloneInstance?: (instance: ModelInstance) => any;
};

const Instance = React.memo((props: InstanceProps) => {
  const classes = useStyles(props);
  const [instance, updateInstance] = useInstance(props.id);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const {
    tab,
    setTab,
    isAttachingImages,
    setIsAttachingImages,
    isExpanded,
    setIsExpanded,
    isAttachingActors,
    setIsAttachingActors
  } = useRouterMemories(props.id);

  const { hot: hotDelete, setHot: setHotDelete } = useHot();
  const cxcloser = useRef(function() {});

  useEffect(() => {
    if (!instance) return;
    props.setSortInstance(instance);
  }, [instance]);

  const handleExpandClick = e => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  const openActionPanel = e => {
    e.stopPropagation();
    setIsActionsOpen(true);
  };
  const deleteInstance = (e = null) => {
    if (!instance) return;
    props.deleteInstance(props.id);
  };
  const doAttachActors = a => {
    updateInstance({ actors: [...a] });
    setIsAttachingActors(false);
  };
  const doAttachImages = async (ids: number[]) => {
    instance.images = ids;
    updateInstance({ ...instance });
    setIsAttachingImages(false);
  };
  const doDelete = () => {
    if (hotDelete) {
      deleteInstance();
      cxcloser.current();
    } else setHotDelete(true);
  };
  const doClone = () => {
    props.cloneInstance(instance);
    cxcloser.current();
  };

  if (!instance) return null;

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          contextmenu={
            <ContextMenu
              onOpen={c => {
                cxcloser.current = c;
              }}
            >
              <Fab
                className={clsx(classes.deleteButton, {
                  [classes.deleteButtonActive]: hotDelete
                })}
                onClick={doDelete}
                variant="extended"
                color="default"
                size="small"
                type="submit"
              >
                <Delete />
              </Fab>
              <Fab
                className={classes.cloneButton}
                onClick={doClone}
                variant="extended"
                color="default"
                size="small"
                type="submit"
              >
                <Clone />
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
                  {instance.name[0]}
                </Avatar>
              )}
            </>
          }
          action={
            <>
              <Chip
                icon={<AccessTime />}
                label={moment()
                  .subtract(+new Date() - instance.created, "ms")
                  .calendar()}
                className={classes.chip}
                color="secondary"
                variant="outlined"
              />
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
          title={instance.name}
        />
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
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
                <Tab label="Actors" icon={<DirectionsRun />} />
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
                    onClick={e => setIsAttachingActors(true)}
                  >
                    Update
                    <Edit />
                  </Button>
                </div>
                <Paper>
                  <List
                    subheader={
                      <ListSubheader component="div">Actors</ListSubheader>
                    }
                  >
                    {(instance.actors || []).map(v => (
                      <ActorEntry key={v} id={v} />
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
                    subheader={
                      <ListSubheader component="div">Images</ListSubheader>
                    }
                  >
                    <div className={classes.imageContainer}>
                      {(instance.images || []).map(v => (
                        <ImageEntry key={v} id={v} />
                      ))}
                    </div>
                  </List>
                </Paper>
              </TabPanel>
            </div>
          </CardContent>
        </Collapse>
      </Card>
      <Drawer
        open={isActionsOpen}
        anchor="right"
        onClose={() => setIsActionsOpen(false)}
      >
        <div>
          <Actions
            updateInstance={updateInstance}
            setOpenAction={setIsActionsOpen}
            {...instance}
          />
        </div>
      </Drawer>
      <Drawer
        anchor="top"
        open={isAttachingActors}
        onClose={e => setIsAttachingActors(false)}
      >
        <PageActorsAdd onDone={doAttachActors} selected={instance.actors} />
      </Drawer>
      <Drawer
        anchor="top"
        open={isAttachingImages}
        onClose={e => setIsAttachingImages(false)}
      >
        <PageImagesAdd
          onDone={doAttachImages}
          selected={instance.images || []}
        />
      </Drawer>
    </>
  );
});

interface ActorEntryProps {
  id: number;
}
const ActorEntry = React.memo((props: ActorEntryProps) => {
  const classes = useStyles({});
  const [actor] = useActor(props.id);

  if (!actor) return null;

  let c = [];
  for (let i in actor.class) {
    c.push(`${i} lvl: ${actor.class[i]}`);
  }

  return (
    <ListItem
      button
      component={Link}
      to={{
        pathname: "/actors",
        state: {
          discover: props.id
        }
      }}
    >
      <ListItemAvatar>
        <Avatar className={clsx(classes.avatar, classes.actorAvatar)}>
          {actor.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={actor.name} secondary={<>{c.join(", ")}</>} />
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
    },
    removeButton: {
      position: "absolute",
      top: 10,
      right: 22,
      background: red[600],
      color: "white"
    }
  });
});
interface ImageEntryProps {
  id: number;
}
const ImageEntry = React.memo((props: ImageEntryProps) => {
  const classes = useImageEntryPropsStyles({});
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
  const { state, updateState } = useHistoryState(`instance-${id}`, {
    tab: 0,
    isExpanded: false,
    isAttachingActors: false,
    isAttachingImages: false
  });

  return {
    ...state,
    setIsExpanded: f => updateState({ isExpanded: f }),
    setIsAttachingActors: f => updateState({ isAttachingActors: f }),
    setIsAttachingImages: f => updateState({ isAttachingImages: f }),
    setTab: t => updateState({ tab: t })
  };
}

export default Instance;
