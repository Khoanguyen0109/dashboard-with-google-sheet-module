import Cookies from 'js-cookie';
import actions from './actions';
import { DataService } from '../../config/dataService/dataService';
import { axiosPublic, get } from '../../config/axios';
import { resetItem, setItem } from '../../utility/localStorageControl';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../contants';

const { loginBegin, loginSuccess, loginErr, meBegin, meEnd, logoutBegin, logoutSuccess, logoutErr } = actions;

const login = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loginBegin());
      const res = await axiosPublic.post('auth/login', payload);
      setItem(ACCESS_TOKEN, res.data.tokens.access.token);
      setItem(REFRESH_TOKEN, res.data.tokens.refresh.token);
      return dispatch(loginSuccess(res.data.user));
    } catch (err) {
      if (err.response.data) {
        dispatch(loginErr(err.response.data.message));
      }
    }
  };
};

const logOut = () => {
  return async (dispatch) => {
    try {
      dispatch(logoutBegin());
      resetItem();
      dispatch(logoutSuccess(null));
    } catch (err) {
      dispatch(logoutErr(err));
    }
  };
};
const me = () => {
  return async (dispatch) => {
    try {
      dispatch(meBegin());
      const res = await get('auth/me');
      console.log('res :>> ', res);
      dispatch(loginSuccess(res.data.user));
    } catch (error) {
      dispatch(meEnd());
    }
  };
};

export { login, logOut, me };
