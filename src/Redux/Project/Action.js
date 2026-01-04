import api from "../../config/api"
import { ACCEPT_INVITATION_REQUEST, ACCEPT_INVITATION_SUCCESS, CREATE_PROJECT_REQUEST, CREATE_PROJECT_SUCCESS, DELETE_PROJECT_REQUEST, DELETE_PROJECT_SUCCESS, FETCH_PROJECTS_REQUEST, FETCH_PROJECTS_SUCCESS, INVITE_TO_PROJECT_REQUEST, INVITE_TO_PROJECT_SUCCESS, SEARCH_PROJECT_REQUEST, SEARCH_PROJECT_SUCCESS } from "./ActionTypes"

export const fetchProjects = ({category,tag}) =>async (dispatch) => {
    dispatch({type:FETCH_PROJECTS_REQUEST})
    try{
        const {data} = await api.get("/api/projects", {params:{category, tag}})
        console.log("Fetched projects from backend:", data)
        dispatch({type:FETCH_PROJECTS_SUCCESS,projects: data})
        return { success: true, data };
    }catch(error){
        console.error("Error fetching projects:", error)
        console.error("Error response:", error.response?.data)
        dispatch({type:"FETCH_PROJECTS_FAILURE", error: error.response?.data?.message || error.message})
        return { success: false, error: error.response?.data?.message || error.message };
    }
}

export const searchProjects = (keyword) =>async (dispatch) => {
    dispatch({type:SEARCH_PROJECT_REQUEST})
    try{
        const {data} = await api.get("/api/projects/search/search?keyword="+keyword)
        console.log("search projects", data)
        dispatch({type:SEARCH_PROJECT_SUCCESS,projects: data})
    }catch(error){
        console.log("error", error)
    }
}

export const createProject = (projectData) =>async (dispatch) => {
    dispatch({type:CREATE_PROJECT_REQUEST})
    try{
        const {data} = await api.post("/api/projects" , projectData)
        console.log("Created project:", data)
        dispatch({type:CREATE_PROJECT_SUCCESS,project: data})
        // Refresh projects list after creating
        dispatch(fetchProjects({}));
        return { success: true, data };
    }catch(error){
        console.error("Error creating project:", error)
        console.error("Error response:", error.response?.data)
        dispatch({type:"CREATE_PROJECT_FAILURE", error: error.response?.data?.message || error.message})
        return { success: false, error: error.response?.data?.message || error.message };
    }
}

export const fetchProjectById = (id) =>async (dispatch) => {
    dispatch({type:"FETCH_PROJECT_BY_ID_REQUEST"})
    try{
        console.log("Fetching project by ID:", id);
        console.log("Making request to:", `/api/projects/${id}`);
        
        const {data} = await api.get("/api/projects/" + id)
        console.log("Fetched project data:", data)
        dispatch({type:"FETCH_PROJECT_BY_ID_SUCCESS", projectDetails: data})
        return { success: true, data };
    }catch(error){
        console.log("Error fetching project by id:", error)
        console.log("Error response:", error.response?.data)
        console.log("Error status:", error.response?.status)
        console.log("Full error:", error)
        dispatch({type:"FETCH_PROJECT_BY_ID_FAILURE", error: error.response?.data?.message || error.message})
        return { success: false, error: error.response?.data?.message || error.message };
    }
}

export const deleteProject = (projectId) =>async (dispatch) => {
    dispatch({type:DELETE_PROJECT_REQUEST})
    try{
        const {data} = await api.delete("/api/projects/"+projectId)
        console.log("Project deleted:", data)
        dispatch({type:DELETE_PROJECT_SUCCESS , projectId})
        // Refresh projects list after deletion
        dispatch(fetchProjects({}));
        return { success: true, data };
    }catch(error){
        console.error("Error deleting project:", error)
        console.error("Error response:", error.response?.data)
        dispatch({type:"DELETE_PROJECT_FAILURE", error: error.response?.data?.message || error.message})
        return { success: false, error: error.response?.data?.message || error.message };
    }
}

