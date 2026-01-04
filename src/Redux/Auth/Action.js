import axios from "axios";
import {
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
  LOGOUT
} from "./ActionTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= REGISTER ================= */
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/signup`,
      userData,
      { headers: { "Content-Type": "application/json" } }
    );

    localStorage.setItem("jwt", data.jwt);
    dispatch({ type: REGISTER_SUCCESS, payload: data });

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
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/signing`,
      userData,
      { headers: { "Content-Type": "application/json" } }
    );

    localStorage.setItem("jwt", data.jwt);
    dispatch({ type: LOGIN_SUCCESS, payload: data });

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
    const token = localStorage.getItem("jwt");

    const { data } = await axios.get(
      `${API_BASE_URL}/api/users/profile`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (err) {
    localStorage.removeItem("jwt");
    dispatch({
      type: GET_USER_FAILURE,
      error: err.response?.data?.message || err.message,
    });
  }
};

/* ================= LOGOUT ================= */
export const logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT });
};
