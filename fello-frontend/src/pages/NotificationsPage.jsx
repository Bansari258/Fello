// src/pages/NotificationsPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Badge } from 'react-bootstrap';
import { Heart, MessageCircle, UserPlus, Check, X, Clock } from 'lucide-react';

function NotificationsPage() {
    // keep a single sample notification for layout/demo purposes
    const notification = {
        id: 1,
        type: 'like',
        user: 'Sarah Johnson',
        content: 'liked your post',
        post: 'Amazing sunset at the beach...',
        timestamp: '2 minutes ago',
        isRead: false,
        avatar: 'S'
    };

    return (
        <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh', paddingTop: '20px' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3>Notifications</h3>
                            <Button variant="link" className="text-decoration-none">
                                Mark all as read
                            </Button>
                        </div>

                        {/* Single sample notification */}
                        <Card className="border-0 mb-3">
                            <Card.Body className="p-3 d-flex gap-3 align-items-start">
                                <div
                                    className="rounded-circle"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #FF6B86 0%, #FF385C 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}
                                >
                                    {notification.avatar}
                                </div>
                                <div className="flex-grow-1">
                                    <p className="mb-1"><strong>{notification.user}</strong> {notification.content}</p>
                                    {notification.post && <p className="small text-muted mb-1">"{notification.post}"</p>}
                                    <small className="text-muted">{notification.timestamp}</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default NotificationsPage;