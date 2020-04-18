import * as React from "react";
import { useRef } from "react";
import { makeStyles, createStyles, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useKeywords } from "../util/hooks";

const useStyles = makeStyles(
  theme =>
    createStyles({
      root: {
        padding: theme.spacing(2)
      }
    }),
  { name: "Search" }
);
const useStylesInput = makeStyles(
  theme =>
    createStyles({
      root: {
        width: "100%"
      }
    }),
  { name: "Search-Input" }
);

const stuff = [
  { label: "asdf" },
  { label: "sdfg" },
  { label: "dfgh" },
  { label: "fghj" }
];

interface ISearch {
  onUpdate?: (e: string[]) => void;
  currentKeyWords: string[];
}

const Search = (props: ISearch) => {
  const classes = useStyles({});
  const classesInput = useStylesInput({});
  const ref = useRef({});
  const allKeyWords = useKeywords();
  if (!allKeyWords) return null;

  const update = e => {
    setTimeout(() => {
      //@ts-ignore
      let kw = [...ref.current.querySelectorAll(".MuiChip-label")].map(
        v => v.innerHTML
      );
      kw = Array.from(new Set(kw));
      props.onUpdate(kw);
    });
  };
  return (
    <div className={classes.root}>
      <Autocomplete
        ref={ref}
        multiple
        id="tags-outlined"
        options={allKeyWords}
        defaultValue={props.currentKeyWords}
        filterSelectedOptions
        onChange={update}
        renderInput={params => (
          <TextField
            {...params}
            classes={classesInput}
            variant="outlined"
            label="Filter by tags"
            placeholder="Tag"
          />
        )}
      />
    </div>
  );
};

export default Search;
