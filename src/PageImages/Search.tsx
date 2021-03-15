import * as React from "react";
import { useRef, useEffect } from "react";
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
  possibleKeywords?: string[];
  immutable?: string[];
}

const Search = (props: ISearch) => {
  const classes = useStyles({});
  const classesInput = useStylesInput({});
  const ref = useRef({});
  const allKeyWords = props.possibleKeywords || useKeywords();
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

  useEffect(() => {
    if (!props.immutable) return;
    //@ts-ignore
    [...ref.current.querySelectorAll(".MuiChip-root")].forEach(v => {
      if (
        props.immutable.indexOf(v.querySelector(".MuiChip-label").innerText) >
        -1
      ) {
        v.style.pointerEvents = "none";
        v.querySelector("svg") && v.querySelector("svg").remove();
      }
    });
  });
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
