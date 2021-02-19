const AppError = require('../utils/appError');

module.exports = class ErrorController {
    static handleCastError = err => {
        const message = `Invalid ${err.path}: ${err.value}.`;
        return new AppError(message, 400);
    }

    static handleDuplicateFieldsDB = err => {
        const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
        const message = `Duplicate field value: ${value}. Please use another value!`;
        return new AppError(message, 400);
    }

    static handleValidationErrorDB = err => {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return new AppError(message, 400);
    }

    static handleJWTError = err => {
        return new AppError('Token invalido', 401);
    }

    static handleJWTExpiredError = err => {
        return new AppError('Se ha vencido el tiempo del Token, por favor reingrese', 401);
    }

    static sendErrorDev = (err, req, res) => {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }
    
    static sendErrorProd = (err, req, res) => {
        console.error('ERROR', err);
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Algo salio muy mal'
            });
        }
    }
    
    static globalErrorHandler = (err, req, res, next) => {
        console.log(err);
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';

        if (process.env.NODE_ENV === 'development') {
            this.sendErrorDev(err, req, res);
        } else if (process.env.NODE_ENV === 'production') {
            let error = Object.create(err);

            if (err.name === 'CastError') erro = this.handleCastError(error);
            if (error.code === 11000) error = this.handleDuplicateFieldsDB(error);
            if (error.name === 'ValidationError')
                error = handleValidationErrorDB(error);
            if (error.name === 'JsonWebTokenError') error = this.handleJWTError(error);
            if (error.name === 'TokenExpiredError') error = this.handleJWTExpiredError(error);
            
            this.sendErrorProd(error, req, res);
        }
    }
}
