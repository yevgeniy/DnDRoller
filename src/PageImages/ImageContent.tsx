import * as React from "react";

const ImageContent = props => {
  return (
    <CardContent>
      <Divider />
      <div className={classes.cardContent}>
        <div>
          <div className={classes.deleteContainer}>
            <Button
              variant="contained"
              color="secondary"
              onClick={e =>
                confirmDelete ? deleteImage(e) : setConfirmDelete(true)
              }
              button="true"
              className={classes.deleteImageButton}
            >
              <Delete />
              {confirmDelete ? "...again to confirm" : "Delete Actor"}
            </Button>
          </div>
          <div className={classes.participantsControls}>
            <Button
              variant="contained"
              color="secondary"
              button="true"
              onClick={e => setAttachInstances(true)}
              className={classes.addParticipantButton}
            >
              <Extension />
              Update Instances
            </Button>
            <Button
              variant="contained"
              color="secondary"
              button="secondary"
              onClick={e => setRemoveInstances(!removeInstances)}
              className={classes.removeFromParticipantStart}
            >
              <Extension />
              {removeInstances ? "...cancel" : "Remove from Instances"}
            </Button>
          </div>
        </div>
        <div>
          <Paper>
            <List
              subheader={
                <ListSubheader component="div">On Instance</ListSubheader>
              }
            >
              {(instanceIds || []).map(v => (
                // <OnInstanceEntry
                //   key={v}
                //   id={v}
                //   removeInstance={removeInstance}
                //   deleteInstances={removeInstances}
                // />
              ))}
            </List>
          </Paper>
        </div>
      </div>
    </CardContent>
  );
};

export default ImageContent;
