import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Home from "./pages/Home/Home";
import ProjectList from "./pages/ProjectList/ProjectList";
import Navbar from "./pages/Navbar/Navbar";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import IssueDetails from "./pages/IssueDetails/IssueDetails";
import Subscription from "./pages/Subscription/Subscription";
import Auth from "./pages/Auth/Auth";
import ErrorBoundary from "./components/ErrorBoundary";
import AcceptInvitation from "./pages/Invitation/AcceptInvitation";

import { getUser } from "./Redux/Auth/Action"; // ✅ corrected path
import { fetchProjects } from "./Redux/Project/Action";
import { getUserSubscription } from "./Redux/Subscription/Action";
import UpgradeSucces from "./pages/Subscription/UpgradeSucces"

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !auth.user) {
      dispatch(getUser());
      dispatch(fetchProjects({}));
      dispatch(getUserSubscription());
    }
  }, [dispatch, auth.user]);

  console.log("Auth State:", auth);

  // Check if user is logged in - handle both direct login and JWT token scenarios
  const hasJWT = Boolean(localStorage.getItem("jwt"));
  const isLoggedIn = Boolean(auth?.user);
  
  console.log("Is logged in:", isLoggedIn, "User:", auth?.user, "Loading:", auth.loading);

  // Show loading state while checking authentication
  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div>Loading...</div>
      </div>
    );
  }

  // Special handling for accept-invitation route - don't require login
  const isAcceptInvitationRoute = window.location.pathname.includes('accept');
  
  if (!isLoggedIn && !isAcceptInvitationRoute) {
    return <Auth />;
  }

  return (
    <div className="app-container min-h-screen bg-gray-900">
      {isLoggedIn && <Navbar />}
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/Project/:id" element={<ProjectDetails />} />
          <Route
            path="/Project/:projectId/issue/:issueId"
            element={<IssueDetails />}
          />
          <Route path="/upgrade_plan" element={<Subscription />} />
          <Route path="/upgrade_plan/success" element={<UpgradeSucces/>}/>
          <Route path="/accept-invitation" element={<AcceptInvitation/>}/>
          <Route path="/accept_invitation" element={<AcceptInvitation/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
