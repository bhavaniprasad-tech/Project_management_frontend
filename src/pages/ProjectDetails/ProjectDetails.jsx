import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Badge } from '../../components/ui/badge'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchIssues } from '../../Redux/Issue/Action'
import { fetchProjectById } from '../../Redux/Project/Action'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '../../components/ui/dialog'

import { Button } from '../../components/ui/button'
import { PlusIcon } from 'lucide-react'
import InviteUserForm from './InviteUserForm'
import IssueList from './IssueList'
import ChatBox from './ChatBox'

const ProjectDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { project, issue } = useSelector(store => store);
    const { projectDetails, loading: projectLoading, error: projectError } = project;
    const { issues: issuesList, loading: issuesLoading, error: issuesError } = issue || {};
    const [chatBox, setChatBox] = useState(false);

    useEffect(() => {
        dispatch(fetchProjectById(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (projectDetails) {
            const totalMembers = (projectDetails.members?.length || 0) + 1; // +1 for owner
            console.log(`=== PROJECT TEAM OVERVIEW ===`);
            console.log(`Project: "${projectDetails.name}"`);
            console.log(`Total Team Members: ${totalMembers}`);
            console.log(`Project Owner: ${projectDetails.owner?.fullName || 'Unknown'}`);
            console.log(`Additional Members: ${projectDetails.members?.length || 0}`);
            console.log('=== TEAM MEMBER DETAILS ===');
            console.log('Owner Details:', projectDetails.owner);
            if (projectDetails.members && projectDetails.members.length > 0) {
                projectDetails.members.forEach((member, index) => {
                    console.log(`Member ${index + 1}:`, {
                        name: member.fullName || member.name,
                        email: member.email,
                        id: member.id
                    });
                });
            } else {
                console.log('No additional members yet - owner only');
            }
            console.log('=== COLLABORATION FEATURES ACTIVE ===');
            console.log('✅ Real-time Chat Available');
            console.log('✅ Kanban Board (To-do, In-progress, Done)');
            console.log('✅ Issue Creation & Management');
            console.log('✅ Team Member Avatars Display');
        }
    }, [projectDetails]);

    useEffect(() => {
        if (id) {
            console.log("Fetching data for project ID:", id);
            dispatch(fetchIssues(id));
        }
    }, [dispatch, id]);

    // Console logging for all issue details - MOVED BEFORE CONDITIONAL RETURNS
    useEffect(() => {
        if (issuesList && issuesList.length > 0) {
            console.log("=== DYNAMIC ISSUES DATA ===");
            console.log("Total issues:", issuesList.length);
            
            issuesList.forEach((issue, index) => {
                console.log(`\n--- Issue ${index + 1} Details ---`);
                console.log("ID:", issue.id);
                console.log("Issue ID:", issue.issueId || `ISSUE-${issue.id}`);
                console.log("Title:", issue.title);
                console.log("Description:", issue.description);
                console.log("Status:", issue.status);
                console.log("Priority:", issue.priority);
                console.log("Assignee:", issue.assignee);
                console.log("Created Date:", issue.createdDate);
                console.log("Project ID:", issue.projectId || id);
                console.log("Full Issue Object:", issue);
            });
            
            // Log filtered issues by status
            const pending = issuesList.filter(issue => issue.status === 'pending');
            const inProgress = issuesList.filter(issue => issue.status === 'in_progress');
            const done = issuesList.filter(issue => issue.status === 'done');
            
            console.log("\n=== ISSUES BY STATUS ===");
            console.log("Pending Issues:", pending.length, pending);
            console.log("In Progress Issues:", inProgress.length, inProgress);
            console.log("Done Issues:", done.length, done);
        } else {
            console.log("No dynamic issues found - using empty arrays");
        }
    }, [issuesList, id]);

    const handleProjectInvitation = () => {

    }

    // Debug logging
    console.log('ProjectDetails Debug:', {
        projectLoading,
        issuesLoading,
        projectError,
        issuesError,
        projectDetails,
        issuesList,
        id
    });

    if (projectLoading || issuesLoading) {
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    }

    if (projectError || issuesError) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-red-500 p-4">
                <h2 className="text-xl mb-4">Error Loading Project</h2>
                <p>Project Error: {projectError}</p>
                <p>Issues Error: {issuesError}</p>
                <p className="mt-4 text-sm">Project ID: {id}</p>
                <p className="text-sm">JWT Token: {localStorage.getItem("jwt") ? "Present" : "Missing"}</p>
                <div className="mt-4 text-xs text-gray-400 bg-gray-800 p-3 rounded">
                    <p><strong>Debug Info:</strong></p>
                    <p>• Backend URL: http://localhost:8080</p>
                    <p>• Endpoint: GET /api/projects/{id}</p>
                    <p>• Check if backend server is running</p>
                    <p>• Verify project ID {id} exists in database</p>
                </div>
                <div className="flex gap-2 mt-4">
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                    <button 
                        onClick={() => navigate('/')} 
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // If no project data, show loading or error
    if (!projectDetails) {
        return <div className="flex justify-center items-center h-screen text-white">No project data found...</div>;
    }

    // Filter issues by status - use real data
    const pendingIssues = (issuesList || []).filter(issue => issue.status === 'pending');
    const inProgressIssues = (issuesList || []).filter(issue => issue.status === 'in_progress');
    const doneIssues = (issuesList || []).filter(issue => issue.status === 'done');

  return (
    <div className='mt-3 sm:mt-5 px-4 sm:px-6 lg:px-10'>
        <div className='flex flex-col lg:flex-row gap-6 pb-4'>
            <ScrollArea className='h-screen w-full lg:w-[76%] pr-4'>
                <div className='text-white-400 pb-6 lg:pb-10 w-full'>
                    <h4 className='text-lg sm:text-xl lg:text-2xl font-semibold pb-3 lg:pb-5 break-words'>{projectDetails?.name || 'Project Name'}</h4>
                    <div className='space-y-4 lg:space-y-5 pb-6 lg:pb-10 text-sm'>
                        <p className='w-full text-sm sm:text-base leading-relaxed'>{projectDetails?.description || 'Project description'}</p>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0'>
                            <p className='w-full sm:w-36 font-medium'>Project Lead:</p>
                            <p className='text-gray-300'>{(() => {
                                const ownerName = projectDetails?.owner?.fullName || projectDetails?.owner?.name;
                                console.log("=== OWNER NAME DEBUG ===");
                                console.log("Project Details Owner:", projectDetails?.owner);
                                console.log("Owner Full Name:", projectDetails?.owner?.fullName);
                                console.log("Owner Name:", projectDetails?.owner?.name);
                                console.log("Final Display Name:", ownerName);
                                return ownerName || 'Loading owner name...';
                            })()}</p>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0'>
                            <p className='w-full sm:w-36 font-medium'>Team Members:</p>
                            <div className='flex items-center flex-wrap gap-2 sm:gap-3'>
                                {/* Project Owner Avatar - Always First with Blue Background */}
                                <div className='relative'>
                                    <Avatar className='cursor-pointer' title={`${projectDetails?.owner?.fullName || 'Owner'} (Project Owner)`}>
                                        <AvatarFallback className="w-10 h-10 rounded-full border-2 border-blue-400 bg-blue-600 text-white flex items-center justify-center font-semibold">
                                            {projectDetails?.owner?.fullName?.charAt(0)?.toUpperCase() || 'O'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-gray-800' title='Owner'></div>
                                </div>
                                
                                {/* Project Members - Gray Background - Show ALL invited members */}
                                {projectDetails?.members && projectDetails.members.length > 0 ? (
                                    projectDetails.members.map((member, index)=> (
                                        <div className='relative' key={member.id || index}>
                                            <Avatar className='cursor-pointer' title={`${member.fullName || member.name || 'Member'} (Team Member)`}>
                                                <AvatarFallback className="w-10 h-10 rounded-full border-2 border-gray-400 bg-gray-500 text-white flex items-center justify-center font-semibold">
                                                    {member.fullName?.charAt(0)?.toUpperCase() || member.name?.charAt(0)?.toUpperCase() || 'M'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-800' title='Active Member'></div>
                                        </div>
                                    ))
                                ) : (
                                    // Show actual invited member avatar from localStorage
                                    (() => {
                                        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                                        const memberName = currentUser.fullName || currentUser.name || 'Member';
                                        const memberInitial = memberName.charAt(0).toUpperCase();
                                        
                                        return (
                                            <div className='relative'>
                                                <Avatar className='cursor-pointer' title={`${memberName} (Team Member)`}>
                                                    <AvatarFallback className="w-10 h-10 rounded-full border-2 border-gray-400 bg-gray-500 text-white flex items-center justify-center font-semibold">
                                                        {memberInitial}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-800' title='Active Member'></div>
                                            </div>
                                        );
                                    })()
                                )}
                                
                                {/* Team Count Display - Enhanced & Responsive */}
                                <div className='ml-2 sm:ml-3 px-2 sm:px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300'>
                                    {(() => {
                                        const memberCount = (projectDetails?.members?.length || 0) + 1;
                                        console.log(`=== TEAM MEMBER COUNT UPDATE ===`);
                                        console.log(`Total team members: ${memberCount}`);
                                        console.log(`Owner: 1, Additional members: ${projectDetails?.members?.length || 0}`);
                                        return `${memberCount} member${memberCount !== 1 ? 's' : ''}`;
                                    })()}
                                </div>
                            </div>
                            <div className='mt-3 sm:mt-0 flex justify-start sm:justify-end'>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size='sm' onClick={handleProjectInvitation} className='bg-grey text-white w-full sm:w-auto'>
                                            <span>Invite Member</span>
                                            <PlusIcon className='w-4 h-4 ml-2'/>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-gray-900 text-white">
                                        <DialogHeader>Invite User</DialogHeader>
                                        <InviteUserForm/>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0'>
                            <p className='w-full sm:w-36 font-medium'>Category:</p>
                            <p className='text-gray-300'>{projectDetails?.category || 'Category'}</p>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0'>
                            <p className='w-full sm:w-36 font-medium'>Project Lead:</p>
                            <Badge className="bg-white text-black rounded-full px-3 sm:px-5 py-1 text-xs sm:text-sm">
                                {projectDetails?.owner?.fullName || 'Project Lead'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <section>
                    <div className='flex items-center justify-between py-5 border-b'>
                        <h3 className='text-lg font-semibold'>Project Kanban Board</h3>
                        <div className='text-sm text-gray-400'>
                            Total Issues: {(pendingIssues.length + inProgressIssues.length + doneIssues.length)}
                        </div>
                    </div>
                    <div className='flex flex-col lg:flex-row gap-4 py-5'>
                        <div className='flex-1 min-w-0 lg:max-w-[32%]'>
                            <IssueList status="pending" title="To-do" issues={pendingIssues} projectId={id} />
                        </div>
                        <div className='flex-1 min-w-0 lg:max-w-[32%]'>
                            <IssueList status="in_progress" title="In Progress" issues={inProgressIssues} projectId={id} />
                        </div>
                        <div className='flex-1 min-w-0 lg:max-w-[32%]'>
                            <IssueList status="done" title="Done" issues={doneIssues} projectId={id} />
                        </div>
                    </div>
                </section>
            </ScrollArea>
            <div className='w-full lg:w-[22%] mt-6 lg:mt-0 rounded-md lg:sticky lg:right-5 lg:top-10'>
                <ChatBox/>
            </div>
        </div>
    </div>
  )
}

export default ProjectDetails
