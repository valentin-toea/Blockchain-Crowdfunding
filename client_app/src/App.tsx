import React, { useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Account from "./pages/Account/Account";
import Home from "./pages/Home/Home";
import "./App.scss";
import Layout from "./layout/Layout";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { getUserProfile, selectUser, setUser } from "./slices/userSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { supabase } from "./supabaseClient";
import CreateProjectPage from "./pages/CreateProject/CreateProjectPage";
import WalletPage from "./pages/Account/Wallet/WalletPage";
import ProfilePage from "./pages/Account/Profile/ProfilePage";
import Project from "./pages/Project/Project";
import CreatorDashboardLayout from "./creator-dashboard/layout/CreatorDashboardLayout";
import CreatorDashboardHome from "./creator-dashboard/pages/CreatorDashboardHome";
import CreatorDashboardProjects from "./creator-dashboard/pages/CreatorDashboardProjects";
import CreatorDashboardProjectPage from "./creator-dashboard/pages/CreatorDashboardProjectPage";
import Profile from "./pages/Profile/Profile";
import Projects from "./pages/Projects/Projects";

const App = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const session = supabase.auth.session();
    dispatch(setUser(session?.user ?? null));
    session?.user && dispatch(getUserProfile((session.user as any).id));

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const currentUser = session?.user;
        dispatch(setUser(currentUser ?? null));
        currentUser && dispatch(getUserProfile((currentUser as any).id));
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [dispatch]);

  if (user?.logged === false) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Projects />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/profile/:id" element={<Profile />} />

        <Route element={user ? <Outlet /> : <Navigate to="/login" />}>
          <Route path="/account" element={<Account />}>
            <Route path="wallet" element={<WalletPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="/*" element={<div>not found</div>} />
      </Route>
      <Route
        path="/create-project"
        element={user ? <CreateProjectPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/creator-dashboard"
        element={
          user ? (
            <CreatorDashboardLayout>
              <Outlet />
            </CreatorDashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route
          path="edit-project/:id/:projectName"
          element={<CreateProjectPage editMode />}
        />
        <Route path="" element={<Navigate to="projects" />} />
        <Route path="projects" element={<CreatorDashboardProjects />} />
        <Route path="projects/:id" element={<CreatorDashboardProjectPage />} />
        <Route path="*" element={<div>not found</div>} />
      </Route>
    </Routes>
  );
};

export default App;
