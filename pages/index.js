import React from "react";
import Router from "next/router";

export default function Index(props) {
  React.useEffect(() => {
    Router.push("/auth/login");
  });

  return <div />;
}
