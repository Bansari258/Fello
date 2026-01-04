// src/components/posts/CreatePostModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Image as ImageIcon, X, Smile, MapPin } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../redux/slices/postSlice';

function CreatePostModal({ show, onHide }) {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 4) {
            setError('You can only upload up to 4 images');
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages([...images, ...newImages]);
        setError('');
    };

    const removeImage = (index) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) {
            setError('Please add some content or images');
            return;
        }

        setLoading(true);
        try {
            // convert image files to base64 data URLs
            const toDataUrl = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const imagePromises = images.map(img => toDataUrl(img.file));
            const imageDataUrls = await Promise.all(imagePromises);

            const payload = {
                content: content.trim(),
                images: imageDataUrls
            };

            // dispatch createPost thunk
            await dispatch(createPost(payload)).unwrap();

            setLoading(false);
            onHide();
            setContent('');
            setImages([]);
        } catch (err) {
            console.error(err);
            setError(err?.message || 'Failed to create post');
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ resize: 'none', border: 'none', fontSize: '18px' }}
                        />
                    </Form.Group>

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="mb-3">
                            <div className="d-flex gap-2 flex-wrap">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="position-relative"
                                        style={{ width: '150px', height: '150px' }}
                                    >
                                        <img
                                            src={img.preview}
                                            alt="Preview"
                                            className="w-100 h-100 object-fit-cover rounded"
                                        />
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="position-absolute top-0 end-0 m-1 rounded-circle"
                                            style={{ width: '28px', height: '28px', padding: 0 }}
                                            onClick={() => removeImage(index)}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{ backgroundColor: '#F7F7F7' }}>
                        <div className="d-flex gap-2">
                            <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                                <div className="d-flex align-items-center gap-1 px-3 py-2 rounded" style={{ backgroundColor: 'white' }}>
                                    <ImageIcon size={20} style={{ color: '#00A699' }} />
                                    <span className="small">Photo</span>
                                </div>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    disabled={images.length >= 4}
                                />
                            </label>

                            <Button variant="white" className="d-flex align-items-center gap-1">
                                <Smile size={20} style={{ color: '#FFC107' }} />
                                <span className="small">Emoji</span>
                            </Button>

                            <Button variant="white" className="d-flex align-items-center gap-1">
                                <MapPin size={20} style={{ color: '#FF385C' }} />
                                <span className="small">Location</span>
                            </Button>
                        </div>

                        <small className="text-muted">
                            {content.length}/500
                        </small>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={onHide} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading || (!content.trim() && images.length === 0)}
                >
                    {loading ? 'Posting...' : 'Post'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreatePostModal;