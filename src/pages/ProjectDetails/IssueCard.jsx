import { Card, CardHeader, CardTitle , CardContent} from "../../components/ui/card";
import { DropdownMenu, DropdownMenuTrigger , DropdownMenuContent, DropdownMenuItem} from '../../components/ui/dropdown-menu';
import { Button } from "../../components/ui/button";    
import { DotsVerticalIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from "@/components/ui/badge"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteIssue, updateIssueStatus, fetchIssues, assignedUserToIssue } from '../../Redux/Issue/Action';
import CreateCommentForm from "../IssueDetails/CreateCommentForm";
import CommentCard from "../IssueDetails/CommentCard";
import { useState } from "react";

const IssueCard = ({ issue, projectId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showComments, setShowComments] = useState(false);
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

    const handleStatusChange = async (newStatus) => {
        console.log(`\n=== UPDATING ISSUE STATUS ===`);
        console.log("Issue ID:", issue.id);
        console.log("Issue Title:", issue.title);
        console.log("Current Status:", issue.status);
        console.log("New Status:", newStatus);
        console.log("Project ID:", projectId);
        
        try {
            const result = await dispatch(updateIssueStatus(issue.id, newStatus));
            console.log("Status update result:", result);
            
            // Refresh issues after status update
            dispatch(fetchIssues(projectId));
            console.log("Issues refreshed after status update");
        } catch (error) {
            console.error("Error updating issue status:", error);
        }
    };

    const handleIssueClick = () => {
        navigate(`/Project/${projectId}/issue/${issue.id}`);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleDeleteIssue = async () => {
        console.log(`\n=== DELETING ISSUE ===`);
        console.log("Issue ID:", issue.id);
        console.log("Issue Title:", issue.title);
        console.log("Issue Details:", issue);
        console.log("Project ID:", projectId);
        
        try {
            const result = await dispatch(deleteIssue(issue.id));
            console.log("Delete result:", result);
            
            // Refresh issues after deletion
            dispatch(fetchIssues(projectId));
            console.log("Issues refreshed after deletion");
        } catch (error) {
            console.error("Error deleting issue:", error);
        }
    };

    const handleEditIssue = () => {
        console.log(`\n=== EDITING ISSUE ===`);
        console.log("Issue ID:", issue.id);
        console.log("Issue Title:", issue.title);
        console.log("Issue Details:", issue);
        console.log("Navigating to issue details for editing...");
        
        // Navigate to issue details page for editing
        navigate(`/Project/${projectId}/issue/${issue.id}`);
    };

    const handleAssignUser = async (userId) => {
        console.log("=== ASSIGNING ISSUE TO TEAM MEMBER ===");
        console.log("Issue:", issue.title);
        console.log("Assignee ID:", userId);
        
        const assignedMember = teamMembers.find(member => member.id === userId);
        console.log("Assigned to:", assignedMember?.fullName || 'Unknown Member');
        console.log("Member role:", assignedMember?.role || 'Unknown');
        
        try {
            const result = await dispatch(assignedUserToIssue(issue.id, userId));
            console.log("✅ Issue assignment successful");
            console.log("✅ Assignment visible to all team members");
            
            // Refresh issues after assignment
            dispatch(fetchIssues(projectId));
            setShowAssigneeDropdown(false);
        } catch (error) {
            console.error("Error assigning user:", error);
        }
    };

    // Get actual team members from project details and localStorage
    const { project } = useSelector(store => store);
    const { projectDetails } = project || {};
    
    const getTeamMembers = () => {
        const members = [];
        
        // Add project owner
        if (projectDetails?.owner) {
            members.push({
                id: projectDetails.owner.id,
                name: projectDetails.owner.fullName || projectDetails.owner.name,
                fullName: projectDetails.owner.fullName || projectDetails.owner.name,
                email: projectDetails.owner.email,
                role: 'owner'
            });
        }
        
        // Add project members
        if (projectDetails?.members && projectDetails.members.length > 0) {
            projectDetails.members.forEach(member => {
                members.push({
                    id: member.id,
                    name: member.fullName || member.name,
                    fullName: member.fullName || member.name,
                    email: member.email,
                    role: 'member'
                });
            });
        }
        
        // Add current user if not already in the list (for invited members)
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.id && !members.find(m => m.id === currentUser.id)) {
            members.push({
                id: currentUser.id,
                name: currentUser.fullName || currentUser.name || 'Current User',
                fullName: currentUser.fullName || currentUser.name || 'Current User',
                email: currentUser.email,
                role: 'member'
            });
        }
        
        return members;
    };
    
    const teamMembers = getTeamMembers();

    return (
        <Card className="rounded-md py-1 pb-2 bg-gray text-white">
            <CardHeader className="py-0 pb-1">
                <div className="flex justify-between items-center">
                    <CardTitle className="cursor-pointer" onClick={handleIssueClick}>
                        {issue?.title || 'Issue Title'}
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="rounded-full size-icon hover:text-white w-2" variant="ghost">
                                <DotsVerticalIcon/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-600 text-white">
                            <DropdownMenuItem onClick={() => handleStatusChange('pending')} className="hover:bg-gray-700 cursor-pointer">
                                Move to Todo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('in_progress')} className="hover:bg-gray-700 cursor-pointer">
                                Move to In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('done')} className="hover:bg-gray-700 cursor-pointer">
                                Move to Done
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEditIssue} className="hover:bg-gray-700 cursor-pointer">
                                Edit Issue
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDeleteIssue} className="hover:bg-red-600 cursor-pointer text-red-300">
                                Delete Issue
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="py-0">
                <div className='flex items-center justify-between'>
                    <p>{issue?.issueId || `ISSUE-${issue?.id || '1'}`}</p>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={toggleComments}
                            className="w-8 h-8 bg-gray-700 text-white hover:bg-gray-600 rounded-full flex items-center justify-center p-0"
                            size="sm"
                        >
                            <ChatBubbleIcon className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2 relative">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gray-900 text-white">
                                    {issue?.assignee?.fullName?.charAt(0) || issue?.assignee?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="relative">
                                <p 
                                    className="text-sm cursor-pointer hover:text-blue-400 transition-colors"
                                    onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                                >
                                    {issue?.assignee?.fullName || issue?.assignee?.name || 'Click to assign'}
                                </p>
                                
                                {showAssigneeDropdown && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                                        <div className="p-2">
                                            <p className="text-xs text-gray-400 mb-2">Assign to:</p>
                                            {teamMembers.length > 0 ? teamMembers.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                                                    onClick={() => handleAssignUser(member.id)}
                                                >
                                                    <Avatar className="h-6 w-6 text-xs">
                                                        <AvatarFallback className={`text-white ${member.role === 'owner' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                                            {member.fullName?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{member.fullName}</span>
                                                        <span className="text-xs text-gray-400">{member.role === 'owner' ? 'Project Owner' : 'Team Member'}</span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-2 text-sm text-gray-400">
                                                    No team members available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Comments Section */}
                {showComments && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="space-y-3">
                            <CreateCommentForm issueId={issue?.id} />
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {[1, 2].map((item, index) => (
                                    <CommentCard key={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default IssueCard
