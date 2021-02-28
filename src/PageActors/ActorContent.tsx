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
import { Link } from "react-router-dom";
import blue from "@material-ui/core/colors/blue";

import Extension from "@material-ui/icons/Extension";
import Photo from "@material-ui/icons/Photo";
import Info from "@material-ui/icons/Info";

import PageImagesAdd from "../PageImages/PageImagesAdd";
import PageInstancesAdd from "../PageInstances/PageInstancesAdd";

import { useInstance, useImage, useInstanceIdsForActor } from "../util/hooks";
import { ModelActor } from "../models/ModelActor";

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
      <EntityContentTabInfo label="Info" icon={<Info />}>
        Item One
      </EntityContentTabInfo>
      <EntityContentTabRelation
        label="Instances"
        icon={<Extension />}
        listSubheader="Instances"
        ids={instanceIds || []}
        update={setInstanceIds}
        listComponent={InstanceEntry}
        updateComponent={PageInstancesAdd}
      />
      <EntityContentTabImages
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

const useInstanceEntryStyles = makeStyles(
  theme =>
    createStyles({
      root: {},
      avatar: {
        backgroundColor: blue[500],
        [theme.breakpoints.down("xs")]: {
          width: 30,
          height: 30
        }
      }
    }),
  { name: "InstanceEntry" }
);
interface InstanceEntryProps {
  id?: number;
}
const InstanceEntry = React.memo((props: InstanceEntryProps) => {
  const classes = useInstanceEntryStyles({});
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
        <Avatar className={classes.avatar}>{instance.name[0]}</Avatar>
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
  const classes = useImageEntryPropsStyles({});
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
