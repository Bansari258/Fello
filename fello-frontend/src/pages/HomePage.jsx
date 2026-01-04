// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
  Heart, MessageCircle, Share2, Bookmark,
  MoreHorizontal, Image as ImageIcon, Smile, MapPin
} from 'lucide-react';
import CreatePostModal from '../components/posts/CreatePostModal';

function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const samplePosts = [
    {
      id: 1,
      author: { name: 'Sarah Johnson', username: 'sarahj', avatar: null },
      content: 'Just finished an amazing hike! The views were absolutely breathtaking 🏔️',
      image: null,
      likes: 24,
      comments: 5,
      timestamp: '2 hours ago',
      isLiked: false
    },
    {
      id: 2,
      author: { name: 'Mike Chen', username: 'mikechen', avatar: null },
      content: 'Working on a new design project. Can\'t wait to share the final result! 🎨',
      image: null,
      likes: 18,
      comments: 3,
      timestamp: '4 hours ago',
      isLiked: true
    }
  ];
  const openCreate = () => setShowCreateModal(true);
  const closeCreate = () => setShowCreateModal(false);

  return (
    <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh', paddingTop: '20px' }}>
      <Container>
        <Row className="justify-content-center">
          {/* Main Content - Feed */}
          <Col lg={8}>
            {/* Create Post Opener */}
            <Card className="mb-3 border-0">
              <Card.Body>
                <div className="d-flex gap-3 align-items-center">
                  <div
                    className="rounded-circle"
                    style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #FF6B86 0%, #FF385C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}
                  >
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-grow-1">
                    <div role="button" onClick={openCreate} className="p-3 rounded" style={{ backgroundColor: '#fff', cursor: 'pointer', border: '1px solid #eee' }}>
                      <span className="text-muted">What's on your mind?</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm" className="d-flex align-items-center" onClick={openCreate}>
                          <ImageIcon size={18} className="me-1" />
                          Photo
                        </Button>
                        <Button variant="light" size="sm" className="d-flex align-items-center" onClick={openCreate}>
                          <Smile size={18} className="me-1" />
                          Emoji
                        </Button>
                        <Button variant="light" size="sm" className="d-flex align-items-center" onClick={openCreate}>
                          <MapPin size={18} className="me-1" />
                          Location
                        </Button>
                      </div>
                      <Button variant="primary" onClick={openCreate}>
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Posts Feed */}
            {samplePosts.map(post => (
              <Card key={post.id} className="mb-3 border-0">
                <Card.Body>
                  <div className="d-flex gap-2 mb-2">
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
                      {post.author.name.charAt(0)}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{post.author.name} <small className="text-muted">@{post.author.username}</small></h6>
                      <p className="mb-2 text-muted small">{post.timestamp}</p>
                      <p className="mb-0">{post.content}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
            <CreatePostModal show={showCreateModal} onHide={closeCreate} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;