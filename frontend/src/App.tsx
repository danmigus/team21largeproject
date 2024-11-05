//import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import ResendPage from './pages/ResendPage';
import AnalyzePage from './pages/AnalyzePage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/cards" element={<CardPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/resend" element={<ResendPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;

