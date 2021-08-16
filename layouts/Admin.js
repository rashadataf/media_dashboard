import React from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "../components/Navbars/Navbar.js";
import Footer from "../components/Footer/Footer.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import routes from "../routes.js";

import styles from "../assets/jss/nextjs-material-dashboard/layouts/adminStyle.js";

import bgImage from "../public/sidebar-2.jpg";
import logo from "../public/reactlogo.png";

let ps;

export default function Admin({ children, ...rest }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadedSession, setLoadedSession] = React.useState();
  // used for checking current route
  const router = useRouter();
  // styles
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("white");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return router.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    window.addEventListener("resize", resizeFunction);
    getSession().then((session) => {
      if (session) {
        if (session.user.role !== "admin") {
          router.push("/auth/login");
        }
        if (session.user.role === "admin") {
          if (isLoading) setIsLoading(false);
          if (!loadedSession) setLoadedSession(session);
        }
      } else {
        router.push("/auth/login");
      }
    });
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  if (!isLoading && loadedSession && loadedSession.user.role === "admin") {
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"Media Admin"}
          logo={logo}
          image={image}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          color={color}
          {...rest}
        />
        <div className={classes.mainPanel} ref={mainPanel}>
          <Navbar
            routes={routes}
            handleDrawerToggle={handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{children}</div>
            </div>
          ) : (
            <div className={classes.map}>{children}</div>
          )}
          {getRoute() ? <Footer /> : null}
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
}
