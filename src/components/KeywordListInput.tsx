import * as React from "react";
import { useState, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  TextField,
  Chip,
  IconButton,
  Button,
  Divider,
  Typography
} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";

import { useKeywords } from "../util/hooks";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    container: {
      paddingTop: theme.spacing(1)
    },
    label: {
      fontSize: ".8em",
      fontStyle: "italic",
      color: theme.palette.grey[400]
    }
  })
);

const useAutocompleteStyles = makeStyles(
  theme =>
    createStyles({
      root: { padding: 0, width: "100%" },
      inputRoot: { padding: "0 !important" },
      endAdornment: { display: "none" },
      input: { width: "auto !important" }
    }),
  { name: "autocomplete-overrides" }
);

interface KeywordListInputProps {
  keywords: string[];
  onUpdate: (v: string[]) => void;
}
function KeywordListInput(props: KeywordListInputProps) {
  const classes = useStyles({});
  const autoCompleteClasses = useAutocompleteStyles({});
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
      <Divider />
      <div className={classes.label}>keywords:</div>
      <div className={classes.container}>
        <Autocomplete
          classes={autoCompleteClasses}
          multiple
          id="tags-filled"
          options={allKeywords}
          defaultValue={keywords}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={params => {
            console.log("a", params);
            return (
              <TextField
                {...params}
                placeholder="-- ADD KEYWORD --"
                fullWidth
              />
            );
          }}
        />
      </div>
    </div>
  );
}

export default KeywordListInput;
