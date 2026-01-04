import api from "../../config/api";
import {
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
  LOGOUT
} from "./ActionTypes";

/* ================= REGISTER ================= */
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await api.post("/auth/signup", userData);
    localStorage.setItem("jwt", data.jwt);
    dispatch({ type: REGISTER_SUCCESS, payload: data });
    dispatch(getUser()); // 🔥 VERY IMPORTANT
    return { success: true };
  } catch (err) {
    dispatch({
      type: REGISTER_FAILURE,
      error: err.response?.data?.message || err.message,
    });
    return { success: false };
  }
};

/* ================= LOGIN ================= */
export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await api.post("/auth/login", userData);
    localStorage.setItem("jwt", data.jwt);
    dispatch({ type: LOGIN_SUCCESS, payload: data });
    dispatch(getUser()); // 🔥 VERY IMPORTANT
    return { success: true };
  } catch (err) {
    dispatch({
      type: LOGIN_FAILURE,
      error: err.response?.data?.message || "Invalid credentials",
    });
    return { success: false };
  }
};

/* ================= GET USER ================= */
export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const { data } = await api.get("/api/users/profile");
    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (err) {
    localStorage.removeItem("jwt");
    dispatch({
      type: GET_USER_FAILURE,
      error: err.response?.data?.message || err.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT });
};
