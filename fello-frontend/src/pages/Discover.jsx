import { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiscoverPosts } from '../store/slices/postSlice';
import PostCard from '../components/PostCard';
import SuggestedUsers from '../components/SuggestedUsers';

const Discover = () => {
    const dispatch = useDispatch();
    const { discoverPosts, loading } = useSelector((state) => state.posts);
    const [activeTab, setActiveTab] = useState('recent');

    useEffect(() => {
        dispatch(fetchDiscoverPosts({ page: 1, sort: activeTab }));
    }, [dispatch, activeTab]);

    return (
        <Container className="py-4">
            <Row>
                <Col lg={8}>
                    <h4 className="fw-bold mb-4">Discover</h4>

                    <Nav variant="pills" className="mb-4">
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'recent'}
                                onClick={() => setActiveTab('recent')}
                            >
                                Recent
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'popular'}
                                onClick={() => setActiveTab('popular')}
                            >
                                Popular
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {loading && discoverPosts.length === 0 ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : discoverPosts.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                            <h5 className="text-muted">No posts found</h5>
                        </div>
                    ) : (
                        discoverPosts.map((post) => <PostCard key={post._id} post={post} />)
                    )}
                </Col>

                <Col lg={4} className="d-none d-lg-block">
                    <div className="sidebar">
                        <SuggestedUsers />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Discover;