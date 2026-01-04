// src/components/posts/PostCard.jsx
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

function PostCard({ post, onDelete, onEdit, onLike, onComment }) {
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);

    const handleLike = () => {
        setIsLiked(prev => !prev);
        setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
        onLike?.(post.id);
    };

    return (
        <>
            <Card className="mb-3 border-0">
                <Card.Body>
                    <div className="d-flex gap-3 mb-2">
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
                            {post.author?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <strong>{post.author?.name || 'User'}</strong>
                                    <div className="text-muted small">@{post.author?.username || 'username'}</div>
                                </div>
                                <div className="text-muted small">{post.timestamp || ''}</div>
                            </div>
                            <p className="mt-2 mb-2">{post.content}</p>
                        </div>
                    </div>

                    {post.images && post.images.length > 0 && (
                        <div className="mb-2">
                            <img src={post.images[0]} alt="post" className="w-100 rounded" style={{ objectFit: 'cover' }} />
                        </div>
                    )}

                    <div className="d-flex gap-3 mt-2">
                        <Button variant="light" size="sm" onClick={handleLike} style={{ color: isLiked ? '#FF385C' : '#6C757D' }}>
                            <Heart size={18} fill={isLiked ? '#FF385C' : 'none'} /> {likeCount}
                        </Button>
                        <Button variant="light" size="sm" className="d-flex align-items-center gap-2">
                            <MessageCircle size={18} /> {post.comments || 0}
                        </Button>
                        <Button variant="light" size="sm" className="d-flex align-items-center gap-2">
                            <Share2 size={18} /> Share
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

export default PostCard;