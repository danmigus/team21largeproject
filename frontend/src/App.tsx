//import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import ResendPage from './pages/ResendPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SetPasswordPage from './pages/SetPasswordPage';
import AnalyzePage from './pages/AnalyzePage';
import RootLayout from "./layouts/root/RootLayout.tsx";
import RosterBuilder from "./pages/RosterBuilder/RosterBuilder.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login routes */}
        <Route index element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/resend" element={<ResendPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/setpassword" element={<SetPasswordPage />} />

        {/* Authenticated/user routes */}
        <Route path="/" element={<RootLayout />}>
          <Route path="/cards" element={<CardPage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/roster-builder" element={<RosterBuilder />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

