import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { Home, Compass, Search, Bell, User } from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <BSNavbar bg="white" expand="lg" className="shadow-sm sticky-top">
            <Container>
                <BSNavbar.Brand as={Link} to="/" style={{ fontWeight: 700, fontSize: '28px' }}>
                    Fello
                </BSNavbar.Brand>

                <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

                <BSNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link
                            as={Link}
                            to="/"
                            className="d-flex align-items-center gap-2 px-3"
                            style={{
                                color: isActive('/') ? '#FF385C' : '#6C757D',
                                fontWeight: isActive('/') ? 600 : 400
                            }}
                        >
                            <Home size={20} />
                            <span className="d-none d-lg-inline">Home</span>
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/discover"
                            className="d-flex align-items-center gap-2 px-3"
                            style={{
                                color: isActive('/discover') ? '#FF385C' : '#6C757D',
                                fontWeight: isActive('/discover') ? 600 : 400
                            }}
                        >
                            <Compass size={20} />
                            <span className="d-none d-lg-inline">Discover</span>
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/search"
                            className="d-flex align-items-center gap-2 px-3"
                            style={{
                                color: isActive('/search') ? '#FF385C' : '#6C757D',
                                fontWeight: isActive('/search') ? 600 : 400
                            }}
                        >
                            <Search size={20} />
                            <span className="d-none d-lg-inline">Search</span>
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/notifications"
                            className="d-flex align-items-center gap-2 px-3 position-relative"
                            style={{
                                color: isActive('/notifications') ? '#FF385C' : '#6C757D',
                                fontWeight: isActive('/notifications') ? 600 : 400
                            }}
                        >
                            <Bell size={20} />
                            <span className="d-none d-lg-inline">Notifications</span>
                            <Badge
                                bg="danger"
                                className="position-absolute"
                                style={{ top: '8px', right: '8px', fontSize: '10px' }}
                            >
                                3
                            </Badge>
                        </Nav.Link>
                    </Nav>

                    <Nav>
                        <NavDropdown
                            title={
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className="rounded-circle"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            background: 'linear-gradient(135deg, #FF6B86 0%, #FF385C 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {user?.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <span className="d-none d-lg-inline">{user?.username || 'Profile'}</span>
                                </div>
                            }
                            id="user-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item as={Link} to={`/profile/${user?._id}`}>
                                <User size={16} className="me-2" />
                                My Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/settings">
                                Settings
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
}

export default Navbar;