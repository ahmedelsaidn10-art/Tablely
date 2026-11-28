// Reusable checks shared by the authentication pages.
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  const cleanEmail = String(email || '').trim();

  if (!cleanEmail) errors.email = 'Enter your email address.';
  else if (!isValidEmail(cleanEmail)) errors.email = 'Enter a valid email address.';

  if (!password) errors.password = 'Enter your password.';

  return errors;
}

export function validateRegistrationForm({ name, email, password, confirmPassword, termsAccepted }) {
  const errors = {};
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim();

  if (!cleanName) errors.name = 'Enter your full name.';
  else if (cleanName.length < 2) errors.name = 'Your name must contain at least 2 characters.';

  if (!cleanEmail) errors.email = 'Enter your email address.';
  else if (!isValidEmail(cleanEmail)) errors.email = 'Enter a valid email address.';

  if (!password) errors.password = 'Create a password.';
  else if (password.length < 8) errors.password = 'Use at least 8 characters.';

  if (!confirmPassword) errors.confirmPassword = 'Confirm your password.';
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  if (!termsAccepted) errors.terms = 'Please accept the terms to create an account.';

  return errors;
}
