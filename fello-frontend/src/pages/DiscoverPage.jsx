// src/pages/DiscoverPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Badge } from 'react-bootstrap';
import { Search, TrendingUp, Users, Compass, Hash } from 'lucide-react';

function DiscoverPage() {
    const [activeTab, setActiveTab] = useState('trending');
    const [searchQuery, setSearchQuery] = useState('');

    const trendingPosts = [
        { id: 1, author: 'Alex Smith', content: 'Amazing sunset at the beach today! 🌅', likes: 234, comments: 45 },
        { id: 2, author: 'Emma Wilson', content: 'New recipe alert! Best chocolate cake ever 🍰', likes: 189, comments: 32 },
        { id: 3, author: 'John Doe', content: 'Just launched my new project! Check it out 🚀', likes: 567, comments: 89 }
    ];

    const trendingHashtags = [
        { tag: '#Photography', posts: '125K' },
        { tag: '#Travel', posts: '98K' },
        { tag: '#Food', posts: '87K' },
        { tag: '#Tech', posts: '76K' },
        { tag: '#Fitness', posts: '65K' },
        { tag: '#Art', posts: '54K' }
    ];

    const suggestedUsers = [
        { id: 1, name: 'David Brown', username: 'davidb', followers: '12.5K' },
        { id: 2, name: 'Lisa Anderson', username: 'lisaa', followers: '8.3K' },
        { id: 3, name: 'Chris Taylor', username: 'christ', followers: '15.2K' },
        { id: 4, name: 'Maria Garcia', username: 'mariag', followers: '9.8K' }
    ];

    return (
        <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh', paddingTop: '20px' }}>
            <Container>
                {/* Header */}
                <div className="mb-4">
                    <h2 className="mb-3">Discover</h2>
                    <Card className="border-0">
                        <Card.Body>
                            <Form.Group className="position-relative">
                                <Search
                                    size={20}
                                    className="position-absolute"
                                    style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6C757D' }}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Search posts, people, or hashtags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: '45px', border: 'none', backgroundColor: '#F7F7F7' }}
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </div>

                {/* Navigation Tabs */}
                <Card className="mb-3 border-0">
                    <Card.Body className="p-0">
                        <Nav variant="pills" className="p-3" style={{ gap: '10px' }}>
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'trending'}
                                    onClick={() => setActiveTab('trending')}
                                    className="d-flex align-items-center gap-2"
                                    style={{
                                        backgroundColor: activeTab === 'trending' ? '#FF385C' : 'transparent',
                                        color: activeTab === 'trending' ? 'white' : '#6C757D',
                                        border: 'none'
                                    }}
                                >
                                    <TrendingUp size={18} />
                                    Trending
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'people'}
                                    onClick={() => setActiveTab('people')}
                                    className="d-flex align-items-center gap-2"
                                    style={{
                                        backgroundColor: activeTab === 'people' ? '#FF385C' : 'transparent',
                                        color: activeTab === 'people' ? 'white' : '#6C757D',
                                        border: 'none'
                                    }}
                                >
                                    <Users size={18} />
                                    People
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'hashtags'}
                                    onClick={() => setActiveTab('hashtags')}
                                    className="d-flex align-items-center gap-2"
                                    style={{
                                        backgroundColor: activeTab === 'hashtags' ? '#FF385C' : 'transparent',
                                        color: activeTab === 'hashtags' ? 'white' : '#6C757D',
                                        border: 'none'
                                    }}
                                >
                                    <Hash size={18} />
                                    Hashtags
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'explore'}
                                    onClick={() => setActiveTab('explore')}
                                    className="d-flex align-items-center gap-2"
                                    style={{
                                        backgroundColor: activeTab === 'explore' ? '#FF385C' : 'transparent',
                                        color: activeTab === 'explore' ? 'white' : '#6C757D',
                                        border: 'none'
                                    }}
                                >
                                    <Compass size={18} />
                                    Explore
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Body>
                </Card>

                {/* Content Based on Active Tab */}
                <Row>
                    <Col lg={8}>
                        {activeTab === 'trending' && (
                            <>
                                <h5 className="mb-3">Trending Posts</h5>
                                {trendingPosts.map(post => (
                                    <Card key={post.id} className="mb-3 border-0">
                                        <Card.Body>
                                            <div className="d-flex gap-3 mb-3">
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
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {post.author.charAt(0)}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1">{post.author}</h6>
                                                    <p className="mb-2">{post.content}</p>
                                                    <div className="d-flex gap-4 text-muted small">
                                                        <span>❤️ {post.likes} likes</span>
                                                        <span>💬 {post.comments} comments</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </>
                        )}

                        {activeTab === 'people' && (
                            <>
                                <h5 className="mb-3">Suggested People</h5>
                                <Row>
                                    {suggestedUsers.map(user => (
                                        <Col md={6} key={user.id}>
                                            <Card className="mb-3 border-0">
                                                <Card.Body className="text-center">
                                                    <div
                                                        className="rounded-circle mx-auto mb-3"
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            background: 'linear-gradient(135deg, #FF6B86 0%, #FF385C 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            fontSize: '32px',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <h6 className="mb-1">{user.name}</h6>
                                                    <p className="text-muted small mb-2">@{user.username}</p>
                                                    <Badge bg="light" text="dark" className="mb-3">{user.followers} followers</Badge>
                                                    <br />
                                                    <Button variant="primary" size="sm">Follow</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )}

                        {activeTab === 'hashtags' && (
                            <>
                                <h5 className="mb-3">Trending Hashtags</h5>
                                <Row>
                                    {trendingHashtags.map((item, index) => (
                                        <Col md={6} key={index}>
                                            <Card className="mb-3 border-0 cursor-pointer">
                                                <Card.Body>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6 className="mb-1" style={{ color: '#FF385C' }}>{item.tag}</h6>
                                                            <small className="text-muted">{item.posts} posts</small>
                                                        </div>
                                                        <TrendingUp size={24} style={{ color: '#FF385C' }} />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )}

                        {activeTab === 'explore' && (
                            <>
                                <h5 className="mb-3">Explore Posts</h5>
                                <Row>
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <Col md={4} key={i}>
                                            <Card className="mb-3 border-0">
                                                <div
                                                    style={{
                                                        height: '200px',
                                                        background: `linear-gradient(${135 + i * 30}deg, #FF6B86 0%, #FF385C 100%)`,
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                                <Card.Body>
                                                    <small className="text-muted">2 hours ago</small>
                                                    <p className="mb-0 small">Sample post content here...</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )}
                    </Col>

                    <Col lg={4}>
                        <Card className="border-0 mb-3">
                            <Card.Body>
                                <h6 className="mb-3">Quick Stats</h6>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Total Users</span>
                                        <strong>1.2M</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Posts Today</span>
                                        <strong>45.6K</strong>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Active Now</span>
                                        <strong style={{ color: '#00A699' }}>23.4K</strong>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="border-0">
                            <Card.Body>
                                <h6 className="mb-3">Popular Categories</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {['Tech', 'Food', 'Travel', 'Fashion', 'Sports', 'Music', 'Art', 'Gaming'].map(cat => (
                                        <Badge
                                            key={cat}
                                            bg="light"
                                            text="dark"
                                            style={{ cursor: 'pointer', padding: '8px 12px' }}
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default DiscoverPage;