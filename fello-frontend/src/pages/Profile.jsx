import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Nav, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, followUser, unfollowUser } from '../store/slices/userSlice';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';

const Profile = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { currentProfile, loading } = useSelector((state) => state.users);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const isOwnProfile = user?._id === userId;

    useEffect(() => {
        dispatch(getUserProfile(userId));
        loadUserPosts();
        checkFollowStatus();
    }, [userId, dispatch]);

    const loadUserPosts = async () => {
        setLoadingPosts(true);
        try {
            const { data } = await api.get(`/posts?userId=${userId}`);
            setPosts(data.data.posts);
        } catch (error) {
            console.error(error);
        }
        setLoadingPosts(false);
    };

    const checkFollowStatus = async () => {
        if (isOwnProfile) return;
        try {
            const { data } = await api.get(`/follow/following/${user._id}`);
            const following = data.data.following.some(f => f._id === userId);
            setIsFollowing(following);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await dispatch(unfollowUser(userId));
                setIsFollowing(false);
                toast.success('Unfollowed successfully');
            } else {
                await dispatch(followUser(userId));
                setIsFollowing(true);
                toast.success('Follow request sent');
            }
        } catch (error) {
            toast.error('Action failed');
        }
    };

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </Container>
        );
    }

    if (!currentProfile) {
        return (
            <Container className="py-5">
                <div className="text-center">
                    <h4>User not found</h4>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Card className="mb-4">
                <div
                    className="cover-photo bg-gradient"
                    style={{
                        background: currentProfile.coverPhoto || 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                        height: '200px'
                    }}
                />

                <Card.Body>
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3" style={{ marginTop: '-50px' }}>
                        <img
                            src={currentProfile.avatar || `https://ui-avatars.com/api/?name=${currentProfile.fullName}&background=9333ea&color=fff&size=120`}
                            alt={currentProfile.username}
                            width="120"
                            height="120"
                            className="rounded-circle border border-4 border-white"
                        />

                        <div className="flex-grow-1">
                            <h4 className="fw-bold mb-1">{currentProfile.fullName}</h4>
                            <p className="text-muted mb-2">@{currentProfile.username}</p>
                            {currentProfile.bio && <p className="mb-3">{currentProfile.bio}</p>}

                            <div className="d-flex gap-4">
                                <div>
                                    <strong>{currentProfile.postsCount}</strong>
                                    <span className="text-muted ms-1">Posts</span>
                                </div>
                                <div>
                                    <strong>{currentProfile.followersCount}</strong>
                                    <span className="text-muted ms-1">Followers</span>
                                </div>
                                <div>
                                    <strong>{currentProfile.followingCount}</strong>
                                    <span className="text-muted ms-1">Following</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            {isOwnProfile ? (
                                <Button as={Link} to="/profile/edit" variant="outline-primary">
                                    Edit Profile
                                </Button>
                            ) : (
                                <Button
                                    variant={isFollowing ? 'outline-secondary' : 'primary'}
                                    onClick={handleFollowToggle}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                    <Nav.Link active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>
                        Posts
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {loadingPosts ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                    <h5 className="text-muted">No posts yet</h5>
                </div>
            ) : (
                <Row>
                    <Col lg={8}>
                        {posts.map((post) => <PostCard key={post._id} post={post} />)}
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Profile;