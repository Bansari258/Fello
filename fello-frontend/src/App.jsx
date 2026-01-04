// src/App.jsx - UPDATED
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';
import Loading from './components/Loading';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Try to fetch current user on app load
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/discover"
          element={
            <PrivateRoute>
              <DiscoverPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;