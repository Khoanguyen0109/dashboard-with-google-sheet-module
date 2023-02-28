import actions from './actions';

const {
  GET_HUMANS_BEGIN,
  GET_HUMANS_ERROR,
  GET_HUMANS_SUCCESS,
  GET_HUMAN_DETAIL_BEGIN,
  GET_HUMAN_DETAIL_ERROR,
  GET_HUMAN_DETAIL_SUCCESS,
  CREATE_HUMAN_BEGIN,
  CREATE_HUMAN_ERROR,
  CREATE_HUMAN_SUCCESS,
  DELETE_HUMAN_BEGIN,
  DELETE_HUMAN_ERROR,
  DELETE_HUMAN_SUCCESS,
} = actions;

const initState = {
  creating: false,
  loading: false,
  loadingDetail: false,
  deleting: false,
  list: [],
  details: {},
  selected: null,
  error: null,
};

const humanReducer = (state = initState, action) => {
  const { type, data, err } = action;
  switch (type) {
    case GET_HUMANS_BEGIN: {
      return {
        ...state,
        loading: true,
      };
    }
    case GET_HUMANS_SUCCESS: {
      return {
        ...state,
        list: data,
        loading: false,
      };
    }
    case GET_HUMANS_ERROR: {
      return {
        ...state,
        error: err,
        loading: false,
      };
    }

    case CREATE_HUMAN_BEGIN: {
      return {
        ...state,
        creating: true,
      };
    }
    case CREATE_HUMAN_SUCCESS: {
      return {
        ...state,
        data: [data, ...state.list],
        creating: false,
      };
    }
    case CREATE_HUMAN_ERROR: {
      return {
        ...state,
        error: err,
        creating: false,
      };
    }
    case GET_HUMAN_DETAIL_BEGIN: {
      return {
        ...state,
        loadingDetail: true,
      };
    }
    case GET_HUMAN_DETAIL_SUCCESS: {
      return {
        ...state,
        details: data,
        loadingDetail: false,
      };
    }
    case DELETE_HUMAN_BEGIN: {
      return {
        ...state,
        deleting: true,
      };
    }
    case DELETE_HUMAN_SUCCESS: {
      return {
        ...state,
        list: state.list.filter((item) => item.id === parseInt(data)),
        deleting: false,
      };
    }
    case DELETE_HUMAN_ERROR: {
      return {
        ...state,
        error: err,
        deleting: false,
      };
    }
    default:
      return state;
  }
};

export default humanReducer;
