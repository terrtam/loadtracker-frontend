import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Entry from "./pages/Entry";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AccountSettings from "./pages/AccountSettings";
import LogSession from "./pages/LogSession";
import LogWellness from "./pages/LogWellness";
import WellnessHistory from "./pages/WellnessHistory";
import SessionHistory from "./pages/SessionHistory";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Entry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
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
