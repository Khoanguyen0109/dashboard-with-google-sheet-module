import React, { useState, useEffect, createContext, useContext } from 'react';
import loadScript from 'load-script';

import axios from 'axios';
import { removeItem, setItem } from '../utility/localStorageControl';
import { GOOGLE_ACCESS_TOKEN } from '../contants';

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';
const GOOGLE_GIS_SDK_URL = 'https://accounts.google.com/gsi/client';
let sign;

let scriptLoadingStarted = false;
let scriptGisLoadingStarted = false;

export const GoogleContext = createContext(null);

function GoogleProvider(props) {
  const CLIENT_ID = '519737753629-trjh0a61etdljp7oicldqa93s48v8fd9.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyA8mE7EXWFq7CYB-wCPXMHjZVDzCmsB6F0';
  const [user, setUser] = useState();
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInit, setGisInit] = useState(false);
  const [tokenClient, setTokenClient] = useState();
  const [client, setClient] = useState();
  const [sheetList, setSheetList] = useState([]);
  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile';

  async function initializeGapiClient() {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });

    setGapiInited(true);
  }

  function gisLoaded() {
    const token = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    setGisInit(true);
    setTokenClient(token);
  }

  const onApiLoad = () => {
    try {
      window.gapi.load('client', initializeGapiClient);
    } catch (error) {}
  };

  async function getUserInfo() {
    const res = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: { Authorization: `Bearer ${localStorage.getItem('google_access_token')}` },
    });
    setUser(res.data);
  }

  useEffect(() => {
    if (!!window.gapi) {
      onApiLoad();
    } else if (!scriptLoadingStarted) {
      scriptLoadingStarted = true;
      loadScript(GOOGLE_SDK_URL, onApiLoad);
    }
    if (!!window.google) {
      gisLoaded();
    } else if (!scriptGisLoadingStarted) {
      scriptGisLoadingStarted = true;
      loadScript(GOOGLE_GIS_SDK_URL, gisLoaded);
    }

    return () => {};
  }, []);

  function handleAuthClick() {
    tokenClient.callback = async (data) => {
      if (data.error !== undefined) {
        throw data;
      }
      console.log('data :>> ', data);
      const accessToken = data.access_token;
      setItem(GOOGLE_ACCESS_TOKEN, accessToken);

      await getUserInfo();
    };
    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  function handleSignoutClick() {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
    }
    removeItem(GOOGLE_ACCESS_TOKEN);
  }

  const googleAuthenticated = false;
  return <GoogleContext.Provider value={{ user, setUser, handleAuthClick, handleSignoutClick }} {...props} />;
}

export const useGoogleContext = () => useContext(GoogleContext);

export default GoogleProvider;
