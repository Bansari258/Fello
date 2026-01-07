import AppError from '../utils/AppError.js';

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const message = `Duplicate field value: ${field}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please login again', 401);

const handleJWTExpired = () => new AppError('Token expired. Please login again', 401);

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateFields(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpired();

  if (process.env.NODE_ENV === 'development') {
    return res.status(error.statusCode).json({
      status: error.status,
      error: err,
      message: error.message,
      stack: err.stack
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  }

  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};

export default errorHandler;