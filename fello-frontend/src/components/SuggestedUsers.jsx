import { useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSuggestedUsers } from '../store/slices/userSlice';
import { followUser } from '../store/slices/userSlice';

const SuggestedUsers = () => {
    const dispatch = useDispatch();
    const { suggestedUsers } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(getSuggestedUsers());
    }, [dispatch]);

    const handleFollow = (userId) => {
        dispatch(followUser(userId));
    };

    return (
        <Card>
            <Card.Body>
                <h6 className="fw-bold mb-3">Suggested for you</h6>

                {suggestedUsers.length === 0 ? (
                    <p className="text-muted small">No suggestions available</p>
                ) : (
                    suggestedUsers.map((user) => (
                        <div key={user._id} className="d-flex align-items-center justify-content-between mb-3">
                            <Link to={`/profile/${user._id}`} className="d-flex align-items-center text-decoration-none">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=9333ea&color=fff`}
                                    alt={user.username}
                                    width="40"
                                    height="40"
                                    className="rounded-circle me-3"
                                />
                                <div>
                                    <div className="fw-bold text-dark small">{user.fullName}</div>
                                    <small className="text-muted">@{user.username}</small>
                                </div>
                            </Link>

                            <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleFollow(user._id)}
                            >
                                Follow
                            </Button>
                        </div>
                    ))
                )}
            </Card.Body>
        </Card>
    );
};

export default SuggestedUsers;