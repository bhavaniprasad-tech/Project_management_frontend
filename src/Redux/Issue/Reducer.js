import * as actionTypes from "./ActionTypes"

const initialState = {
    issues: [],
    loading: false, 
    error: null,
    issueDetails: null
};

const issueReducer = (state = initialState, action) =>{
    switch(action.type) {
        case actionTypes.FETCH_ISSUES_REQUEST:
        case actionTypes.CREATE_ISSUES_REQUEST:
        case actionTypes.DELETE_ISSUE_REQUEST:
        case actionTypes.UPDATE_ISSUE_REQUEST:
        case actionTypes.FETCH_ISSUES_BY_ID_REQUEST:
        case actionTypes.UPDATE_ISSUE_STATUS_REQUEST:
        case actionTypes.ASSIGNED_ISSUE_TO_USER_REQUEST:
            return{
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.FETCH_ISSUES_SUCCESS:
            return{
                ...state,
                loading: false,
                issues: action.issues,
                error: null,
            };
        case actionTypes.FETCH_ISSUES_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                issueDetails: action.issues,
                error: null,
            };
        case actionTypes.UPDATE_ISSUE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                issues: state.issues.map((issue) =>
                    issue.id === action.issues.id ? action.issues : issue
                ),
                issueDetails: state.issueDetails?.id === action.issues.id ? action.issues : state.issueDetails,
                error: null,
            };
        case actionTypes.CREATE_ISSUES_SUCCESS:
            return{
                ...state,
                loading: false,
                issues: [...state.issues, action.issues],
                error: null,
            };
        
        case actionTypes.ASSIGNED_ISSUE_TO_USER_SUCCESS:
            return{
                ...state,
                loading: false,
                issues: state.issues.map((issue) =>
                    issue.id === action.issues.id ? action.issues : issue
                ),
                error: null,
            };
        case actionTypes.DELETE_ISSUE_SUCCESS:
            return{
                ...state,
                loading: false,
                issues: state.issues.filter((issue) => issue.id !== action.issueId),
                error: null,
            };
        case actionTypes.UPDATE_ISSUE_SUCCESS:
            return{
                ...state,
                loading: false,
                issues: state.issues.map((issue) =>
                    issue.id === action.issues.id ? action.issues : issue
                ),
                error: null,
            };
        case actionTypes.FETCH_ISSUES_FAILURE:
        case actionTypes.CREATE_ISSUES_FAILURE:
        case actionTypes.DELETE_ISSUE_FAILURE:
        case actionTypes.UPDATE_ISSUE_FAILURE:
        case actionTypes.FETCH_ISSUES_BY_ID_FAILURE:
        case actionTypes.UPDATE_ISSUE_STATUS_FAILURE:
        case actionTypes.ASSIGNED_ISSUE_TO_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export default issueReducer;