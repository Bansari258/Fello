import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { clearError, registerUser } from '../../redux/slices/authSlice';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, navigate, dispatch]);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
            setPasswordError('');
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        const { confirmPassword, ...userData } = formData;
        dispatch(registerUser(userData));
        
    };
    return (
        <div className="auth-container">
            <Container>
                <Row className="justify-content-center">
                    <Col md={7} lg={6}>
                        <Card className="auth-card shadow-lg">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <h1 className="auth-logo">Fello</h1>
                                    <p className="text-muted">Create your account and start connecting!</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                                        {error}
                                    </Alert>
                                )}

                                {passwordError && (
                                    <Alert variant="danger" dismissible onClose={() => setPasswordError('')}>
                                        {passwordError}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Full Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="fullName"
                                                    placeholder="Enter your full name"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="username"
                                                    placeholder="Choose a username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder="Create a password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="confirmPassword"
                                                    placeholder="Confirm your password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="I agree to the Terms and Conditions"
                                            required
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating account...' : 'Sign Up'}
                                    </Button>

                                    <div className="text-center">
                                        <p className="mb-0">
                                            Already have an account?{' '}
                                            <Link to="/login" className="fw-bold">
                                                Login
                                            </Link>
                                        </p>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Register
