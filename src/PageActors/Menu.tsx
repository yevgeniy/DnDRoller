import * as React from "react";
import {
  makeStyles,
  createStyles,
  FormControlLabel,
  Checkbox,
  Button
} from "@material-ui/core";
import clsx from "clsx";
import Delete from "@material-ui/icons/Delete";

import { useCommonHook, useShowThumbOnImages } from "../util/hooks";

const useStyles = makeStyles(
  theme =>
    createStyles({
      root: {
        padding: theme.spacing(2)
      }
    }),
  { name: "Menu" }
);

interface IMenu {
  classes?: any;
  className?: string;
  deleteFreeActors: () => void;
  children?: React.ReactElement | React.ReactElement[];
}

const Menu = (props: IMenu) => {
  const classes = useStyles({ classes: props.classes });
  const [showThumbOnImages, { set: set_showThumbOnImages }] = useCommonHook(
    useShowThumbOnImages
  ) || [null, { set: null }];

  return (
    <div className={clsx(classes.root, props.className)}>
      <Button
        variant="contained"
        color="secondary"
        button="true"
        onClick={props.deleteFreeActors}
      >
        <Delete />
        Delete Free Actors
      </Button>
    </div>
  );
};

export default Menu;
