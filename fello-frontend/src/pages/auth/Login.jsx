import { clearError, loginUser } from '../../redux/slices/authSlice';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };
    return (
        <div className="auth-container">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="auth-card shadow-lg">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <h1 className="auth-logo">Fello</h1>
                                    <p className="text-muted">Welcome back! Please login to your account.</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
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

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Check type="checkbox" label="Remember me" />
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </Button>

                                    <div className="text-center">
                                        <p className="mb-0">
                                            Don't have an account?{' '}
                                            <Link to="/register" className="fw-bold">
                                                Sign up
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

export default Login
