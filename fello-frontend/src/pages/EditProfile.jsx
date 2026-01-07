import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../store/slices/userSlice';
import { updateUser } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        bio: '',
        avatar: '',
        coverPhoto: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                fullName: user.fullName || '',
                bio: user.bio || '',
                avatar: user.avatar || '',
                coverPhoto: user.coverPhoto || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await dispatch(updateProfile(formData));

        if (updateProfile.fulfilled.match(result)) {
            dispatch(updateUser(result.payload));
            toast.success('Profile updated successfully');
            navigate(`/profile/${user._id}`);
        } else {
            toast.error(result.payload || 'Failed to update profile');
        }

        setLoading(false);
    };

    return (
        <Container className="py-4">
            <Row>
                <Col lg={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body className="p-4">
                            <h4 className="fw-bold mb-4">Edit Profile</h4>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Avatar URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleChange}
                                        placeholder="Enter avatar URL"
                                    />
                                    {formData.avatar && (
                                        <div className="mt-2">
                                            <img
                                                src={formData.avatar}
                                                alt="Avatar preview"
                                                width="80"
                                                height="80"
                                                className="rounded-circle"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${formData.fullName}&background=9333ea&color=fff`;
                                                }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Cover Photo URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="coverPhoto"
                                        value={formData.coverPhoto}
                                        onChange={handleChange}
                                        placeholder="Enter cover photo URL"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Bio</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself..."
                                        maxLength={500}
                                    />
                                    <Form.Text className="text-muted">
                                        {formData.bio.length}/500 characters
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate(`/profile/${user._id}`)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditProfile;