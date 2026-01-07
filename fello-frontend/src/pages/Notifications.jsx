import { useEffect } from 'react';
import { Container, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchNotifications, markAsRead, markAllAsRead } from '../store/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
    const dispatch = useDispatch();
    const { notifications, loading, unreadCount } = useSelector((state) => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleMarkAsRead = (notificationId) => {
        dispatch(markAsRead(notificationId));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <i className="bi bi-heart-fill text-danger fs-5"></i>;
            case 'comment':
                return <i className="bi bi-chat-fill text-primary fs-5"></i>;
            case 'follow':
                return <i className="bi bi-person-fill text-success fs-5"></i>;
            case 'follow_request':
                return <i className="bi bi-person-plus-fill text-warning fs-5"></i>;
            default:
                return <i className="bi bi-bell-fill fs-5"></i>;
        }
    };

    const getNotificationMessage = (notification) => {
        switch (notification.type) {
            case 'like':
                return 'liked your post';
            case 'comment':
                return 'commented on your post';
            case 'follow':
                return 'started following you';
            case 'follow_request':
                return 'sent you a follow request';
            default:
                return 'sent you a notification';
        }
    };

    return (
        <Container className="py-4">
            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-0">Notifications</h4>
                            {unreadCount > 0 && (
                                <Badge bg="danger" className="mt-1">{unreadCount} unread</Badge>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <Button variant="outline-primary" size="sm" onClick={handleMarkAllAsRead}>
                                Mark all as read
                            </Button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-bell fs-1 text-muted d-block mb-3"></i>
                            <h5 className="text-muted">No notifications yet</h5>
                            <p className="text-muted">When you get notifications, they'll show up here</p>
                        </div>
                    ) : (
                        <ListGroup variant="flush">
                            {notifications.map((notification) => (
                                <ListGroup.Item
                                    key={notification._id}
                                    className={`d-flex gap-3 py-3 ${!notification.isRead ? 'bg-light' : ''}`}
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                                    style={{ cursor: !notification.isRead ? 'pointer' : 'default' }}
                                >
                                    <div>{getNotificationIcon(notification.type)}</div>

                                    <div className="flex-grow-1">
                                        <div className="d-flex gap-2 align-items-start">
                                            <Link to={`/profile/${notification.sender._id}`}>
                                                <img
                                                    src={notification.sender.avatar || `https://ui-avatars.com/api/?name=${notification.sender.fullName}&background=9333ea&color=fff`}
                                                    alt={notification.sender.username}
                                                    width="40"
                                                    height="40"
                                                    className="rounded-circle"
                                                />
                                            </Link>

                                            <div className="flex-grow-1">
                                                <p className="mb-1">
                                                    <Link
                                                        to={`/profile/${notification.sender._id}`}
                                                        className="fw-bold text-decoration-none text-dark"
                                                    >
                                                        {notification.sender.fullName}
                                                    </Link>
                                                    {' '}
                                                    <span className="text-muted">{getNotificationMessage(notification)}</span>
                                                </p>
                                                <small className="text-muted">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </small>
                                            </div>

                                            {!notification.isRead && (
                                                <Badge bg="primary" pill>New</Badge>
                                            )}
                                        </div>

                                        {notification.post && (
                                            <Card className="mt-2" style={{ maxWidth: '400px' }}>
                                                <Card.Body className="p-2">
                                                    <small className="text-muted">
                                                        {notification.post.content.substring(0, 100)}
                                                        {notification.post.content.length > 100 && '...'}
                                                    </small>
                                                </Card.Body>
                                            </Card>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Notifications;