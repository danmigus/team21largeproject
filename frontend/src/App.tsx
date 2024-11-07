//import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import ResendPage from './pages/ResendPage';
import AnalyzePage from './pages/AnalyzePage';
import RootLayout from "./layouts/root/RootLayout.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login routes */}
        <Route index element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/resend" element={<ResendPage />} />

        {/* Authenticated/user routes */}
        <Route path="/" element={<RootLayout />}>
          <Route path="/cards" element={<CardPage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

