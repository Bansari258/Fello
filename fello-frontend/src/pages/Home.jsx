import { useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedPosts } from '../store/slices/postSlice';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import SuggestedUsers from '../components/SuggestedUsers';

const Home = () => {
  const dispatch = useDispatch();
  const { feedPosts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchFeedPosts({ page: 1 }));
  }, [dispatch]);

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <CreatePost />
          
          {loading && feedPosts.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : feedPosts.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
              <h5 className="text-muted">No posts yet</h5>
              <p className="text-muted">Follow users to see their posts in your feed</p>
            </div>
          ) : (
            feedPosts.map((post) => <PostCard key={post._id} post={post} />)
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

export default Home;