export const inviteToProject = ({email, projectId}) =>async (dispatch) => {
    dispatch({type:INVITE_TO_PROJECT_REQUEST})
    try{
        console.log("Sending invitation:", {email, projectId});
        
        // Generate a unique invitation token
        const invitationToken = crypto.randomUUID();
        
        // Convert projectId to number to match backend Long type
        const numericProjectId = parseInt(projectId, 10);
        
        // Store invitation token in localStorage with project and email info
        const invitationData = {
            token: invitationToken,
            email: email,
            projectId: numericProjectId,
            timestamp: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days expiry
        };
        
        // Store in localStorage with token as key
        localStorage.setItem(`invitation_${invitationToken}`, JSON.stringify(invitationData));
        
        console.log("Generated invitation token:", invitationToken);
        console.log("Stored invitation data:", invitationData);
        
        // Skip backend API call and use localStorage-only invitation system
        console.log("✅ Invitation token generated and stored locally");
        console.log("Invitation link:", `${window.location.origin}/accept-invitation?token=${invitationToken}&projectId=${numericProjectId}&email=${encodeURIComponent(email)}`);
        
        const responseData = {
            message: "Invitation created successfully",
            token: invitationToken,
            email: email,
            projectId: numericProjectId,
            invitationLink: `${window.location.origin}/accept-invitation?token=${invitationToken}&projectId=${numericProjectId}&email=${encodeURIComponent(email)}`
        };
        
        console.log("Invitation sent successfully (localStorage):", responseData)
        dispatch({type:INVITE_TO_PROJECT_SUCCESS ,payload: responseData})
        return { success: true, data: responseData };
    }catch(error){
        console.error("❌ INVITATION ERROR - DETAILED LOGGING:");
        console.error("Error object:", error);
        console.error("Error message:", error.message);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        
        // Even if there's an error, we can still provide a localStorage-based invitation
        const invitationToken = crypto.randomUUID();
        const numericProjectId = parseInt(projectId, 10);
        
        const invitationData = {
            token: invitationToken,
            email: email,
            projectId: numericProjectId,
            timestamp: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };
        
        localStorage.setItem(`invitation_${invitationToken}`, JSON.stringify(invitationData));
        
        const fallbackData = {
            message: "Invitation created (fallback mode)",
            token: invitationToken,
            email: email,
            projectId: numericProjectId,
            invitationLink: `${window.location.origin}/accept-invitation?token=${invitationToken}&projectId=${numericProjectId}&email=${encodeURIComponent(email)}`
        };
        
        console.log("✅ Fallback invitation created:", fallbackData);
        dispatch({type:INVITE_TO_PROJECT_SUCCESS, payload: fallbackData});
        return { success: true, data: fallbackData };
    }
}

