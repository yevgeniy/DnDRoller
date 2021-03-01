import * as React from "react";
import clsx from "clsx";
import {
  Avatar,
  ListItemText,
  ListItem,
  ListItemAvatar,
  makeStyles,
  createStyles
} from "@material-ui/core";
import {
  EntityContentTabInfo,
  EntityContentTabRelation,
  EntityContentTabImages,
  EntityContentTabs
} from "../components";
import PageImagesAdd from "../PageImages/PageImagesAdd";
import PageActorsAdd from "../PageActors/PageActorsAdd";
import { Link } from "react-router-dom";
import blue from "@material-ui/core/colors/blue";

import DirectionsRun from "@material-ui/icons/DirectionsRun";
import Photo from "@material-ui/icons/Photo";
import Info from "@material-ui/icons/Info";

import {
  useInstance,
  useImage,
  useInstanceIdsForActor,
  useActor,
  useCommonHook
} from "../util/hooks";
import { ModelInstance } from "../models/ModelInstance";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {}
    });
  },
  { name: "InstanceContent" }
);

type IInstanceContent = {
  id: number;
  className?: string;
  classes?: any;
};
const InstanceContent = ({
  className,
  classes: _classes,
  id
}: IInstanceContent) => {
  const classes = useStyles({ classes: _classes });

  const [
    instance,
    updateInstance,
    createInstance,
    cloneActor,
    updateActors
  ] = useCommonHook(useInstance, id) || [null, null, null, null, null];

  const setImageIds = (ids: number[]) => {
    instance.images = ids;
    updateInstance({ ...instance });
  };
  const setActorIds = (ids: number[]) => {
    updateActors(ids);
  };
  if (!instance) return null;
  return (
    <EntityContentTabs
      className={clsx(classes.root, className)}
      id={instance.id}
    >
      <EntityContentTabInfo label="Info" icon={<Info />}>
        Item One
      </EntityContentTabInfo>
      <EntityContentTabRelation
        label="Actors"
        icon={<DirectionsRun />}
        listSubheader="Actors"
        ids={instance.actors || []}
        update={setActorIds}
        listComponent={ActorEntry}
        updateComponent={PageActorsAdd}
      />
      <EntityContentTabImages
        label="Images"
        icon={<Photo />}
        listSubheader="Images"
        ids={instance.images || []}
        update={setImageIds}
        listComponent={ImageEntry}
        updateComponent={PageImagesAdd}
      />
    </EntityContentTabs>
  );
};
export default InstanceContent;

const useImageEntryStyles = makeStyles(theme => {
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
interface IImageEntry {
  id: number;
}
const ImageEntry = React.memo((props: IImageEntry) => {
  const classes = useImageEntryStyles({});
  const [image, , , url] = useImage(props.id);

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

const useActorEntryStyles = makeStyles(theme =>
  createStyles({
    avatar: {
      backgroundColor: blue[500],
      [theme.breakpoints.down("xs")]: {
        width: 30,
        height: 30
      }
    }
  })
);
interface IActorEntry {
  id: number;
}
const ActorEntry = React.memo((props: IActorEntry) => {
  const classes = useActorEntryStyles({});
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
        <Avatar className={clsx(classes.avatar)}>{actor.name[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={actor.name} secondary={<>{c.join(", ")}</>} />
    </ListItem>
  );
});
