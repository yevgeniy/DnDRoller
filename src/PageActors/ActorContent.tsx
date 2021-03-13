import React from "react";

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
  InstanceEntry,
  ImageEntry
} from "../components";
import { Link } from "react-router-dom";
import blue from "@material-ui/core/colors/blue";

import Extension from "@material-ui/icons/Extension";
import Photo from "@material-ui/icons/Photo";
import Info from "@material-ui/icons/Info";

import PageImagesAdd from "../PageImages/PageImagesAdd";
import PageInstancesAdd from "../PageInstances/PageInstancesAdd";

import { useInstance, useImage, useInstanceIdsForActor } from "../util/hooks";
import { ModelActor } from "../models/ModelActor";
import Image from "../PageImages/Image";

const useStyles = makeStyles(
  theme => {
    return createStyles({
      root: {}
    });
  },
  { name: "ActorContent" }
);

type IActorContent = { [P in keyof ModelActor]: ModelActor[P] } & {
  updateActor: (actor: ModelActor) => any;
  className?: string;
  classes?: any;
};
const ActorContent = ({
  className,
  classes: _classes,
  updateActor,
  ...actor
}: IActorContent) => {
  const classes = useStyles({ classes: _classes });
  const { instanceIds, setInstanceIds } = useInstanceIdsForActor(actor.id);
  const setImageIds = async (ids: number[]) => {
    actor.images = ids;
    updateActor({ ...actor });
  };
  return (
    <EntityContentTabs className={clsx(classes.root, className)} id={actor.id}>
      {/* <EntityContentTabInfo label="Info" icon={<Info />}>
        Item One
      </EntityContentTabInfo> */}
      <EntityContentTabRelation
        label="Instances"
        icon={<Extension />}
        listSubheader="Instances"
        ids={instanceIds || []}
        update={setInstanceIds}
        listComponent={InstanceEntry}
        updateComponent={PageInstancesAdd}
      />
      <EntityContentTabRelation
        label="Images"
        icon={<Photo />}
        listSubheader="Images"
        ids={actor.images || []}
        update={setImageIds}
        listComponent={ImageEntry}
        updateComponent={PageImagesAdd}
      />
    </EntityContentTabs>
  );
};
export default ActorContent;
