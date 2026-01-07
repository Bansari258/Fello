import { useState } from 'react';
import { Card, Dropdown, Modal, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLike, addComment, deletePost } from '../store/slices/postSlice';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    const isOwnPost = user?._id === post.author._id;

    const handleLike = () => {
        dispatch(toggleLike(post._id));
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmittingComment(true);
        const result = await dispatch(addComment({ postId: post._id, content: comment }));

        if (addComment.fulfilled.match(result)) {
            setComment('');
            toast.success('Comment added');
        }
        setSubmittingComment(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const result = await dispatch(deletePost(post._id));
            if (deletePost.fulfilled.match(result)) {
                toast.success('Post deleted');
            }
        }
    };

    return (
        <Card className="post-card mb-3">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex">
                        <Link to={`/profile/${post.author._id}`}>
                            <img
                                src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.fullName}&background=9333ea&color=fff`}
                                alt={post.author.username}
                                width="50"
                                height="50"
                                className="rounded-circle me-3"
                            />
                        </Link>
                        <div>
                            <Link to={`/profile/${post.author._id}`} className="text-decoration-none text-dark">
                                <h6 className="mb-0 fw-bold">{post.author.fullName}</h6>
                            </Link>
                            <small className="text-muted">
                                @{post.author.username} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </small>
                        </div>
                    </div>

                    {isOwnPost && (
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="text-muted p-0 border-0">
                                <i className="bi bi-three-dots"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleDelete} className="text-danger">
                                    <i className="bi bi-trash me-2"></i>
                                    Delete
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>

                <Card.Text className="mb-3">{post.content}</Card.Text>

                {post.images && post.images.length > 0 && (
                    <div className="mb-3">
                        {post.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt="Post"
                                className="img-fluid rounded mb-2"
                                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                            />
                        ))}
                    </div>
                )}

                <div className="d-flex justify-content-between border-top pt-3">
                    <button
                        className={`btn btn-link text-decoration-none ${post.isLiked ? 'text-danger' : 'text-muted'}`}
                        onClick={handleLike}
                    >
                        <i className={`bi ${post.isLiked ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
                        {post.likesCount}
                    </button>

                    <button
                        className="btn btn-link text-muted text-decoration-none"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <i className="bi bi-chat me-1"></i>
                        {post.commentsCount}
                    </button>

                    <button className="btn btn-link text-muted text-decoration-none">
                        <i className="bi bi-share me-1"></i>
                        Share
                    </button>
                </div>

                {showComments && (
                    <div className="border-top mt-3 pt-3">
                        <Form onSubmit={handleAddComment} className="mb-3">
                            <Form.Group className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={submittingComment || !comment.trim()}
                                >
                                    Post
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default PostCard;