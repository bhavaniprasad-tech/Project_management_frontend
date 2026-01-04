import { useParams } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateCommentForm from './CreateCommentForm';
import CommentCard from './CommentCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIssueById, updateIssueStatus, assignedUserToIssue } from '../../Redux/Issue/Action';
import { fetchComments } from '../../Redux/Comment/Action';


const IssueDetails = () => {
    const {projectId, issueId} = useParams();
    const dispatch = useDispatch();
    const { issue, auth, project, comment } = useSelector(store => store);
    const { issueDetails, loading, error } = issue || {};
    const { user } = auth || {};
    const { projectDetails } = project || {};
    const { comments } = comment || {};
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    
    useEffect(() => {
        if (issueId) {
            console.log("Fetching issue details for ID:", issueId);
            dispatch(fetchIssueById(issueId));
            dispatch(fetchComments(issueId));
        }
    }, [dispatch, issueId]);


    useEffect(() => {
        if (issueDetails) {
            console.log("=== DYNAMIC ISSUE DETAILS ===");
            console.log("Issue ID:", issueDetails.id);
            console.log("Issue Title:", issueDetails.title);
            console.log("Description:", issueDetails.description);
            console.log("Status:", issueDetails.status);
            console.log("Priority:", issueDetails.priority);
            console.log("Assignee:", issueDetails.assignee);
            console.log("Reporter:", issueDetails.reporter);
            console.log("Created Date:", issueDetails.createdDate);
            console.log("Created At:", issueDetails.createdAt);
            console.log("Due Date:", issueDetails.dueDate);
            console.log("Release Date:", issueDetails.releaseDate);
            console.log("All available fields:", Object.keys(issueDetails));
            console.log("Full Issue Object:", issueDetails);
        }
    }, [issueDetails]);
    
    const handleUpdateIssueStatus = async (status) => {
        console.log("Updating issue status to:", status);
        console.log("Issue ID:", issueId);
        console.log("Project ID:", projectId);
        
        try {
            const result = await dispatch(updateIssueStatus(issueId, status));
            console.log("Status update result:", result);
            
            // Refresh issue details after update
            dispatch(fetchIssueById(issueId));
        } catch (error) {
            console.error("Error updating issue status:", error);
        }
    }

    const handleAssignUser = async (userId) => {
        console.log("Assigning user to issue:", userId);
        console.log("Issue ID:", issueId);
        
        try {
            const result = await dispatch(assignedUserToIssue(issueId, userId));
            console.log("Assignment result:", result);
            
            // Refresh issue details after assignment
            dispatch(fetchIssueById(issueId));
            setShowAssigneeDropdown(false);
        } catch (error) {
            console.error("Error assigning user:", error);
        }
    }

    // Mock team members - in real app, get from project details or API
    const teamMembers = [
        { id: 1, name: "Bhavani Prasad", fullName: "Bhavani Prasad" },
        { id: 2, name: "John Doe", fullName: "John Doe" },
        { id: 3, name: "Jane Smith", fullName: "Jane Smith" },
        { id: 4, name: "Mike Johnson", fullName: "Mike Johnson" }
    ];

    const handleCommentCreated = () => {
        console.log("Comment created, refreshing comments...");
        dispatch(fetchComments(issueId));
    };

    const handleCommentDeleted = (commentId) => {
        console.log("Comment deleted:", commentId);
        dispatch(fetchComments(issueId));
    };


    if (loading) {
        return <div className="flex justify-center items-center h-screen text-white">Loading issue details...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-red-500 p-4">
                <h2 className="text-xl mb-4">Error Loading Issue</h2>
                <p>Error: {error}</p>
                <p className="mt-4 text-sm">Issue ID: {issueId}</p>
                <p className="text-sm">Project ID: {projectId}</p>
            </div>
        );
    }

    if (!issueDetails) {
        return <div className="flex justify-center items-center h-screen text-white">No issue data found...</div>;
    }
    
  return (
    <div className='px-4 sm:px-8 lg:px-20 py-4 sm:py-8 text-gray-400'>
        <div className='flex flex-col lg:flex-row justify-between border p-4 sm:p-6 lg:p-10 rounded-lg gap-6'>
            <ScrollArea className='h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full lg:w-[60%]'>
                <div>
                    <h3 className='text-base sm:text-lg font-semibold text-gray-400 break-words'>{issueDetails.title}</h3>
                    <div className='py-3 sm:py-5'>
                        <h2 className='font-semibold text-gray-400 text-sm sm:text-base'>Description</h2>
                        <p className='text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed'>{issueDetails.description}</p>
                    </div>
                    <div className='mt-3 sm:mt-5'>
                        <h3 className='pb-2 sm:pb-3 text-sm sm:text-base'>Activity</h3>
                       <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-transparent text-gray-400 rounded-lg p-1 flex-wrap gap-1 sm:space-x-2">
                            <TabsTrigger
                            value="all"
                            className="rounded-md px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm
                                        data-[state=active]:bg-gray-700 
                                        data-[state=active]:text-white 
                                        data-[state=active]:shadow-none
                                        text-gray-400"
                            >
                            All
                            </TabsTrigger>
                            <TabsTrigger
                            value="comments"
                            className="rounded-md px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm
                                        data-[state=active]:bg-gray-700 
                                        data-[state=active]:text-white 
                                        data-[state=active]:shadow-none
                                        text-gray-400"
                            >
                            Comments
                            </TabsTrigger>
                            <TabsTrigger
                            value="history"
                            className="rounded-md px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm
                                        data-[state=active]:bg-gray-700 
                                        data-[state=active]:text-white 
                                        data-[state=active]:shadow-none
                                        text-gray-400"
                            >
                            History
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">
                            all make changes to your account here
                        </TabsContent>
                         <TabsContent value="history">
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-300">Activity History</h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2 text-xs">
                                        <Avatar className="w-5 h-5">
                                            <AvatarFallback className="text-black text-xs">
                                                {user?.fullName?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-gray-300">Issue created by {user?.fullName || 'Owner'}</p>
                                            <p className="text-gray-500">
                                                {issueDetails.createdAt ? new Date(issueDetails.createdAt).toLocaleString() : 'Recently'}
                                            </p>
                                        </div>
                                    </div>
                                    {issueDetails.assignee && (
                                        <div className="flex items-start gap-2 text-xs">
                                            <Avatar className="w-5 h-5">
                                                <AvatarFallback className="text-black text-xs">A</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-gray-300">Assigned to {issueDetails.assignee.fullName || issueDetails.assignee.name}</p>
                                                <p className="text-gray-500">Recently</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                         <TabsContent value="comments">
                            <div className='mt-4 sm:mt-8 space-y-4 sm:space-y-6'>
                                <CreateCommentForm issueId={issueId} onCommentCreated={handleCommentCreated} />
                                <div className="space-y-3 sm:space-y-4">
                                    {comments && comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <CommentCard 
                                                key={comment.id} 
                                                comment={comment} 
                                                onDelete={handleCommentDeleted}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-xs sm:text-sm">No comments yet. Be the first to comment!</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                        </Tabs>

                    </div>
                </div>
            </ScrollArea>
            <div className='w-full lg:w-[30%] space-y-2 mt-6 lg:mt-0'>
                <Select onValueChange={handleUpdateIssueStatus} defaultValue={issueDetails.status}>
                    <SelectTrigger className="w-full sm:w-[180px] text-sm">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">To do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                </Select>
                <div className='border-rounded-lg'>
                    <p className='border-b py-2 sm:py-3 px-3 sm:px-5 text-sm sm:text-base'>Details</p>
                    <div className='p-3 sm:p-5'>
                        <div className='space-y-4 sm:space-y-7'>
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-10 sm:items-center'>
                                <p className='w-full sm:w-[7rem] text-xs sm:text-sm font-medium'>Issue ID</p>
                                <Badge variant="outline" className="text-white border-white text-xs px-2 py-1">
                                    {issueDetails.issueId || `ISSUE-${issueDetails.id}`}
                                </Badge>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-10 sm:items-center'>
                                <p className='w-full sm:w-[7rem] text-xs sm:text-sm font-medium'>Assignee</p>
                                <div className='flex items-center gap-2 sm:gap-3 relative'>
                                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 text-xs">
                                        <AvatarFallback className="text-black">
                                            {issueDetails.assignee?.fullName?.charAt(0) || issueDetails.assignee?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="relative">
                                        <p 
                                            className="cursor-pointer hover:text-blue-400 transition-colors text-xs sm:text-sm break-words"
                                            onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                                        >
                                            {issueDetails.assignee?.fullName || issueDetails.assignee?.name || 'Click to assign'}
                                        </p>
                                        
                                        {showAssigneeDropdown && (
                                            <div className="absolute top-full left-0 mt-2 w-40 sm:w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                                                <div className="p-2">
                                                    <p className="text-xs text-gray-400 mb-2">Assign to:</p>
                                                    {teamMembers.map((member) => (
                                                        <div
                                                            key={member.id}
                                                            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                                                            onClick={() => handleAssignUser(member.id)}
                                                        >
                                                            <Avatar className="h-5 w-5 sm:h-6 sm:w-6 text-xs">
                                                                <AvatarFallback className="text-black">
                                                                    {member.fullName.charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-xs sm:text-sm">{member.fullName}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                             <div className='flex flex-col sm:flex-row gap-2 sm:gap-10 sm:items-center'>
                                <p className='w-full sm:w-[7rem] text-xs sm:text-sm font-medium'>Labels</p>
                                <p className='text-xs sm:text-sm'>None</p>
                            </div>
                             <div className='flex flex-col sm:flex-row gap-2 sm:gap-10 sm:items-center'>
                                <p className='w-full sm:w-[7rem] text-xs sm:text-sm font-medium'>Status</p>
                                <Badge className={`${
                                    issueDetails.status === 'pending' ? 'bg-gray-500' :
                                    issueDetails.status === 'in_progress' ? 'bg-amber-500' : 
                                    'bg-green-500'
                                } text-black text-xs px-2 py-1`}>
                                    {issueDetails.status?.replace('_', ' ') || 'Unknown'}
                                </Badge>
                            </div>
                             <div className='flex flex-col sm:flex-row gap-2 sm:gap-10 sm:items-center'>
                                <p className='w-full sm:w-[7rem] text-xs sm:text-sm font-medium'>Priority</p>
                                <Badge className={`${
                                    issueDetails.priority === 'high' ? 'bg-red-500' :
                                    issueDetails.priority === 'medium' ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                } text-white text-xs px-2 py-1`}>
                                    {issueDetails.priority || 'medium'}
                                </Badge>
                            </div>
                             <div className='flex flex-col sm:flex-row gap-2 sm:gap-10 sm:items-center'>
                                <p className='w-full sm:w-[7rem] text-xs sm:text-sm font-medium'>Created</p>
                                <p className='text-xs sm:text-sm break-words'>
                                    {issueDetails.createdAt ? 
                                        new Date(issueDetails.createdAt).toLocaleString() : 
                                        issueDetails.createdDate ? 
                                            new Date(issueDetails.createdDate).toLocaleString() : 
                                            new Date().toLocaleString()
                                    }
                                </p>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-10 sm:items-center'>
                                <p className='w-full sm:w-[7rem] text-xs sm:text-sm font-medium'>Reporter</p>
                                <div className='flex items-center gap-2 sm:gap-3'>
                                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 text-xs">
                                        <AvatarFallback className="text-black">
                                            {issueDetails.reporter?.fullName?.charAt(0) || issueDetails.reporter?.name?.charAt(0) || user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'R'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className='text-xs sm:text-sm break-words'>{issueDetails.reporter?.fullName || issueDetails.reporter?.name || user?.fullName || user?.name || 'Owner'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default IssueDetails
