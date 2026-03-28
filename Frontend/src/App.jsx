import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext"; 

import Loading from "./components/Loading";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      <ThemeProvider> 

        {loading && <Loading onFinish={() => setLoading(false)} />}

        {!loading && (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        )}

      </ThemeProvider>
    </BrowserRouter>
  );
}