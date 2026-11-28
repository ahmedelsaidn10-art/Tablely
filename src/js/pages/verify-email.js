import { resendVerificationCode, verifyEmail } from '../services/auth.service.js';

const page = document.querySelector('[data-verify-email-page]');

function showMessage(title, description, isError = false) {
  const message = document.querySelector('#verify-message');
  message.classList.remove('hidden', 'border-emerald-200', 'bg-emerald-50', 'text-emerald-900', 'border-red-200', 'bg-red-50', 'text-red-900');
  message.classList.add(...(isError
    ? ['border-red-200', 'bg-red-50', 'text-red-900']
    : ['border-emerald-200', 'bg-emerald-50', 'text-emerald-900']));
  document.querySelector('#verify-message-title').textContent = title;
  document.querySelector('#verify-message-description').textContent = description;
}

function initVerificationForm() {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email') || '';
  const emailLabel = document.querySelector('#verify-email-address');
  const codeInput = document.querySelector('#verify-code');
  const codeError = document.querySelector('#verify-code-error');
  const submitButton = document.querySelector('#verify-submit');
  const resendButton = document.querySelector('#resend-code');

  emailLabel.textContent = email || 'your email address';

  codeInput.addEventListener('input', () => {
    codeInput.value = codeInput.value.replace(/\D/g, '').slice(0, 6);
    codeInput.setAttribute('aria-invalid', 'false');
    codeError.textContent = '';
    codeError.classList.add('hidden');
  });

  document.querySelector('#verify-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(codeInput.value)) {
      codeError.textContent = 'Enter the six-digit code.';
      codeError.classList.remove('hidden');
      codeInput.setAttribute('aria-invalid', 'true');
      codeInput.focus();
      return;
    }

    if (!email) {
      showMessage('Email address is missing', 'Go back to registration and submit your email address.', true);
      return;
    }

    submitButton.disabled = true;
    try {
      const result = await verifyEmail({ email, code: codeInput.value });
      if (!result.success) {
        showMessage('Could not verify email', result.message || 'Check the code and try again.', true);
        return;
      }
      showMessage('Email verified', 'Taking you to sign in...');
      window.setTimeout(() => { window.location.href = 'login.html'; }, 900);
    } finally {
      submitButton.disabled = false;
    }
  });

  resendButton.addEventListener('click', async () => {
    if (!email) {
      showMessage('Email address is missing', 'Go back to registration and submit your email address.', true);
      return;
    }
    resendButton.disabled = true;
    try {
      const result = await resendVerificationCode(email);
      showMessage(
        result.success ? 'Request received' : 'Could not resend code',
        result.message || 'Wait a moment and try again.',
        !result.success,
      );
    } finally {
      resendButton.disabled = false;
    }
  });
}

export function initVerifyEmailPage() {
  if (!page) return;
  initVerificationForm();
}
