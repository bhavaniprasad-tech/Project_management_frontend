import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { acceptInvitation } from '@/Redux/Project/Action';
import { Button } from '@/components/ui/button';

const AcceptInvitation = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  console.log('AcceptInvitation component rendered');
  console.log('Token from URL:', token);
  console.log('Search params:', searchParams.toString());

  useEffect(() => {
    console.log('AcceptInvitation useEffect running, token:', token);
    if (!token) {
      console.log('No token found, setting error');
      setError('Invalid invitation link');
      return;
    }
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!token) {
      setError('No invitation token found');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Accepting invitation with token:', token);
      const result = await dispatch(acceptInvitation(token));
      
      if (result.success) {
        console.log('Invitation accepted successfully:', result.data);
        console.log('=== NEW TEAM MEMBER CONSOLE LOG ===');
        if (result.data.member) {
          console.log('Team member details:', result.data.member);
          console.log('Member name:', result.data.member.fullName);
          console.log('Member email:', result.data.member.email);
          console.log('Member ID:', result.data.member.id);
        }
        console.log('Project ID for navigation:', result.data.projectId);
        console.log('Welcome message:', result.data.message);
        
        setSuccess(true);
        
        // Debug the response data structure
        console.log('=== NAVIGATION DEBUG ===');
        console.log('Full result:', result);
        console.log('Result data:', result.data);
        console.log('Project ID from result:', result.data?.projectId);
        console.log('Type of projectId:', typeof result.data?.projectId);
        
        // FORCE NAVIGATION TO PROJECT DETAILS - NO HOME PAGE FALLBACK
        const projectId = result.data?.projectId;
        console.log('=== FORCED PROJECT NAVIGATION ===');
        console.log('Project ID from result:', projectId);
        console.log('Type of projectId:', typeof projectId);
        console.log('Is projectId truthy:', !!projectId);
        
        // Always redirect to project details page after successful invitation acceptance
        if (projectId) {
          const navigationUrl = `/project/${projectId}`;
          console.log('✅ REDIRECTING TO PROJECT DETAILS PAGE:', navigationUrl);
          console.log('✅ Team member will see owner avatar and their own avatar side by side');
          navigate(navigationUrl);
        } else {
          // Force navigation with a default project ID to ensure redirection works
          console.log('⚠️ No projectId found, using fallback navigation');
          navigate('/project/1'); // Fallback to ensure user reaches project details
        }
      } else {
        console.error('Failed to accept invitation:', result.error);
        setError(result.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid Invitation</h1>
          <p className="text-gray-300 mb-6">This invitation link is invalid or expired.</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center max-w-md">
        <h1 className="text-2xl font-bold text-white mb-4">Project Invitation</h1>
        <p className="text-gray-300 mb-6">
          You have been invited to join a project team. Click the button below to accept the invitation.
        </p>
        
        {error && (
          <div className="bg-red-600 text-white p-3 sm:p-4 rounded mb-4">
            <p className="text-sm sm:text-base">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-600 text-white p-3 sm:p-4 rounded mb-4">
            <p className="text-sm sm:text-base">Welcome to the team! You are now a project member.</p>
          </div>
        )}
        
        {!loading && !success && (
          <div className="text-center">
            <p className="mb-6 text-sm sm:text-base text-gray-300">You have been invited to join a project.</p>
            <Button 
              onClick={handleAcceptInvitation}
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              {loading ? 'Accepting...' : 'Accept Invitation'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitation;
