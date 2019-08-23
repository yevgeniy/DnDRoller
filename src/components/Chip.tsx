import * as React from "react";
import clsx from "clsx";
import { makeStyles, createStyles, Chip as MuiChip } from "@material-ui/core";
import { ChipProps } from "@material-ui/core/Chip";

const useStyles = makeStyles(
  theme =>
    createStyles({
      root: {
        height: 25
      }
    }),
  { name: "Chip" }
);
const useStylesMuiChip = makeStyles(theme => {
  return createStyles({
    label: {
      paddingRight: theme.spacing(1 / 2),
      paddingLeft: theme.spacing(1)
    },
    icon: {
      marginLeft: theme.spacing(1 / 4)
    }
  });
});

const Chip = React.memo((props: ChipProps) => {
  const classes = useStyles(props);
  const muiChipClasses = useStylesMuiChip();

  return (
    <MuiChip
      {...props}
      className={clsx(classes.root, props.className)}
      classes={muiChipClasses}
    />
  );
});

export default Chip;
