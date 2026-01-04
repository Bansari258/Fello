// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Settings, MapPin, Calendar, Link as LinkIcon, Edit3, UserPlus, UserCheck } from 'lucide-react';

function ProfilePage() {
    const { user } = useSelector((state) => state.auth);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const userPosts = [
        { id: 1, content: 'Just finished working on a new project! 🚀', likes: 45, comments: 12, timestamp: '2 days ago' },
        { id: 2, content: 'Beautiful day for a walk in the park 🌳', likes: 32, comments: 8, timestamp: '1 week ago' }
    ];

    return (
        <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh' }}>
            {/* Cover Photo */}
            <div
                style={{
                    height: '300px',
                    background: 'linear-gradient(135deg, #FF6B86 0%, #FF385C 100%)',
                    position: 'relative'
                }}
            >
                <Container style={{ position: 'relative', height: '100%' }}>
                    <Button
                        variant="light"
                        className="position-absolute"
                        style={{ top: '20px', right: '15px' }}
                    >
                        <Edit3 size={18} className="me-2" />
                        Edit Cover
                    </Button>
                </Container>
            </div>

            <Container style={{ marginTop: '-80px', position: 'relative' }}>
                <Row>
                    <Col lg={4}>
                        <Card className="border-0 mb-3">
                            <Card.Body className="text-center pt-0">
                                {/* Profile Picture */}
                                <div
                                    className="rounded-circle mx-auto bg-white p-2 position-relative"
                                    style={{
                                        width: '160px',
                                        height: '160px',
                                        marginTop: '-80px',
                                        border: '4px solid white',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div
                                        className="rounded-circle w-100 h-100 d-flex align-items-center justify-content-center"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B86 0%, #FF385C 100%)',
                                            color: 'white',
                                            fontSize: '48px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {user?.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className="position-absolute rounded-circle"
                                        style={{ bottom: '5px', right: '5px', width: '36px', height: '36px', padding: 0 }}
                                    >
                                        <Edit3 size={16} />
                                    </Button>
                                </div>

                                <h4 className="mt-3 mb-1">{user?.fullName || 'User Name'}</h4>
                                <p className="text-muted mb-3">@{user?.username || 'username'}</p>

                                {/* Bio */}
                                <p className="mb-3">
                                    {user?.bio || '✨ Living life one post at a time | 📸 Photography enthusiast | 🌍 Explorer'}
                                </p>

                                {/* Info */}
                                <div className="text-start mb-3">
                                    <div className="d-flex align-items-center mb-2 text-muted small">
                                        <MapPin size={16} className="me-2" />
                                        San Francisco, CA
                                    </div>
                                    <div className="d-flex align-items-center mb-2 text-muted small">
                                        <Calendar size={16} className="me-2" />
                                        Joined January 2024
                                    </div>
                                    <div className="d-flex align-items-center text-muted small">
                                        <LinkIcon size={16} className="me-2" />
                                        <a href="#" style={{ color: '#FF385C' }}>portfolio.com</a>
                                    </div>
                                </div>

                                {/* Stats */}
                                <Row className="text-center mb-3">
                                    <Col xs={4}>
                                        <h5 className="mb-0">12</h5>
                                        <small className="text-muted">Posts</small>
                                    </Col>
                                    <Col xs={4}>
                                        <h5 className="mb-0">1.2K</h5>
                                        <small className="text-muted">Followers</small>
                                    </Col>
                                    <Col xs={4}>
                                        <h5 className="mb-0">345</h5>
                                        <small className="text-muted">Following</small>
                                    </Col>
                                </Row>

                                {/* Action Buttons */}
                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={() => setShowEditModal(true)}
                                    >
                                        <Settings size={18} className="me-2" />
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant={isFollowing ? "outline-primary" : "primary"}
                                        onClick={() => setIsFollowing(!isFollowing)}
                                    >
                                        {isFollowing ? (
                                            <>
                                                <UserCheck size={18} className="me-2" />
                                                Following
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus size={18} className="me-2" />
                                                Follow
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={8}>
                        <Card className="border-0">
                            <Card.Body>
                                <Tabs defaultActiveKey="posts" className="mb-3">
                                    <Tab eventKey="posts" title="Posts">
                                        {userPosts.length > 0 ? (
                                            userPosts.map(post => (
                                                <Card key={post.id} className="mb-3 border-0" style={{ backgroundColor: '#F7F7F7' }}>
                                                    <Card.Body>
                                                        <p className="mb-3">{post.content}</p>
                                                        <div className="d-flex justify-content-between text-muted small">
                                                            <span>❤️ {post.likes} likes</span>
                                                            <span>💬 {post.comments} comments</span>
                                                            <span>{post.timestamp}</span>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <p>No posts yet</p>
                                                <Button variant="primary">Create your first post</Button>
                                            </div>
                                        )}
                                    </Tab>

                                    <Tab eventKey="media" title="Media">
                                        <Row>
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <Col md={4} key={i}>
                                                    <div
                                                        className="mb-3"
                                                        style={{
                                                            height: '200px',
                                                            background: `linear-gradient(${135 + i * 30}deg, #FF6B86 0%, #FF385C 100%)`,
                                                            borderRadius: '8px',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Tab>

                                    <Tab eventKey="likes" title="Likes">
                                        <div className="text-center py-5 text-muted">
                                            <p>Liked posts will appear here</p>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Edit Profile Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" defaultValue={user?.fullName} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" defaultValue={user?.username} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                defaultValue={user?.bio}
                                placeholder="Tell us about yourself..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" placeholder="Where are you from?" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Website</Form.Label>
                            <Form.Control type="url" placeholder="https://yourwebsite.com" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setShowEditModal(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProfilePage;