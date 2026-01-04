import { AppError } from '../utils/AppError.js';

const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('UNEXPECTED ERROR', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};

const errorHandler = (err, req, res, next) => {
    // Handle JWT expired errors
    if (err && err.name === 'TokenExpiredError') {
        err = new AppError('Access token expired', 401);
    }

    // handle invalid token
    if (err && err.name === 'JsonWebTokenError') {
        err = new AppError('Invalid token', 401);
    }

    // Use AppError defaults if not provided
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    } else {
        sendErrorDev(err, res);
    }
};

export default errorHandler;
