import * as React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import { useState } from "react";
import { makeStyles, StyleRules } from "@material-ui/core/styles";

const useStyles = makeStyles(() => {
  const styles: StyleRules = {
    root: {
      position: "relative"
    },
    container: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "center"
    }
  };
  return styles;
});

export default function(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CardHeader {...props} />
      <div className={classes.container}>{props.menu}</div>
    </div>
  );
}
