import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader/root';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import { ReactReduxFirebaseProvider, isLoaded } from 'react-redux-firebase';
import { ConfigProvider, Spin } from 'antd';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store, { rrfProps } from './redux/store';
import Admin from './routes/admin';
import Auth from './routes/auth';
import './static/css/style.css';
import config from './config/config';
import ProtectedRoute from './components/utilities/protectedRoute';
import 'antd/dist/antd.less';
import GoogleProvider from './context/GoogleContext';
import { getItem } from './utility/localStorageControl';
import { GOOGLE_ACCESS_TOKEN, USER_STATUS } from './contants';
import useGoogleSheet from './hooks/useGoogleSheet';

import { me } from './redux/authentication/actionCreator';

const { theme } = config;

const ProviderConfig = () => {
  const dispatch = useDispatch();
  const { rtl, user, loadingMe, topMenu, darkMode, auth } = useSelector((state) => {
    return {
      darkMode: state.ChangeLayoutMode.data,
      rtl: state.ChangeLayoutMode.rtlData,
      topMenu: state.ChangeLayoutMode.topMenu,
      loadingMe: state.auth.loadingMe,
      user: state.auth.user,
      auth: state.fb.auth,
    };
  });
  const isLoggedIn = user && user.status === USER_STATUS.ACTIVE;
  console.log('isLoggedIn', isLoggedIn);
  const [path, setPath] = useState(window.location.pathname);
  console.log('loadingMe', loadingMe);
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      setPath(window.location.pathname);
    }
    // eslint-disable-next-line no-return-assign
    return () => (unmounted = true);
  }, [setPath]);

  const preLoadingApp = async () => {
    dispatch(me());
  };
  useEffect(() => {
    preLoadingApp();
  }, []);

  return (
    <ConfigProvider direction={rtl ? 'rtl' : 'ltr'}>
      <ThemeProvider theme={{ ...theme, rtl, topMenu, darkMode }}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          {loadingMe ? (
            <div className="spin">
              <Spin />
            </div>
          ) : (
            <Router basename={process.env.PUBLIC_URL}>
              {!isLoggedIn ? <Route path="/" component={Auth} /> : <ProtectedRoute path="/admin" component={Admin} />}
              {isLoggedIn && (path === process.env.PUBLIC_URL || path === `${process.env.PUBLIC_URL}/`) && (
                <Redirect to="/admin" />
              )}
            </Router>
          )}
        </ReactReduxFirebaseProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <GoogleProvider>
        <ProviderConfig />
      </GoogleProvider>
    </Provider>
  );
}

export default hot(App);
