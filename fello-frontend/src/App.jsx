import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { getCurrentUser } from './store/slices/authSlice';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import PrivateRoute from './components/PrivateRoute';
import { Spinner } from 'react-bootstrap';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    
    if (publicPaths.includes(location.pathname)) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        await dispatch(getCurrentUser()).unwrap();
      } catch (error) {
        console.log('Not authenticated:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [dispatch, location.pathname]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;