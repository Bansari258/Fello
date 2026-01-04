// src/pages/SearchPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup } from 'react-bootstrap';
import { Search, X, Clock, TrendingUp, User, Hash, FileText } from 'lucide-react';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showResults, setShowResults] = useState(false);

  const recentSearches = [
    'React Tutorial',
    'Best restaurants',
    'Travel photography',
    'Workout routine'
  ];

  const searchResults = {
    users: [
      { id: 1, name: 'Sarah Johnson', username: 'sarahj', followers: '12.5K', bio: 'Travel enthusiast 🌍' },
      { id: 2, name: 'Mike Chen', username: 'mikechen', followers: '8.3K', bio: 'Tech blogger' }
    ],
    posts: [
      { id: 1, author: 'John Doe', content: 'Just finished an amazing project!', likes: 234 },
      { id: 2, author: 'Emma Wilson', content: 'New recipe alert! 🍰', likes: 189 }
    ],
    hashtags: [
      { tag: '#Photography', posts: '125K' },
      { tag: '#Travel', posts: '98K' }
    ]
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh', paddingTop: '20px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Search Header */}
            <Card className="border-0 mb-4">
              <Card.Body>
                <h3 className="mb-4">Search</h3>
                <Form onSubmit={handleSearch}>
                  <InputGroup size="lg">
                    <InputGroup.Text style={{ backgroundColor: '#F7F7F7', border: 'none' }}>
                      <Search size={20} style={{ color: '#6C757D' }} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search for people, posts, or hashtags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ border: 'none', backgroundColor: '#F7F7F7' }}
                    />
                    {searchQuery && (
                      <Button 
                        variant="light" 
                        onClick={clearSearch}
                        style={{ border: 'none', backgroundColor: '#F7F7F7' }}
                      >
                        <X size={20} />
                      </Button>
                    )}
                  </InputGroup>
                </Form>

                {/* Filter Pills */}
                {showResults && (
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    <Button
                      variant={activeFilter === 'all' ? 'primary' : 'light'}
                      size="sm"
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={activeFilter === 'users' ? 'primary' : 'light'}
                      size="sm"
                      onClick={() => setActiveFilter('users')}
                    >
                      <User size={16} className="me-1" />
                      People
                    </Button>
                    <Button
                      variant={activeFilter === 'posts' ? 'primary' : 'light'}
                      size="sm"
                      onClick={() => setActiveFilter('posts')}
                    >
                      <FileText size={16} className="me-1" />
                      Posts
                    </Button>
                    <Button
                      variant={activeFilter === 'hashtags' ? 'primary' : 'light'}
                      size="sm"
                      onClick={() => setActiveFilter('hashtags')}
                    >
                      <Hash size={16} className="me-1" />
                      Hashtags
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Recent Searches or Results */}
            {!showResults ? (
              <>
                {/* Recent Searches */}
                <Card className="border-0 mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Recent Searches</h6>
                      <Button variant="link" className="text-decoration-none p-0">
                        Clear all
                      </Button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <div 
                        key={index}
                        className="d-flex align-items-center justify-content-between py-2 border-bottom cursor-pointer"
                        onClick={() => setSearchQuery(search)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center">
                          <Clock size={18} className="me-3" style={{ color: '#6C757D' }} />
                          <span>{search}</span>
                        </div>
                        <Button variant="link" className="p-0" style={{ color: '#6C757D' }}>
                          <X size={18} />
                        </Button>
                      </div>
                    ))}
                  </Card.Body>
                </Card>

                {/* Trending */}
                <Card className="border-0">
                  <Card.Body>
                    <h6 className="mb-3 d-flex align-items-center">
                      <TrendingUp size={18} className="me-2" style={{ color: '#FF385C' }} />
                      Trending Now
                    </h6>
                    {['#WebDevelopment', '#HealthyLiving', '#Photography', '#TravelDiaries'].map((tag, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <p className="mb-0 fw-bold" style={{ color: '#FF385C' }}>{tag}</p>
                          <small className="text-muted">{Math.floor(Math.random() * 100)}K posts</small>
                        </div>
                        <TrendingUp size={18} style={{ color: '#FF385C' }} />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </>
            ) : (
              <>
                {/* Search Results */}
                <div className="mb-3">
                  <h5>Search results for "{searchQuery}"</h5>
                  <small className="text-muted">Found 24 results</small>
                </div>

                {/* Users Results */}
                {(activeFilter === 'all' || activeFilter === 'users') && (
                  <Card className="border-0 mb-3">
                    <Card.Body>
                      <h6 className="mb-3">People</h6>
                      {searchResults.users.map(user => (
                        <div key={user.id} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="rounded-circle"
                              style={{ 
                                width: '50px', 
                                height: '50px', 
                                background: 'linear-gradient(135deg, #FF6B86 0%, #FF385C 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: 'bold'
                              }}
                            >
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <h6 className="mb-0">{user.name}</h6>
                              <small className="text-muted">@{user.username}</small>
                              <p className="mb-0 small text-muted">{user.bio}</p>
                              <Badge bg="light" text="dark" className="mt-1">{user.followers} followers</Badge>
                            </div>
                          </div>
                          <Button variant="primary" size="sm">Follow</Button>
                        </div>
                      ))}
                      <Button variant="link" className="text-decoration-none mt-2">
                        See all people results →
                      </Button>
                    </Card.Body>
                  </Card>
                )}

                {/* Posts Results */}
                {(activeFilter === 'all' || activeFilter === 'posts') && (
                  <Card className="border-0 mb-3">
                    <Card.Body>
                      <h6 className="mb-3">Posts</h6>
                      {searchResults.posts.map(post => (
                        <Card key={post.id} className="mb-3 border-0" style={{ backgroundColor: '#F7F7F7' }}>
                          <Card.Body>
                            <div className="d-flex gap-2 mb-2">
                              <div 
                                className="rounded-circle"
                                style={{ 
                                  width: '40px', 
                                  height: '40px', 
                                  background: 'linear-gradient(135deg, #FF6B86 0%, #FF385C 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {post.author.charAt(0)}
                              </div>
                              <div>
                                <h6 className="mb-0">{post.author}</h6>
                                <small className="text-muted">2 hours ago</small>
                              </div>
                            </div>
                            <p className="mb-2">{post.content}</p>
                            <small className="text-muted">❤️ {post.likes} likes</small>
                          </Card.Body>
                        </Card>
                      ))}
                      <Button variant="link" className="text-decoration-none">
                        See all posts →
                      </Button>
                    </Card.Body>
                  </Card>
                )}

                {/* Hashtags Results */}
                {(activeFilter === 'all' || activeFilter === 'hashtags') && (
                  <Card className="border-0">
                    <Card.Body>
                      <h6 className="mb-3">Hashtags</h6>
                      {searchResults.hashtags.map((item, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                          <div>
                            <h6 className="mb-0" style={{ color: '#FF385C' }}>{item.tag}</h6>
                            <small className="text-muted">{item.posts} posts</small>
                          </div>
                          <Button variant="outline-primary" size="sm">Follow</Button>
                        </div>
                      ))}
                      <Button variant="link" className="text-decoration-none mt-2">
                        See all hashtags →
                      </Button>
                    </Card.Body>
                  </Card>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SearchPage;