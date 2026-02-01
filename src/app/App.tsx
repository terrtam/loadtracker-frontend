/* Routing structure of app, with public and auth-protected routes. */

import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../shared/auth/ProtectedRoute";
import ProtectedLayout from "../shared/layout/ProtectedLayout";

import Entry from "../pages/Entry";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AccountSettings from "../pages/AccountSettings";
import LogSession from "../pages/LogSession";
import LogWellness from "../pages/LogWellness";
import WellnessHistory from "../pages/WellnessHistory";
import SessionHistory from "../pages/SessionHistory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sessions/log" element={<LogSession />} />
          <Route path="/wellness/log" element={<LogWellness />} />
          <Route path="/wellness/history" element={<WellnessHistory />} />
          <Route path="/sessions/history" element={<SessionHistory />} /> 
          <Route path="/settings" element={<AccountSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
