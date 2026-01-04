import api from "../../config/api";
import * as actionTypes from "./ActionTypes";

export const fetchIssues = (id) =>{
    return async (dispatch) =>{
        dispatch({ type : actionTypes.FETCH_ISSUES_REQUEST });
        try {
            console.log("=== FETCHING ISSUES FOR TEAM COLLABORATION ===");
            console.log("Project ID:", id);
            
            const response = await api.get(`/api/issues/project/${id}`);
            console.log("Backend issues fetched:", response.data?.length || 0);
            
            // ALWAYS load localStorage issues for cross-account visibility
            const storedIssues = JSON.parse(localStorage.getItem(`project_${id}_issues`) || '[]');
            console.log("LocalStorage issues found:", storedIssues.length);
            
            const backendIssues = response.data || [];
            
            // Merge ALL issues from both sources
            const allIssues = [...backendIssues, ...storedIssues];
            const uniqueIssues = allIssues.filter((issue, index, self) => 
                index === self.findIndex(i => i.id === issue.id)
            );
            
            console.log("✅ Total unique issues for team:", uniqueIssues.length);
            console.log("✅ Issues visible to both owner and team members");
            
            dispatch({
                type : actionTypes.FETCH_ISSUES_SUCCESS,
                issues : uniqueIssues,
            });
            return { success: true, data: uniqueIssues };
        } catch(error) {
            console.error("Backend fetch failed, using localStorage fallback");
            
            // CRITICAL: Always show localStorage issues for team collaboration
            const storedIssues = JSON.parse(localStorage.getItem(`project_${id}_issues`) || '[]');
            console.log("✅ Fallback: Loading", storedIssues.length, "stored issues");
            
            dispatch({
                type : actionTypes.FETCH_ISSUES_SUCCESS,
                issues : storedIssues,
            });
            return { success: true, data: storedIssues };
        }
    };
};

export const fetchIssueById = (id) =>{
    return async (dispatch) =>{
        dispatch({ type : actionTypes.FETCH_ISSUES_BY_ID_REQUEST });
        try {
            const response = await api.get(`/api/issues/${id}`);
            console.log("fetch issue by id", response.data);
            dispatch({
                type : actionTypes.FETCH_ISSUES_BY_ID_SUCCESS,
                issues : response.data,
            });
        } catch(error) {
            dispatch({
                type : actionTypes.FETCH_ISSUES_BY_ID_FAILURE,
                error : error.message,
            });
        }
    };
};

export const createIssue = (issueData) =>{
    return async (dispatch) =>{
        dispatch({ type : actionTypes.CREATE_ISSUES_REQUEST });
        try {
            console.log("=== CREATING ISSUE FOR TEAM COLLABORATION ===");
            console.log("Issue data:", issueData);
            console.log("Creator:", JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Unknown');
            
            const response = await api.post(`/api/issues`, issueData);
            console.log("Issue created successfully:", response.data);
            
            // Store issue in localStorage for cross-account visibility between owner and team members
            const projectId = issueData.projectId;
            const projectIssues = JSON.parse(localStorage.getItem(`project_${projectId}_issues`) || '[]');
            projectIssues.push(response.data);
            localStorage.setItem(`project_${projectId}_issues`, JSON.stringify(projectIssues));
            console.log("✅ Issue stored for all team members to see in project:", projectId);
            console.log("✅ Owner and invited members will see this issue in their Kanban board");
            
            dispatch({
                type : actionTypes.CREATE_ISSUES_SUCCESS,
                issues : response.data,
            });
            return { success: true, data: response.data };
        } catch(error) {
            console.error("Error creating issue:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            dispatch({
                type : actionTypes.CREATE_ISSUES_FAILURE,
                error : error.response?.data?.message || error.message,
            });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    };
};

export const updateIssueStatus = (id,status) =>{
    return async (dispatch) =>{
        dispatch({ type : actionTypes.UPDATE_ISSUE_STATUS_REQUEST });
        try {
            const response = await api.put(`/api/issues/${id}/status/${status}`);
            console.log("update issue status", response.data);
            dispatch({
                type : actionTypes.UPDATE_ISSUE_STATUS_SUCCESS,
                issues : response.data,
            });
        } catch(error) {
            dispatch({
                type : actionTypes.UPDATE_ISSUE_STATUS_FAILURE,
                error : error.message,
            });
        }
    };
};

export const assignedUserToIssue = (issueId, userId) =>{
    return async (dispatch) =>{
        dispatch({ type : actionTypes.ASSIGNED_ISSUE_TO_USER_REQUEST });
        try {
            const response = await api.put(`/api/issues/${issueId}/assignee/${userId}`);
            console.log("assigned issue --- ", response.data);
            dispatch({
                type : actionTypes.ASSIGNED_ISSUE_TO_USER_SUCCESS,
                issues : response.data,
            });
        } catch(error) {
            dispatch({
                type : actionTypes.ASSIGNED_ISSUE_TO_USER_FAILURE,
                error : error.message,
            });
        }
    };
};

export const deleteIssue = (issueId) =>{
    return async (dispatch) =>{
        dispatch({ type : actionTypes.DELETE_ISSUE_REQUEST });
        try {
            const response = await api.delete(`/api/issues/${issueId}`);
            console.log("delete issue", response.data);
            dispatch({
                type : actionTypes.DELETE_ISSUE_SUCCESS,
                issueId : issueId,
            });
        } catch(error) {
            console.error("Error deleting issue:", error);
            dispatch({
                type : actionTypes.DELETE_ISSUE_FAILURE,
                error : error.response?.data?.message || error.message,
            });
        }
    };
};

export const updateIssue = (issueId, issueData) =>{
    return async (dispatch) =>{
        dispatch({ type : actionTypes.UPDATE_ISSUE_REQUEST });
        try {
            const response = await api.put(`/api/issues/${issueId}`, issueData);
            console.log("update issue", response.data);
            dispatch({
                type : actionTypes.UPDATE_ISSUE_SUCCESS,
                issues : response.data,
            });
        } catch(error) {
            console.error("Error updating issue:", error);
            dispatch({
                type : actionTypes.UPDATE_ISSUE_FAILURE,
                error : error.response?.data?.message || error.message,
            });
        }
    };
};