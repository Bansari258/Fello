import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: ''
    });

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(login(formData));

        if (login.fulfilled.match(result)) {
            toast.success('Login successful!');
            navigate('/');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100">
                <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
                    <Card className="shadow-lg">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary">
                                    <i className="bi bi-chat-heart-fill me-2"></i>
                                    Fello
                                </h2>
                                <p className="text-muted">Welcome back! Please login to your account.</p>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email or Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="emailOrUsername"
                                        value={formData.emailOrUsername}
                                        onChange={handleChange}
                                        placeholder="Enter email or username"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        required
                                    />
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
                                    <span className="text-muted">Don't have an account? </span>
                                    <Link to="/register" className="text-decoration-none">Sign up</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;