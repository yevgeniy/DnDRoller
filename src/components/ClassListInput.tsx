import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Add from "@material-ui/icons/Add";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: theme.spacing(1)
    },
    class: {
      "& input": {
        fontSize: ".8em",
        padding: theme.spacing(1),
        width: 80
      }
    },
    lvl: {
      marginLeft: theme.spacing(1),
      "& input": {
        fontSize: ".8em",
        padding: theme.spacing(1),
        width: 30
      }
    },
    removeIcon: {
      marginLeft: theme.spacing(1),
      color: red[600]
    },
    addIcon: {
      marginLeft: theme.spacing(1),
      color: green[600]
    }
  })
);

interface ClassListInputProps {
  classes: { [k: string]: number };
  onUpdate?: (v: { [k: string]: number }) => void;
}
function ClassListInput(props: ClassListInputProps) {
  const [clss, setClss] = useState(props.classes || {});
  const elm = useRef();
  useEffect(() => {
    setClss(props.classes);
  }, [props.classes]);
  const classes = useStyles();
  const [newClass, setNewClass] = useState();
  const [newLvl, setNewLvl] = useState();

  let c = [];
  for (let i in clss) c.push(`${i} lvl: ${clss[i]}`);

  return (
    <div className={classes.root}>
      {c.map(v => (
        <div key={v}>
          {v}
          <IconButton className={classes.removeIcon} size="small">
            <RemoveCircle />
          </IconButton>
        </div>
      ))}
      <div className={classes.container}>
        <TextField
          className={classes.class}
          id="filled-number"
          label="class"
          value={newClass}
          onChange={e => setNewClass(e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="outlined"
        />
        <TextField
          className={classes.lvl}
          id="filled-number"
          label="lvl"
          value={newLvl}
          onChange={e => setNewLvl(e.target.value)}
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="outlined"
        />
      </div>
      <div>
        <Button variant="contained" size="small">
          <Add />
          Add Class
        </Button>
      </div>
    </div>
  );
}

export default ClassListInput;
