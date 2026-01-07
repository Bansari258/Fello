import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar as BNavbar, Container, Nav, Form, NavDropdown, Badge } from 'react-bootstrap';
import { logout } from '../store/slices/authSlice';
import { searchUsers, clearSearchResults } from '../store/slices/userSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notifications);
    const { searchResults } = useSelector((state) => state.users);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);

    const handleLogout = async () => {
        await dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length >= 2) {
            dispatch(searchUsers(query));
            setShowSearchResults(true);
        } else {
            dispatch(clearSearchResults());
            setShowSearchResults(false);
        }
    };

    const handleSelectUser = (userId) => {
        navigate(`/profile/${userId}`);
        setSearchQuery('');
        setShowSearchResults(false);
        dispatch(clearSearchResults());
    };

    return (
        <BNavbar expand="lg" className="mb-4" sticky="top">
            <Container>
                <BNavbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    <i className="bi bi-chat-heart-fill me-2"></i>
                    Fello
                </BNavbar.Brand>

                <BNavbar.Toggle aria-controls="navbar-nav" />

                <BNavbar.Collapse id="navbar-nav">
                    <Form className="mx-auto position-relative" style={{ width: '400px', maxWidth: '100%' }}>
                        <Form.Control
                            type="search"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={handleSearch}
                            onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                        />

                        {showSearchResults && searchResults.length > 0 && (
                            <div
                                className="position-absolute bg-white border rounded shadow-sm w-100 mt-1"
                                style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}
                            >
                                {searchResults.map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-3 border-bottom cursor-pointer"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSelectUser(user._id)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=9333ea&color=fff`}
                                                alt={user.username}
                                                width="40"
                                                height="40"
                                                className="rounded-circle me-3"
                                            />
                                            <div>
                                                <div className="fw-bold">{user.fullName}</div>
                                                <small className="text-muted">@{user.username}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Form>

                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/" className="me-3">
                            <i className="bi bi-house-fill fs-5"></i>
                        </Nav.Link>

                        <Nav.Link as={Link} to="/discover" className="me-3">
                            <i className="bi bi-compass-fill fs-5"></i>
                        </Nav.Link>

                        <Nav.Link as={Link} to="/notifications" className="me-3 position-relative">
                            <i className="bi bi-bell-fill fs-5"></i>
                            {unreadCount > 0 && (
                                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle" pill>
                                    {unreadCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        <NavDropdown
                            title={
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&background=9333ea&color=fff`}
                                    alt={user?.username}
                                    width="35"
                                    height="35"
                                    className="rounded-circle"
                                />
                            }
                            align="end"
                        >
                            <NavDropdown.Item as={Link} to={`/profile/${user?._id}`}>
                                <i className="bi bi-person-fill me-2"></i>
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/profile/edit">
                                <i className="bi bi-gear-fill me-2"></i>
                                Settings
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </BNavbar.Collapse>
            </Container>
        </BNavbar>
    );
};

export default Navbar;