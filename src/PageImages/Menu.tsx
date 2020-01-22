import * as React from "react";
import {
  makeStyles,
  createStyles,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import clsx from "clsx";
import { useOpenStream } from "../util/sync";

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
  children?: React.ReactElement | React.ReactElement[];
}

const Menu = (props: IMenu) => {
  const classes = useStyles({ classes: props.classes });
  const [showThumbOnImages, { set: set_showThumbOnImages }] = useOpenStream(
    "showThumbOnImages"
  );

  return (
    <div className={clsx(classes.root, props.className)}>
      {showThumbOnImages !== null && (
        <FormControlLabel
          control={
            <Checkbox
              checked={showThumbOnImages}
              onChange={e => set_showThumbOnImages(e.target.checked)}
              value="showThumbOnImages"
            />
          }
          label="Show thumb on items"
        />
      )}
    </div>
  );
};

export default Menu;
