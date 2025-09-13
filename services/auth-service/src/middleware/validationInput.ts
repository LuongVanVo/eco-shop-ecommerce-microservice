import { Schema } from 'express-validator';

export const validateSignup: Schema = {
  name: {
    notEmpty: {
      errorMessage: 'Name is required'
    },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Name must be between 2 and 50 characters'
    },
    trim: true
  },
  email: {
    notEmpty: {
      errorMessage: 'Email is required'
    },
    isEmail: {
      errorMessage: 'Please provide a valid email address'
    },
    normalizeEmail: true
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required'
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long'
    }
  },
  confirmPassword: {
    notEmpty: {
      errorMessage: 'Confirm password is required'
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }
    }
  }
};

export const validateLogin: Schema = {
  email: {
    notEmpty: {
      errorMessage: 'Email is required'
    },
    isEmail: {
      errorMessage: 'Please provide a valid email address'
    },
    normalizeEmail: true
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required'
    }
  }
}