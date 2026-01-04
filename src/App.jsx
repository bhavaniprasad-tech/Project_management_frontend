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
import AcceptInvitation from "./pages/Invitation/AcceptInvitation";
import UpgradeSucces from "./pages/Subscription/UpgradeSucces";

import { getUser } from "./Redux/Auth/Action";
import { fetchProjects } from "./Redux/Project/Action";
import { getUserSubscription } from "./Redux/Subscription/Action";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  /* ================= LOAD USER ON REFRESH ================= */
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !auth.user) {
      dispatch(getUser());
      dispatch(fetchProjects({}));
      dispatch(getUserSubscription());
    }
  }, [dispatch, auth.user]);

  /* ================= AUTH LOGIC (FIXED) ================= */
  const isLoggedIn = Boolean(auth.jwt);

  // Show loader while async auth is running
  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  // If not logged in → show Auth page
  if (!isLoggedIn) {
    return <Auth />;
  }

  /* ================= MAIN APP ================= */
  return (
    <div className="app-container min-h-screen bg-gray-900">
      <Navbar />

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
          <Route path="/upgrade_plan/success" element={<UpgradeSucces />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          <Route path="/accept_invitation" element={<AcceptInvitation />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
