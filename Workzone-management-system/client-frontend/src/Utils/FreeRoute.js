import React from "react";
import { Route, Redirect } from "react-router-dom";

const FreeRoute = ({ component: Component, ...rest }) => {
  if (localStorage.getItem("token")) return <Redirect push to="/workspaces" />;
  return (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} />;
      }}
    />
  );
};

export default FreeRoute;
