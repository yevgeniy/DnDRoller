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
  EntityContentTabs,
  ActorEntry,
  ImageEntry
} from "../components";
import PageImagesAdd from "../PageImages/PageImagesAdd";
import PageActorsAdd from "../PageActors/PageActorsAdd";

import DirectionsRun from "@material-ui/icons/DirectionsRun";
import Photo from "@material-ui/icons/Photo";
import Info from "@material-ui/icons/Info";

import { useInstance, useCommonHook } from "../util/hooks";

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
      {/* <EntityContentTabInfo label="Info" icon={<Info />}>
        Item One
      </EntityContentTabInfo> */}
      <EntityContentTabRelation
        label="Actors"
        icon={<DirectionsRun />}
        listSubheader="Actors"
        ids={instance.actors || []}
        update={setActorIds}
        listComponent={ActorEntry}
        updateComponent={PageActorsAdd}
      />
      <EntityContentTabRelation
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
