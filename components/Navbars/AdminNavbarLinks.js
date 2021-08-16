import React, { useState, useEffect } from "react";
import { getSession, signOut } from "next-auth/client";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// core components
import Button from "../CustomButtons/Button.js";
import useWindowSize from "../Hooks/useWindowSize.js";

import Loader from "../Loader/Loader.js";

import styles from "../../assets/jss/nextjs-material-dashboard/components/headerLinksStyle.js";

export default function AdminNavbarLinks() {
  const [isLogout, setIsLogout] = useState(false);
  const [loadedSession, setLoadedSession] = useState();
  const size = useWindowSize();
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        if (!loadedSession) {
          setLoadedSession(session);
        }
      }
    });
  });
  async function logOutHandler(event) {
    event.preventDefault();
    setIsLogout(true);
    await signOut();
  }
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  return (
    <div>
      {isLogout && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "500",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Loader />
        </div>
      )}
      <div className={classes.manager}>
        <Button
          color={size.width > 959 ? "transparent" : "white"}
          justIcon={size.width > 959}
          simple={!(size.width > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          {loadedSession && loadedSession.user.image ? (
            <img
              src={`http://localhost:3000/${loadedSession.user.image}`}
              className={classes.icons}
              style={{ width: "24px", height: "24x", borderRadius: "24px" }}
              alt="a"
            />
          ) : (
            <Person className={classes.icons} />
          )}
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={logOutHandler}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}
