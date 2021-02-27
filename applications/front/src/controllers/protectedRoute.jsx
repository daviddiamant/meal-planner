import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ loggedIn, gotAuth, children, ...props }) =>
  gotAuth ? (
    loggedIn ? (
      <Route {...props}>{children}</Route>
    ) : (
      <Redirect to="/profile" />
    )
  ) : null;

const mapStateToProps = (state) => {
  return {
    loggedIn: state.user.uID,
    gotAuth: state.user.gotAuth,
  };
};

export default connect(mapStateToProps, null)(ProtectedRoute);
