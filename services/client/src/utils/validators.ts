/**
 * TransitOps - Form Validation Utilities
 */

export const validators = {
  /**
   * Validate email
   */
  email(value: string): string | null {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email address';
    return null;
  },

  /**
   * Validate password
   */
  password(value: string): string | null {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (value.length > 128) return 'Password must be less than 128 characters';
    return null;
  },

  /**
   * Validate required field
   */
  required(value: any, fieldName: string = 'Field'): string | null {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  /**
   * Validate phone number (Indian format)
   */
  phone(value: string): string | null {
    if (!value) return 'Phone number is required';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 10) return 'Phone must be at least 10 digits';
    if (cleaned.length > 15) return 'Phone number too long';
    return null;
  },

  /**
   * Validate vehicle registration number
   */
  registrationNumber(value: string): string | null {
    if (!value) return 'Registration number is required';
    if (value.length < 4) return 'Registration number too short';
    if (value.length > 20) return 'Registration number too long';
    return null;
  },

  /**
   * Validate positive number
   */
  positiveNumber(value: any, fieldName: string = 'Value'): string | null {
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (num <= 0) return `${fieldName} must be positive`;
    return null;
  },

  /**
   * Validate non-negative number
   */
  nonNegativeNumber(value: any, fieldName: string = 'Value'): string | null {
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (num < 0) return `${fieldName} cannot be negative`;
    return null;
  },

  /**
   * Validate date is in the future
   */
  futureDate(value: string, fieldName: string = 'Date'): string | null {
    if (!value) return `${fieldName} is required`;
    const date = new Date(value);
    if (isNaN(date.getTime())) return `Invalid ${fieldName.toLowerCase()}`;
    if (date <= new Date()) return `${fieldName} must be in the future`;
    return null;
  },

  /**
   * Validate license number
   */
  licenseNumber(value: string): string | null {
    if (!value) return 'License number is required';
    if (value.length < 5) return 'License number too short';
    if (value.length > 50) return 'License number too long';
    return null;
  },

  /**
   * Validate cargo weight against vehicle capacity
   */
  cargoWeight(weight: number, maxCapacity: number): string | null {
    if (weight <= 0) return 'Cargo weight must be positive';
    if (weight > maxCapacity) return `Cargo weight exceeds vehicle capacity of ${maxCapacity}kg`;
    return null;
  },

  /**
   * Validate form object and return all errors
   */
  validateForm(data: Record<string, any>, rules: Record<string, (value: any) => string | null>): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const [field, validator] of Object.entries(rules)) {
      const error = validator(data[field]);
      if (error) errors[field] = error;
    }
    return errors;
  },

  /**
   * Check if form has errors
   */
  hasErrors(errors: Record<string, string>): boolean {
    return Object.keys(errors).length > 0;
  },
};