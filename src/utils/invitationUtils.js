// Utility functions for managing invitation tokens in localStorage

/**
 * Generate and store invitation token in localStorage
 * @param {string} email - Invitee email
 * @param {number} projectId - Project ID
 * @returns {string} Generated token
 */
export const generateInvitationToken = (email, projectId) => {
    const invitationToken = crypto.randomUUID();
    
    const invitationData = {
        token: invitationToken,
        email: email,
        projectId: projectId,
        timestamp: Date.now(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days expiry
    };
    
    localStorage.setItem(`invitation_${invitationToken}`, JSON.stringify(invitationData));
    
    console.log("Generated invitation token:", invitationToken);
    console.log("Stored invitation data:", invitationData);
    
    return invitationToken;
};

/**
 * Validate invitation token from localStorage
 * @param {string} token - Token to validate
 * @returns {Object} Validation result with success status and data/error
 */
export const validateInvitationToken = (token) => {
    try {
        const invitationKey = `invitation_${token}`;
        const storedInvitation = localStorage.getItem(invitationKey);
        
        if (!storedInvitation) {
            return { success: false, error: "Invalid or expired invitation token" };
        }
        
        const invitationData = JSON.parse(storedInvitation);
        
        // Check if invitation has expired
        if (Date.now() > invitationData.expiresAt) {
            localStorage.removeItem(invitationKey);
            return { success: false, error: "Invitation has expired" };
        }
        
        // Validate token format
        if (invitationData.token !== token) {
            return { success: false, error: "Invalid invitation token" };
        }
        
        return { success: true, data: invitationData };
        
    } catch (error) {
        console.error("Token validation error:", error);
        return { success: false, error: "Invalid invitation token format" };
    }
};

/**
 * Clean up invitation token from localStorage
 * @param {string} token - Token to remove
 */
export const cleanupInvitationToken = (token) => {
    const invitationKey = `invitation_${token}`;
    localStorage.removeItem(invitationKey);
    console.log("Cleaned up invitation token:", token);
};

/**
 * Get all stored invitation tokens (for debugging)
 * @returns {Array} Array of invitation data objects
 */
export const getAllInvitations = () => {
    const invitations = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('invitation_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                invitations.push(data);
            } catch (error) {
                console.error("Error parsing invitation data:", error);
            }
        }
    }
    return invitations;
};

/**
 * Clean up expired invitation tokens
 */
export const cleanupExpiredInvitations = () => {
    const now = Date.now();
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('invitation_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (now > data.expiresAt) {
                    keysToRemove.push(key);
                }
            } catch (error) {
                keysToRemove.push(key); // Remove corrupted data
            }
        }
    }
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log("Removed expired invitation:", key);
    });
    
    return keysToRemove.length;
};
