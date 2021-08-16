import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Admin from "layouts/Admin.js";
import ListAreas from "../../components/Areas/ListAreas";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Areas() {
  const classes = useStyles();

  return (
    <Paper square className={classes.root}>
      <ListAreas />
    </Paper>
  );
}

Areas.layout = Admin;

export default Areas;
