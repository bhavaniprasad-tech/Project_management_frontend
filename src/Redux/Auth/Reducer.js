import {
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
  LOGOUT
} from "./ActionTypes";

const initialState = {
  user: null,
  jwt: localStorage.getItem("jwt"),
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        jwt: action.payload.jwt,
        user: action.payload.user || null,
      };

    case GET_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
      return { ...state, loading: false, error: action.error };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};
