import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import ListIcon from "@material-ui/icons/List";
import AddIcon from "@material-ui/icons/Add";

import Admin from "layouts/Admin.js";
import ListFAQs from "../../components/FAQs/ListFAQs";
import NewFAQ from "../../components/FAQs/NewFAQ";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function FAQs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper square className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon label tabs example"
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab icon={<ListIcon />} label="List FAQs" {...a11yProps(0)} />
        <Tab icon={<AddIcon />} label="Add New" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ListFAQs />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NewFAQ handleChange={handleChange} />
      </TabPanel>
    </Paper>
  );
}

FAQs.layout = Admin;

export default FAQs;