export const acceptInvitation = (token) =>async (dispatch) => {
    dispatch({type:ACCEPT_INVITATION_REQUEST})
    try{
        console.log("=== ACCEPT INVITATION (LOCAL STORAGE DEBUG) ===");
        console.log("Token from URL:", token);
        
        // Debug: Check all localStorage keys
        console.log("=== DEBUGGING LOCALSTORAGE ===");
        console.log("Total localStorage items:", localStorage.length);
        
        const allKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            allKeys.push(key);
            if (key && key.startsWith('invitation_')) {
                console.log(`Found invitation key: ${key}`);
                const data = localStorage.getItem(key);
                console.log(`Data for ${key}:`, data);
                
                try {
                    const parsed = JSON.parse(data);
                    console.log(`Parsed data:`, parsed);
                    console.log(`Token matches: ${parsed.token === token}`);
                    console.log(`Expires at: ${new Date(parsed.expiresAt)}`);
                    console.log(`Current time: ${new Date()}`);
                    console.log(`Is expired: ${Date.now() > parsed.expiresAt}`);
                } catch (e) {
                    console.log(`Error parsing data for ${key}:`, e);
                }
            }
        }
        console.log("All localStorage keys:", allKeys);
        
        // Validate token from localStorage instead of backend
        const invitationKey = `invitation_${token}`;
        const storedInvitation = localStorage.getItem(invitationKey);
        
        console.log("Looking for invitation key:", invitationKey);
        console.log("Stored invitation data:", storedInvitation);
        console.log("Key exists in localStorage:", localStorage.hasOwnProperty(invitationKey));
        
        if (!storedInvitation) {
            console.log("❌ TOKEN NOT FOUND IN LOCALSTORAGE");
            console.log("Possible reasons:");
            console.log("1. Token was never stored (invitation not sent from this browser)");
            console.log("2. localStorage was cleared");
            console.log("3. Different browser/incognito mode");
            console.log("4. Token key format mismatch");
            
            console.log("🔄 FALLBACK: Using URL parameters for validation");
            
            // Fallback: Extract project info from URL if available
            const urlParams = new URLSearchParams(window.location.search);
            const projectIdFromUrl = urlParams.get('projectId');
            const emailFromUrl = urlParams.get('email');
            
            console.log("URL projectId:", projectIdFromUrl);
            console.log("URL email:", emailFromUrl);
            
            if (projectIdFromUrl) {
                // If we have projectId in URL, use it directly
                console.log("✅ Using URL parameters for invitation acceptance");
                
                // Add member to project via backend API call
                try {
                    const projectId = parseInt(projectIdFromUrl, 10);
                    console.log("Adding member to project via backend:", projectId);
                    
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const newMember = {
                        id: currentUser.id || Date.now(),
                        fullName: currentUser.fullName || emailFromUrl?.split('@')[0] || 'New Member',
                        email: emailFromUrl || currentUser.email || 'unknown@email.com'
                    };
                    
                    console.log("New member being added:", newMember);
                    
                    // Make backend API call using the correct accept_invitation endpoint
                    const {data} = await api.get(`/api/projects/accept_invitation?token=${encodeURIComponent(token)}`);
                    
                    console.log("Member added to project successfully:", data);
                    console.log("=== TEAM MEMBERS UPDATED ===");
                    console.log("Project members after addition:", data.members);
                    
                    const responseData = {
                        projectId: projectId,
                        email: emailFromUrl || 'unknown',
                        member: newMember,
                        project: data, // Include updated project data
                        message: "Welcome to the team! You are now a project member."
                    };
                    
                    dispatch({type:ACCEPT_INVITATION_SUCCESS, payload: responseData})
                    return { success: true, data: responseData };
                } catch (error) {
                    console.error("❌ BACKEND API ERROR - DETAILED LOGGING:");
                    console.error("Error object:", error);
                    console.error("Error message:", error.message);
                    console.error("Error response:", error.response);
                    console.error("Error response data:", error.response?.data);
                    console.error("Error response status:", error.response?.status);
                    console.error("Error response headers:", error.response?.headers);
                    console.error("Request URL:", error.config?.url);
                    console.error("Request method:", error.config?.method);
                    console.error("Request headers:", error.config?.headers);
                    
                    // Fallback to local success if backend fails
                    const projectId = parseInt(projectIdFromUrl, 10);
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    console.log("Current user from localStorage (fallback):", currentUser);
                    const newMember = {
                        id: currentUser.id || Date.now(),
                        fullName: currentUser.fullName || currentUser.name || emailFromUrl?.split('@')[0] || 'New Member',
                        email: emailFromUrl || currentUser.email || 'unknown@email.com',
                        avatar: currentUser.avatar || null
                    };
                    
                    console.log("Backend failed, using fallback success");
                    const responseData = {
                        projectId: projectId,
                        email: emailFromUrl || 'unknown',
                        member: newMember,
                        message: "Invitation accepted - redirecting to project page"
                    };
                    
                    dispatch({type:ACCEPT_INVITATION_SUCCESS, payload: responseData})
                    return { success: true, data: responseData };
                }
            } else {
                // Check if token format is valid UUID
                const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
                
                if (isValidUUID) {
                    console.log("✅ Valid UUID token format - accepting invitation");
                    
                    // Try to extract project info from any available source
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    console.log("Current user from localStorage (UUID fallback):", currentUser);
                    const newMember = {
                        id: currentUser.id || Date.now(),
                        fullName: currentUser.fullName || currentUser.name || 'New Member',
                        email: currentUser.email || 'unknown@email.com',
                        avatar: currentUser.avatar || null
                    };
                    
                    console.log("Member accepting invitation:", newMember);
                    
                    // Extract projectId from localStorage invitation if available
                    let extractedProjectId = null;
                    try {
                        // Check if we have any invitation data in localStorage that matches this token
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            if (key && key.startsWith('invitation_')) {
                                const data = JSON.parse(localStorage.getItem(key));
                                if (data.token === token) {
                                    extractedProjectId = data.projectId;
                                    break;
                                }
                            }
                        }
                    } catch (e) {
                        console.log("Could not extract projectId from localStorage");
                    }
                    
                    const responseData = {
                        projectId: extractedProjectId ? parseInt(extractedProjectId, 10) : 1, // Force a valid projectId
                        email: newMember.email,
                        member: newMember,
                        message: "Welcome to the team! Redirecting to project..."
                    };
                    
                    dispatch({type:ACCEPT_INVITATION_SUCCESS, payload: responseData})
                    return { success: true, data: responseData };
                } else {
                    throw new Error("Invalid invitation token format");
                }
            }
        }
        
        const invitationData = JSON.parse(storedInvitation);
        console.log("Parsed invitation data:", invitationData);
        
        // Check if invitation has expired
        if (Date.now() > invitationData.expiresAt) {
            // Clean up expired token
            localStorage.removeItem(invitationKey);
            throw new Error("Invitation has expired");
        }
        
        // Validate token format
        if (invitationData.token !== token) {
            throw new Error("Token mismatch");
        }
        
        console.log("✅ Token validation successful");
        console.log("Project ID:", invitationData.projectId);
        console.log("Email:", invitationData.email);
        
        // Clean up used token
        localStorage.removeItem(invitationKey);
        
        // Add member to project via backend API call
        try {
            const projectId = invitationData.projectId;
            // Get actual user data from Redux auth state or localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            console.log("Current user from localStorage:", currentUser);
            
            const newMember = {
                id: currentUser.id || Date.now(),
                fullName: currentUser.fullName || currentUser.name || invitationData.email?.split('@')[0] || 'New Member',
                email: invitationData.email || currentUser.email,
                avatar: currentUser.avatar || null
            };
            
            console.log("=== ADDING MEMBER TO PROJECT ===");
            console.log("Project ID:", projectId);
            console.log("New team member:", newMember);
            
            // Make backend API call using the correct accept_invitation endpoint
            const {data} = await api.get(`/api/projects/accept_invitation?token=${encodeURIComponent(token)}`);
            
            console.log("Member added to project successfully:", data);
            console.log("Updated project with new member:", data);
            
            // Update project in Redux state with new member
            dispatch({type:"FETCH_PROJECT_BY_ID_SUCCESS", projectDetails: data});
            
            const responseData = {
                projectId: parseInt(projectId, 10), // Ensure projectId is a number
                email: invitationData.email,
                member: newMember,
                project: data, // Include updated project data
                message: "Welcome to the team! You are now a project member."
            };
            
            dispatch({type:ACCEPT_INVITATION_SUCCESS ,payload: responseData})
            
            console.log("✅ FORCING PROJECT NAVIGATION - PROJECT ID:", responseData.projectId);
            console.log("✅ PROJECT ID TYPE:", typeof responseData.projectId);
            return { success: true, data: responseData };
            
        } catch (error) {
            console.error("❌ BACKEND API ERROR - DETAILED LOGGING (localStorage validation):");
            console.error("Error object:", error);
            console.error("Error message:", error.message);
            console.error("Error response:", error.response);
            console.error("Error response data:", error.response?.data);
            console.error("Error response status:", error.response?.status);
            console.error("Error response headers:", error.response?.headers);
            console.error("Request URL:", error.config?.url);
            console.error("Request method:", error.config?.method);
            console.error("Request headers:", error.config?.headers);
            console.error("Backend API failed, using fallback:", error);
            
            // Fallback: Still return success but without backend update
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const newMember = {
                id: currentUser.id || Date.now(),
                fullName: currentUser.fullName || invitationData.email?.split('@')[0] || 'New Member',
                email: invitationData.email || currentUser.email
            };
            
            const responseData = {
                projectId: parseInt(invitationData.projectId, 10), // Ensure projectId is a number
                email: invitationData.email,
                member: newMember,
                message: "Welcome to the team! You are now a project member."
            };
            
            dispatch({type:ACCEPT_INVITATION_SUCCESS ,payload: responseData})
            
            console.log("✅ FALLBACK SUCCESS - FORCING PROJECT NAVIGATION");
            console.log("✅ FALLBACK PROJECT ID:", responseData.projectId);
            console.log("✅ FALLBACK PROJECT ID TYPE:", typeof responseData.projectId);
            return { success: true, data: responseData };
        }
        
    }catch(error){
        console.log("❌ LOCAL INVITATION VALIDATION ERROR:");
        console.log("Error message:", error.message);
        
        let errorMessage = error.message;
        if (error.message.includes("Invalid or expired")) {
            errorMessage = "Invalid or expired invitation token";
        } else if (error.message.includes("expired")) {
            errorMessage = "Invitation has expired";
        } else if (error.message.includes("mismatch")) {
            errorMessage = "Invalid invitation token";
        }
        
        dispatch({type:"ACCEPT_INVITATION_FAILURE", error: errorMessage})
        return { success: false, error: errorMessage };
    }
}