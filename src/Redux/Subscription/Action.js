import * as types from "./ActionTypes";
import api from "../../config/api";

export const getUserSubscription = () => {
    return async (dispatch) => {
        dispatch({ type : types.GET_USER_SUBSCRIPTION_REQUEST });
        try{
            const jwt = localStorage.getItem("jwt");
            const response = await api.get("/api/subscription/user", {
                headers :{
                    "Authorization" : `Bearer ${jwt}`
                }
            });
            dispatch({
                type : types.GET_USER_SUBSCRIPTION_SUCCESS,
                payload : response.data,
            });
            console.log("users subscription ", response.data)
        } catch (error) {
            console.log("Error fetching subscription:", error)
            dispatch({
                type : types.GET_USER_SUBSCRIPTION_FAILURE,
                payload: error.message,
            });
        }
    };
};

export const upgradeSubscription = ({planType}) => {
    return async (dispatch) => {
        dispatch({ type : types.UPGRADE_SUBSCRIPTION_REQUEST });
        try{
            const response = await api.patch("/api/subscription/upgrade", null, {
               params: {
                planType : planType,
               },
            });
            dispatch({
                type : types.UPGRADE_SUBSCRIPTION_SUCCESS,
                payload : response.data,
            });
            console.log("upgraded subscription", response.data)
        } catch (error) {
            console.log(error.response.data)
            dispatch({
                type : types.UPGRADE_SUBSCRIPTION_FAILURE,
                payload: error.message,
            });
        }
    };
};