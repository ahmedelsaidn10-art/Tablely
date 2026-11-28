import { loginUser, resendVerificationCode } from '../services/auth.service.js';
import { isValidEmail, validateLoginForm } from '../utils/validation.js';

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

  document.querySelector('#login-resend-otp').addEventListener('click', async (event) => {
    clearMessage();
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      setFieldError(emailInput, emailError, email ? 'Enter a valid email address.' : 'Enter your account email first.');
      emailInput.focus();
      return;
    }

    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = 'Sending OTP...';
    try {
      const result = await resendVerificationCode(email);
      if (!result.success) {
        showMessage('error', 'Could not send OTP', result.message || 'Please try again.');
        return;
      }
      showMessage('success', 'OTP request sent', result.message || 'If the account needs verification, a new code will be sent.');
      window.setTimeout(() => {
        window.location.href = `verify-email.html?email=${encodeURIComponent(email)}`;
      }, 900);
    } catch {
      showMessage('error', 'Could not send OTP', 'Please check your connection and try again.');
    } finally {
      button.disabled = false;
      button.textContent = 'Send OTP to an existing account';
    }
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
      });

      if (!result.success) {
        if (result.status === 403) {
          showMessage('error', 'Verify your email first', result.message || 'Enter the verification code sent to your email.');
          window.setTimeout(() => {
            window.location.href = `verify-email.html?email=${encodeURIComponent(values.email)}`;
          }, 1200);
        } else {
          showMessage(
            'error',
            'Unable to sign in',
            result.message || 'Check your email and password, then try again.',
          );
        }
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
