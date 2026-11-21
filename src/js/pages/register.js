import { registerUser } from '../services/auth.service.js';
import { validateRegistrationForm } from '../utils/validation.js';

const page = document.querySelector('[data-register-page]');

const fieldIds = {
  name: 'register-name',
  email: 'register-email',
  phone: 'register-phone',
  password: 'register-password',
  confirmPassword: 'register-confirm-password',
};

function setFieldError(field, message = '') {
  const inputId = fieldIds[field];
  const input = inputId ? document.getElementById(inputId) : document.querySelector('#register-terms');
  const error = document.getElementById(`register-${field === 'confirmPassword' ? 'confirm-password' : field}-error`)
    || document.querySelector('#register-terms-error');
  if (!input || !error) return;

  error.textContent = message;
  error.classList.toggle('hidden', !message);
  input.setAttribute('aria-invalid', String(Boolean(message)));
  if (input.type !== 'checkbox') {
    input.classList.toggle('border-red-600', Boolean(message));
    input.classList.toggle('focus:ring-red-600/20', Boolean(message));
  }
}

function showMessage(type, title, description) {
  const message = document.querySelector('#register-message');
  message.classList.remove('hidden', 'border-emerald-200', 'bg-emerald-50', 'text-emerald-900', 'border-red-200', 'bg-red-50', 'text-red-900');
  const success = type === 'success';
  message.classList.add(...(success
    ? ['border-emerald-200', 'bg-emerald-50', 'text-emerald-900']
    : ['border-red-200', 'bg-red-50', 'text-red-900']));
  document.querySelector('#register-message-title').textContent = title;
  document.querySelector('#register-message-description').textContent = description;
}

function clearMessage() {
  document.querySelector('#register-message').classList.add('hidden');
}

function bindPasswordToggles() {
  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      const showPassword = input.type === 'password';
      input.type = showPassword ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(showPassword));
      button.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
      button.querySelector('[data-eye-open]').classList.toggle('hidden', showPassword);
      button.querySelector('[data-eye-closed]').classList.toggle('hidden', !showPassword);
    });
  });
}

function bindForm() {
  const form = document.querySelector('#register-form');
  const submitButton = document.querySelector('#register-submit');
  const terms = document.querySelector('#register-terms');

  Object.entries(fieldIds).forEach(([field, inputId]) => {
    document.getElementById(inputId).addEventListener('input', () => {
      setFieldError(field);
      clearMessage();
      if (field === 'password') setFieldError('confirmPassword');
    });
  });
  terms.addEventListener('change', () => {
    setFieldError('terms');
    clearMessage();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessage();

    const formData = new FormData(form);
    const values = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      password: String(formData.get('password') || ''),
      confirmPassword: String(formData.get('confirmPassword') || ''),
      termsAccepted: terms.checked,
    };
    const errors = validateRegistrationForm(values);
    Object.keys(fieldIds).forEach((field) => setFieldError(field, errors[field] || ''));
    setFieldError('terms', errors.terms || '');
    if (Object.keys(errors).length) {
      const firstInvalidField = Object.keys(errors)[0];
      const invalidInput = fieldIds[firstInvalidField]
        ? document.getElementById(fieldIds[firstInvalidField])
        : terms;
      invalidInput.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.querySelector('[data-button-label]').textContent = 'Creating account...';
    submitButton.querySelector('[data-button-arrow]').classList.add('hidden');

    try {
      const result = await registerUser(values);
      if (!result.success) {
        if (result.error === 'email-exists') {
          setFieldError('email', 'An account with this email already exists.');
          showMessage('error', 'Email already registered', 'Sign in with this email or use another email address.');
        } else {
          showMessage('error', 'Could not create account', 'Browser storage is unavailable. Check your browser settings and try again.');
        }
        return;
      }

      showMessage('success', 'Account created successfully', 'Your account is ready. Taking you to sign in...');
      window.setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    } catch {
      showMessage('error', 'Could not create account', 'Something went wrong. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.querySelector('[data-button-label]').textContent = 'Create account';
      submitButton.querySelector('[data-button-arrow]').classList.remove('hidden');
    }
  });
}

export function initRegisterPage() {
  if (!page) return;
  bindPasswordToggles();
  bindForm();
}
