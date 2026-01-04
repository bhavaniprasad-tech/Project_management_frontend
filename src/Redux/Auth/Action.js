import api from "../../config/api";
import axios from "axios";
import { 
  GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  LOGOUT 
} from "./ActionTypes";

// Register
// ...existing code...

// Register
// ...existing code...

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    console.log('Registering user:', userData);
    
    // Create clean axios instance without interceptors for auth
    const cleanAxios = axios.create({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const response = await cleanAxios.post('/auth/signup', userData);
    const { data } = response;
    console.log('Register response:', data, 'Status:', response.status);
    
    if (data.jwt) {
      localStorage.setItem('jwt', data.jwt);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;
      dispatch({ type: REGISTER_SUCCESS, payload: data });
      console.log('Registration successful');
      return { success: true, data };
    }
    
    dispatch({ type: REGISTER_FAILURE, error: data?.message || 'Registration failed' });
    return { success: false, error: data?.message };
  } catch (error) {
    console.error('Register error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    const message = error.response?.data?.message || error.message;
    dispatch({ type: REGISTER_FAILURE, error: message });
    return { success: false, error: message };
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    console.log('Logging in user:', userData);
    
    // Clear any existing auth state
    localStorage.removeItem('jwt');
    delete api.defaults.headers.common['Authorization'];
    
    // Create clean axios instance without interceptors for auth
    const cleanAxios = axios.create({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const response = await cleanAxios.post('/auth/signing', userData);
    const { data } = response;
    console.log('Login response:', data, 'Status:', response.status);
    
    if (data && data.jwt) {
      localStorage.setItem('jwt', data.jwt);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;
      dispatch({ type: LOGIN_SUCCESS, payload: data });
      console.log('Login successful');
      return { success: true, data };
    }
    
    const errorMessage = data?.message || 'Login failed - no JWT received';
    dispatch({ type: LOGIN_FAILURE, error: errorMessage });
    return { success: false, error: errorMessage };
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    let errorMessage = 'Login failed';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage = 'Invalid email or password';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error - please check if backend is running';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      errorMessage = 'Cannot connect to server - check if backend is running on port 8080';
    } else {
      errorMessage = error.message || 'Network error';
    }
    
    dispatch({ type: LOGIN_FAILURE, error: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      dispatch({ type: GET_USER_FAILURE, error: 'No token' });
      return { success: false, error: 'No token' };
    }
    
    // Make sure Authorization header is set
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const { data } = await api.get('/api/users/profile');
    console.log('User profile response:', data);
    
    if (data) {
      dispatch({ type: GET_USER_SUCCESS, payload: data });
      console.log('User data saved to Redux:', data);
      return { success: true, data };
    }
    dispatch({ type: GET_USER_FAILURE, error: 'No user data' });
    return { success: false, error: 'No user data' };
  } catch (error) {
    console.error('Get user error:', error);
    console.error('Error response:', error.response?.data);
    // If 401, clear token and let user re-login
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt');
      delete api.defaults.headers.common['Authorization'];
    }
    dispatch({ type: GET_USER_FAILURE, error: error.response?.data?.message || error.message });
    return { success: false, error: error.response?.data?.message || error.message, status: error.response?.status };
  }
};

// ...existing code...
// Logout
export const logout = () => (dispatch) => {
  localStorage.clear();
  dispatch({ type: LOGOUT });
};
