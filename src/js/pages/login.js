import { loginUser } from '../services/auth.service.js';
import { validateLoginForm } from '../utils/validation.js';

const page = document.querySelector('[data-login-page]');

function setFieldError(input, messageElement, message = '') {
  messageElement.textContent = message;
  messageElement.classList.toggle('hidden', !message);
  input.setAttribute('aria-invalid', String(Boolean(message)));
  input.classList.toggle('border-red-600', Boolean(message));
  input.classList.toggle('focus:ring-red-600/20', Boolean(message));
}

function showMessage(type, title, description) {
  const message = document.querySelector('#login-message');
  message.classList.remove('hidden', 'border-emerald-200', 'bg-emerald-50', 'text-emerald-900', 'border-red-200', 'bg-red-50', 'text-red-900');
  const isSuccess = type === 'success';
  message.classList.add(...(isSuccess
    ? ['border-emerald-200', 'bg-emerald-50', 'text-emerald-900']
    : ['border-red-200', 'bg-red-50', 'text-red-900']));
  document.querySelector('#login-message-title').textContent = title;
  document.querySelector('#login-message-description').textContent = description;
}

function clearMessage() {
  document.querySelector('#login-message').classList.add('hidden');
}

function bindPasswordToggle() {
  const password = document.querySelector('#login-password');
  const button = document.querySelector('#toggle-password');
  const icon = button.querySelector('.material-symbols-outlined');

  button.addEventListener('click', () => {
    const showPassword = password.type === 'password';
    password.type = showPassword ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(showPassword));
    button.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
    icon.textContent = showPassword ? 'visibility_off' : 'visibility';
  });
}

function bindLoginForm() {
  const form = document.querySelector('#login-form');
  const emailInput = document.querySelector('#login-email');
  const passwordInput = document.querySelector('#login-password');
  const emailError = document.querySelector('#login-email-error');
  const passwordError = document.querySelector('#login-password-error');
  const submitButton = document.querySelector('#login-submit');

  emailInput.addEventListener('input', () => {
    setFieldError(emailInput, emailError);
    clearMessage();
  });
  passwordInput.addEventListener('input', () => {
    setFieldError(passwordInput, passwordError);
    clearMessage();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessage();

    const formData = new FormData(form);
    const values = {
      email: String(formData.get('email') || '').trim(),
      password: String(formData.get('password') || ''),
    };
    const errors = validateLoginForm(values);
    setFieldError(emailInput, emailError, errors.email || '');
    setFieldError(passwordInput, passwordError, errors.password || '');
    if (Object.keys(errors).length) {
      (errors.email ? emailInput : passwordInput).focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = 'Signing in...';

    try {
      const result = await loginUser({
        ...values,
        rememberMe: document.querySelector('#remember-me').checked,
      });

      if (!result.success) {
        const message = result.error === 'storage-unavailable'
          ? 'Browser storage is unavailable, so we could not save your sign-in.'
          : 'Check your email and password. If you are new to Tablely, create an account first.';
        showMessage('error', 'Unable to sign in', message);
        return;
      }

      showMessage('success', `Welcome back, ${result.user.name || 'diner'}!`, 'You are signed in. Taking you back to Tablely...');
      window.setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);
    } catch {
      showMessage('error', 'Unable to sign in', 'Something went wrong. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.querySelector('span').textContent = 'Sign in';
    }
  });
}

export function initLoginPage() {
  if (!page) return;
  bindPasswordToggle();
  bindLoginForm();
}
