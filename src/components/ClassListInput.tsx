import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
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
  onUpdate: (v: { [k: string]: number }) => void;
}
function ClassListInput(props: ClassListInputProps) {
  const [clss, setClss] = useState({ ...props.classes } || {});
  const elm = useRef();
  useEffect(() => {
    setClss({ ...props.classes });
  }, [props.classes]);
  const classes = useStyles({});
  const [newClass, setNewClass] = useState();
  const [newLvl, setNewLvl] = useState();

  const onAdd = e => {
    if (!newClass || !newLvl) return;
    setClss({ ...clss, [newClass]: newLvl });
    props.onUpdate({ ...clss, [newClass]: newLvl });
    setNewClass("");
    setNewLvl("");
  };
  const onRemove = (name: string) => e => {
    delete clss[name];
    setClss({ ...clss });
    props.onUpdate({ ...clss });
  };

  let c = [];
  for (let i in clss) c.push({ key: i, value: clss[i] });

  return (
    <div className={classes.root}>
      {c.map((v, i) => (
        <div key={v.key}>
          {`${v.key} lvl: ${v.value}`}
          <IconButton
            className={classes.removeIcon}
            size="small"
            onClick={onRemove(v.key)}
          >
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
        <Button variant="contained" size="small" onClick={onAdd}>
          <Add />
          Add Class
        </Button>
      </div>
    </div>
  );
}

export default ClassListInput;
