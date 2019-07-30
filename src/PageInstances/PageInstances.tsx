import * as React from "react";
import { useState } from "react";
import Layout from "../Layout";
import Add from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import Instance from "./Instance";
import Instances from "./Instances";
import { useInstanceIds } from "../util/hooks";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { RouterContextView } from "../util/routerContext";

function PageInstances(props) {
    const [instanceIds, createInstance, deleteInstance] = useInstanceIds();
    const [openNewInstanceDialog, setOpenNewInstanceDialog] = useState(false);
    const [newInstanceName, setNewInstanceName] = useState("");

    const onAdd = e => {
        setNewInstanceName("");
        setOpenNewInstanceDialog(true);
    };
    const onNewInstanceName = e => {
        e.preventDefault();
        if (!newInstanceName) return;
        createInstance(newInstanceName);
        setNewInstanceName("");
        setOpenNewInstanceDialog(false);
    };
    if (!instanceIds) return null;

    return (
        <RouterContextView.Provider value={props}>
            <Layout
                title="Instance Respository"
                control={
                    <>
                        <IconButton onClick={onAdd} color="inherit">
                            <Add />
                        </IconButton>
                    </>
                }>
                <Instances sort="name">
                    {instanceIds.map(v => (
                        <Instance
                            key={v}
                            id={v}
                            deleteInstance={deleteInstance}
                        />
                    ))}
                </Instances>
                <Dialog
                    open={openNewInstanceDialog}
                    onClose={e => setOpenNewInstanceDialog(false)}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        New Instance
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter new instance name. You will be able to set
                            other instance variables afterwards.
                        </DialogContentText>
                        <form onSubmit={onNewInstanceName}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Instance Name"
                                fullWidth
                                onChange={e =>
                                    setNewInstanceName(e.target.value)
                                }
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onNewInstanceName} color="primary">
                            Submit
                        </Button>
                        <Button
                            onClick={e => setOpenNewInstanceDialog(false)}
                            color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Layout>
        </RouterContextView.Provider>
    );
}

export default PageInstances;