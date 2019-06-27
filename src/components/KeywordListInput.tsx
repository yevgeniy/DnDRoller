import * as React from "react";
import { useState } from "react";
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

interface KeywordListInputProps {
    keywords: string[];
    onUpdate: (v: string[]) => void;
}
function KeywordListInput(props: KeywordListInputProps) {
    const [keywords, setKeywords] = useState(props.keywords || []);
    const classes = useStyles();
    const [newKeyword, setNewKeyword] = useState();

    const onAdd = e => {
        if (!newKeyword) return;
        const nkw = newKeyword.toLowerCase();
        if (keywords.indexOf(nkw) === -1) {
            setKeywords([...keywords, nkw]);
            props.onUpdate([...keywords, nkw]);
        }
        setNewKeyword("");
    };
    const onRemove = (name: string) => e => {
        const newkeywords = keywords.filter(v => v !== name);
        setKeywords(newkeywords);
        props.onUpdate(newkeywords);
    };

    return (
        <div className={classes.root}>
            {keywords.map((v, i) => (
                <div key={v}>
                    {v}
                    <IconButton
                        className={classes.removeIcon}
                        size="small"
                        onClick={onRemove(v)}>
                        <RemoveCircle />
                    </IconButton>
                </div>
            ))}
            <div className={classes.container}>
                <TextField
                    className={classes.class}
                    label="keyword"
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
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
                    Add Keyword
                </Button>
            </div>
        </div>
    );
}

export default KeywordListInput;
