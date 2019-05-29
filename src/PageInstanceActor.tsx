import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import blue from "@material-ui/core/colors/blue";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FlashOn from "@material-ui/icons/FlashOn";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Divider from "@material-ui/core/Divider";

import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";

import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import NavigationIcon from "@material-ui/icons/Navigation";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Collapse from "@material-ui/core/Collapse";

import Drawer from "@material-ui/core/Drawer";

import CharacterActions from "./CharacterActions";
import { ModelActor } from "./models/ModelActor";
import { useService } from "./util/hooks";
import ServiceActor from "./services/ServiceActor";

const useActorsStyles = makeStyles(theme => {
  return {
    card: {
      marginTop: theme.spacing(1),
      "&:first-child": {
        marginTop: 0
      }
    }
  };
});

type sortBy = "initiative" | "name";
interface PageInstanceActorsProps {
  children: React.ReactElement | React.ReactElement[];
  sort: sortBy;
}
export function PageInstanceActors({
  children,
  ...props
}: PageInstanceActorsProps) {
  const classes = useActorsStyles(props);
  const [sortedElms] = useSort(props.sort, children);

  return (
    <div>
      {sortedElms.map(v =>
        React.cloneElement(v, {
          classes
        })
      )}
    </div>
  );
}

const useActorStyles = makeStyles(theme => ({
  card: {},
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  content: {
    marginTop: theme.spacing(1)
  },
  chip: {
    margin: theme.spacing(1),
    minWidth: 70,
    justifyContent: "flex-start"
  },
  margin: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

type PageInstanceActorProps = { [P in keyof ModelActor]?: ModelActor[P] } & {
  classes?: { card: string };
  setSortActor?: (a: ModelActor) => void;
};

export function PageInstanceActor(props: PageInstanceActorProps) {
  const classes = useActorStyles(props);
  const [actor, updateActor] = useActor(props.id);
  useEffect(() => {
    if (!actor) return;
    props.setSortActor(actor);
  }, [actor]);

  const [expanded, setExpanded] = useState(false);
  const [openAction, setOpenAction] = useState(false);

  function handleExpandClick(e) {
    e.stopPropagation();
    setExpanded(!expanded);
  }
  function openActionPanel(e) {
    e.stopPropagation();
    setOpenAction(true);
  }

  if (!actor) return null;

  const c = [];
  for (let i in actor.class) c.push(`${i}: ${actor.class[i]}`);

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          onClick={openActionPanel}
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {actor.name[0]}
            </Avatar>
          }
          action={
            <>
              <Chip
                icon={<FlashOn />}
                label={actor.initiative}
                className={classes.chip}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<FaceIcon />}
                label={`${actor.hpCurrent}/${actor.hp}`}
                className={classes.chip}
                color="secondary"
                variant="outlined"
              />
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </>
          }
          title={actor.name}
          subheader={c.join(", ")}
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Divider />
            <div className={classes.content}>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron
                and set aside for 10 minutes.
              </Typography>
            </div>
          </CardContent>
        </Collapse>
      </Card>
      <Drawer
        open={openAction}
        anchor="right"
        onClose={() => setOpenAction(false)}
      >
        <div>
          <CharacterActions {...{ updateActor, setOpenAction, ...actor }} />
        </div>
      </Drawer>
    </>
  );
}

function useActor(id: number) {
  const serviceActor = useService(ServiceActor);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    if (!serviceActor) return;
    serviceActor.get(id).then(setActor);
  }, [serviceActor]);

  function updateActor(updateActor) {
    setActor({ ...actor, ...updateActor });
  }

  return [actor, updateActor];
}

function useSort(
  by: sortBy,
  children: React.ReactElement | React.ReactElement[]
): [any[]] {
  const [sortActors, setSortActors] = useState([]);

  switch (by) {
    case "initiative":
      sortActors.sort((a, b) => (a.initiative > b.initiative ? -1 : 1));
      break;
    case "name":
      sortActors.sort((a, b) => (a.name > b.name ? 1 : -1));
      break;
    default:
  }

  const elms = React.Children.map(children, v => {
    return React.cloneElement(v, {
      setSortActor: a => {
        const i = sortActors.findIndex(v => v.id == a.id);
        if (i === -1) setSortActors([...sortActors, a]);
        else {
          sortActors[i] = { ...a };
          setSortActors([...sortActors]);
        }
      }
    });
  });
  const sortedelms = [];

  sortActors.forEach(v => {
    var id = elms.findIndex(z => z.props.id == v.id);
    var elm = elms.splice(id, 1)[0];
    if (elm) sortedelms.push(elm);
  });
  sortedelms.push(...elms);
  return [sortedelms];
}
