import React, { useEffect, useRef } from "react";
import {
  Select,
  Divider,
  MenuItem,
  InputLabel,
  FilledInput,
  Card,
  TextField,
  Fab,
  FormControl,
  makeStyles
} from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(
  theme => ({
    root: {}
  }),
  { name: "Input" }
);

interface IInput {
  label: string;
  className?: string;
  defaultValue: any;
  onChange: (v: any) => void;
  resetToken?: any;
  type?: "text" | "number";
}
export default function({
  label,
  className,
  defaultValue,
  onChange,
  resetToken,
  type
}: IInput) {
  const classes = useStyles({});
  const ref = useRef();

  useEffect(() => {
    const f = e => onChange(e.target.value);
    //@ts-ignore
    ref.current.addEventListener("change", f);
    return () => {
      //@ts-ignore
      ref.current.removeEventListener("chagne", f);
    };
  }, []);

  useEffect(() => {
    //@ts-ignore
    ref.current.querySelector("input").value = defaultValue;
  }, [resetToken]);

  return (
    <TextField
      className={clsx(classes.root, className)}
      label={label}
      ref={ref}
      defaultValue={defaultValue}
      InputLabelProps={{
        shrink: true
      }}
      type={type || "text"}
      margin="dense"
      variant="filled"
    />
  );
}
