import Cookies from 'js-cookie';
import actions from './actions';

const { LOGIN_BEGIN, LOGIN_SUCCESS, LOGIN_ERR, LOGOUT_BEGIN, LOGOUT_SUCCESS, LOGOUT_ERR, ME_BEGIN, ME_END } = actions;

const initState = {
  login: Cookies.get('logedIn'),
  loading: false,
  error: null,
  loadingMe: false,
};

/**
 *
 * @todo impure state mutation/explaination
 */
const AuthReducer = (state = initState, action) => {
  const { type, data, err } = action;
  switch (type) {
    case LOGIN_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: data,
        loading: false,
        loadingMe: false,
      };
    case LOGIN_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case LOGOUT_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: data,
        loading: false,
        error: null,
      };
    case LOGOUT_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case ME_BEGIN:
      return {
        loadingMe: true,
      };
    case ME_END:
      return {
        loadingMe: false,
      };
    default:
      return state;
  }
};
export default AuthReducer;
