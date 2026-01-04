import React from 'react'
import { Spinner, Container } from 'react-bootstrap';
const Loading = () => {
    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
        >
            <div className="text-center">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-3 text-muted">Loading...</p>
            </div>
        </Container>
    )
}

export default Loading
