import * as React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { SortImagesBy } from "../enums";
import { useImageIds, useService } from "../util/hooks";
import ServiceImage from "../services/ServiceImage";

const useStyles = makeStyles(theme => {
  return {
    card: {
      marginTop: theme.spacing(1),
      "&:first-child": {
        marginTop: 0
      }
    }
  };
});

interface ImageProps {
  children: (ModelImage) => React.ReactElement;
  sort: SortImagesBy;
  ids: number[];
}
const Images = ({ children, ids, sort }: ImageProps) => {
  const classes = useStyles({});
  const [entries, setentries] = useState([]);
  const imageService = useService(ServiceImage);

  useEffect(() => {
    if (!imageService) return;

    if (!ids || !ids.length) {
      setentries([]);
      return;
    }

    let done = setentries;
    imageService.getAll(ids).then(done);
    return () => (done = () => {});
  }, [imageService, ids.join(",")]);

  switch (sort) {
    case "name":
      entries.sort((a, b) => (a.name > b.name ? 1 : -1));
      break;
    case "newest":
      entries.sort((a, b) => (a.created > b.created ? -1 : 1));
      break;
    case "oldest":
      entries.sort((a, b) => (a.created > b.created ? 1 : -1));
      break;
    default:
  }

  return (
    <div>
      {entries.map(v =>
        React.cloneElement(children(v), {
          key: v.id,
          classes
        })
      )}
    </div>
  );
};

export default Images;
