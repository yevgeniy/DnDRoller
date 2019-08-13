import * as React from "react";
import { Typography, Box } from "@material-ui/core";

interface TabPanelProps {
  children: React.ReactNode;
  value: any;
  index: number;
}
const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
};

export default TabPanel;
