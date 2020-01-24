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

  const update = e => {
    setTimeout(() => {
      //@ts-ignore
      let kw = [...ref.current.querySelectorAll(".MuiChip-label")].map(
        v => v.innerHTML
      );
      kw = Array.from(new Set(kw));

      setKeywords(kw);
      props.onUpdate(kw);
    });
  };

  return (
    <div className={classes.root}>
      <Divider />
      <div className={classes.label}>keywords:</div>
      <div className={classes.container}>
        <Autocomplete
          ref={ref}
          classes={autoCompleteClasses}
          multiple
          id="tags-filled"
          options={allKeywords.filter(v => !keywords.some(z => z === v))}
          defaultValue={keywords}
          onChange={update}
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
