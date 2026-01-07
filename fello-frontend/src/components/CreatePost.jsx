import { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/slices/postSlice';
import { toast } from 'react-toastify';

const CreatePost = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error('Post content cannot be empty');
            return;
        }

        setLoading(true);
        const result = await dispatch(createPost({ content }));

        if (createPost.fulfilled.match(result)) {
            setContent('');
            toast.success('Post created successfully');
        } else {
            toast.error('Failed to create post');
        }
        setLoading(false);
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <div className="d-flex gap-3">
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&background=9333ea&color=fff`}
                        alt={user?.username}
                        width="50"
                        height="50"
                        className="rounded-circle"
                    />
                    <Form onSubmit={handleSubmit} className="flex-grow-1">
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <Button variant="link" className="text-muted p-0 me-3">
                                    <i className="bi bi-image fs-5"></i>
                                </Button>
                                <Button variant="link" className="text-muted p-0">
                                    <i className="bi bi-emoji-smile fs-5"></i>
                                </Button>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading || !content.trim()}
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CreatePost;