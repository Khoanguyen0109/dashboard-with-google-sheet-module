import React from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { USER_STATUS } from '../../contants';

function ProtectedRoute({ component, path }) {
  const user = useSelector((state) => state.auth.user);
  console.log('user && user.status === USER_STATUS.ACTIVE :>> ', user && user.status === USER_STATUS.ACTIVE);
  return user && user.status === USER_STATUS.ACTIVE ? <Route component={component} path={path} /> : <Redirect to="/" />;
}

ProtectedRoute.propTypes = {
  component: propTypes.object.isRequired,
  path: propTypes.string.isRequired,
};

export default ProtectedRoute;
