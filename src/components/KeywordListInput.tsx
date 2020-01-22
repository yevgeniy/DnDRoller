import * as React from "react";
import { useState, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import TextField from "@material-ui/core/TextField";
import Add from "@material-ui/icons/Add";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import { useKeywords } from "../util/hooks";

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

const useAutocompleteStyles = makeStyles(theme =>
  createStyles({
    root: { padding: 0, width: "100%" },
    inputRoot: { padding: "0 !important" },
    endAdornment: { display: "none" }
  })
);

interface KeywordListInputProps {
  keywords: string[];
  onUpdate: (v: string[]) => void;
}
function KeywordListInput(props: KeywordListInputProps) {
  const classes = useStyles({});
  const [keywords, setKeywords] = useState(props.keywords || []);
  const allKeywords = useKeywords();
  const ref = useRef({});

  const doAdd = () => {
    setTimeout(() => {
      const v = document.querySelector("#free-solo-demo").value;
      if (v) {
        document.querySelector("#free-solo-demo").blur();
        setKeywords(keywords => Array.from(new Set([v, ...keywords])));
      }
    });
  };
  const doRemove = (name: string) => e => {
    setKeywords(Array.from(new Set(keywords.filter(v => v !== name))));
  };
  const doDone = () => {
    props.onUpdate([...keywords]);
  };

  return (
    <div className={classes.root}>
      {keywords.map((v, i) => (
        <div key={v}>
          {v}
          <IconButton
            className={classes.removeIcon}
            size="small"
            onClick={doRemove(v)}
          >
            <RemoveCircle />
          </IconButton>
        </div>
      ))}
      <div className={classes.container}>
        <Autocomplete
          ref={ref}
          classes={useAutocompleteStyles({})}
          id="free-solo-demo"
          freeSolo
          blurOnSelect
          onChange={e => doAdd()}
          options={allKeywords.filter(v => !keywords.some(z => z === v))}
          renderInput={params => (
            <TextField
              {...params}
              className={classes.class}
              label="keyword"
              value=""
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <div>
        <Button variant="contained" size="small" onClick={doDone}>
          <Add />
          Update Keywords
        </Button>
      </div>
    </div>
  );
}

export default KeywordListInput;
