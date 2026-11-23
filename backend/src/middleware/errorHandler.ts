import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { ENV } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Always log internal details to server console
  if (ENV.NODE_ENV !== 'test') {
    console.error('[Error Middleware Caught]:', err);
  }

  // Multer Errors (LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE, etc.)
  if (err instanceof multer.MulterError) {
    let message = `Upload error: ${err.message}`;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds maximum allowed limit.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected upload field "${err.field}". File must be uploaded under the expected field name.`;
    }

    res.status(400).json({
      success: false,
      message,
      code: err.code,
    });
    return;
  }

  // Multer fileFilter format errors
  if (
    err.message &&
    (err.message.includes('Invalid audio format') ||
      err.message.includes('Invalid image format') ||
      err.message.includes('Audio file is required'))
  ) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed. Please review your submission.',
      errors: formattedErrors,
    });
    return;
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({
      success: false,
      message: `An entry with this ${field} already exists.`,
    });
    return;
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid resource identifier format for ${err.path}.`,
    });
    return;
  }

  // Default server error with sanitized response for production
  const statusCode = err.statusCode || 500;
  const message =
    ENV.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred. Please contact the wedding administrator.'
      : err.message || 'Internal Server Error. Please try again later.';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
