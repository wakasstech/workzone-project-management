import axios from "axios";
import {
  registrationStart,
  registrationEnd,
  loginStart,
  loginFailure,
  loginSuccess,
  loadSuccess,
  loadFailure,
  loadStart,
  fetchingStart,
  fetchingFinish,
  logout,
} from "../Redux/Slices/userSlice";
import { openAlert } from "../Redux/Slices/alertSlice";
import setBearer from "../Utils/setBearer";
const baseUrl = "https://taskmanagement.ranaafaqali.com/api/user/";
const baseUrlRegisterViaLink = "https://taskmanagement.ranaafaqali.com/api/user/";

export const register = async (
  { name, surname, email, password, repassword },
  dispatch
) => {
  dispatch(registrationStart());
  if (password !== repassword) {
    dispatch(
      openAlert({
        message: "Your passwords does not match!",
        severity: "error",
      })
    );
  } else {
    try {
      const res = await axios.post(`${baseUrl}register`, {
        username: name,
        // surname,
        email,
        password,
        // name,
        // surname: 'Ali',
        // email,
        // password,
      });
      dispatch(
        openAlert({
          message: res.data.message,
          severity: "success",
          nextRoute: "/login",
          duration: 1500,
        })
      );
    } catch (error) {
      dispatch(
        openAlert({
          message: error?.response?.data?.errMessage
            ? error.response.data.errMessage
            : error.message,
          severity: "error",
        })
      );
    }
  }
  dispatch(registrationEnd());
};


export const registerWithInvitation = async (
  { name, surname, email, password, repassword },
  dispatch,
  tokenInvite
) => {
  dispatch(registrationStart());
  if (password !== repassword) {
    dispatch(
      openAlert({
        message: "Your passwords does not match!",
        severity: "error",
      })
    );
  } else {
    try {
      const res = await axios.post(`${baseUrlRegisterViaLink}registerViaInvite?token=${tokenInvite}`, {
        username: name,
        surname,
        email,
        password,
      });
      dispatch(
        openAlert({
          message: res.data.message,
          severity: "success",
          nextRoute: "/login",
          duration: 1500,
        })
      );
    } catch (error) {
      dispatch(
        openAlert({
          message: error?.response?.data?.errMessage
            ? error.response.data.errMessage
            : error.message,
          severity: "error",
        })
      );
    }
  }
  dispatch(registrationEnd());
};
export const login = async ({ email, password }, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(baseUrl + "login", { email, password });
    const { user, message } = res.data;
    localStorage.setItem("token", user.token);
    setBearer(user.token);
      dispatch(loginSuccess({ user }));
    dispatch(
      openAlert({
        message,
        severity: "success",
        duration: 500,
        nextRoute: "/workspaces",
      })
    );
  } catch (error) {
    dispatch(loginFailure());
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
  }
};


export const loadUser = async (dispatch) => {
  dispatch(loadStart());
  if (!localStorage.token) return dispatch(loadFailure());
  setBearer(localStorage.token);
  try {
    const res = await axios.get(baseUrl + "get-user");
    dispatch(loadSuccess({ user: res.data }));
  } catch (error) {
    // Handle errors and dispatch logout if needed
    if (
      error.response &&
      error.response.status === 401 && // Unauthorized status code
      error.response.data &&
      error.response.data.errMessage === "Authorization token invalid"
    ) {
      // Token is invalid, dispatch logout action
      dispatch(logout());
    } else {
      dispatch(loadFailure());
    }
  }
};


export const getUserFromEmail = async (email, dispatch) => {
  dispatch(fetchingStart());
  if (!email) {
    dispatch(
      openAlert({
        message: "Please write an email to invite",
        severity: "warning",
      })
      );
      dispatch(fetchingFinish());
      return null;
    }
    
  try {
    const res = await axios.post(baseUrl + "get-user-with-email", { email });
    const userId = res.data.userId; // Extracting the user ID from the response

    dispatch(fetchingFinish());
    return res.data;
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
        ? error.response.data.errMessage
        : error.message,
        severity: "error",
      })
      );
     dispatch(fetchingFinish());
     return null;
  }
};
