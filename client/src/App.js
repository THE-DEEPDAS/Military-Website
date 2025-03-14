import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./helpers/ErrorBoundary";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import Search from "./components/Search";
import SkillExchange from "./components/SkillExchange";
import Notifications from "./components/Notifications";
import Home from "./components/Home";

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute component={Profile} />}
          />
          <Route path="/search" element={<PrivateRoute component={Search} />} />
          <Route
            path="/skill-exchange"
            element={<PrivateRoute component={SkillExchange} />}
          />
          <Route
            path="/notifications"
            element={<PrivateRoute component={Notifications} />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
