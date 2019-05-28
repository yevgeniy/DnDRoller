import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import { Card, CardHeader } from "@material-ui/core";

const useStyle = makeStyles(theme => {
  return {
    root: {
      padding: theme.spacing(1),
      minWidth: 300
    }
  };
});

export default function() {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <Card>
        <CardHeader
          avatar={<FaceIcon />}
          title="Arhail"
          subheader="Priest lvl 3"
          action={<Chip label="10/40" color="secondary" variant="outlined" />}
        />
      </Card>

      {/* <Typography variant="h5">Arhail</Typography>
      <Chip
        icon={<FaceIcon />}
        label="10/40"
        className={classes.chip}
        color="secondary"
        variant="outlined"
      /> */}
    </div>
  );
}
