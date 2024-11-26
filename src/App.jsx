// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Shopping from "./pages/ShoppingPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountSettings from "./components/userSettings/AccountSettings/AccountSettings";
import ForgotPassword from "./components/userSettings/ForgotPassword";

import "./App.css";

function App() {
  const publicRoutes = [
    { path: "/", component: <HomePage /> },
    { path: "/login", component: <Login /> },
    { path: "/register", component: <Register /> },
    { path: "/shopping", component: <Shopping /> },
    { path: "/forgot-password", component: <ForgotPassword /> }
  ];

  const protectedRoutes = [
    { path: "/profile", component: <Profile /> },
    { path: "/account-settings", component: <AccountSettings /> }
  ];

  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            {publicRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.component} />
            ))}
            {protectedRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<ProtectedRoute>{route.component}</ProtectedRoute>}
              />
            ))}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;



