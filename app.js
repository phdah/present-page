// This is a playful reveal gate, not authentication.
// The code and all client-side content are public on GitHub Pages.
const ACCESS_CODE = '961121';

const form = document.getElementById('code-form');
const input = document.getElementById('code-input');
const message = document.getElementById('code-message');
const button = document.getElementById('unlock-button');
const login = document.getElementById('login-screen');
const success = document.getElementById('success-screen');

input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 6);
  input.removeAttribute('aria-invalid');
  message.textContent = '';
  message.classList.remove('ok');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (button.disabled) return;

  if (input.value !== ACCESS_CODE) {
    input.setAttribute('aria-invalid', 'true');
    message.textContent = input.value.length === 6
      ? 'Inte riktigt rätt. Försök igen ♡'
      : 'Koden ska bestå av sex siffror.';
    message.classList.remove('ok');
    input.classList.remove('shake');
    void input.offsetWidth; // restart the wrong-code animation
    input.classList.add('shake');
    input.focus();
    input.select();
    return;
  }

  button.disabled = true;
  input.removeAttribute('aria-invalid');
  message.textContent = 'Precis rätt. ♡';
  message.classList.add('ok');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(() => {
    document.body.classList.add('is-unlocking');
    window.setTimeout(() => {
      login.hidden = true;
      success.hidden = false;
      document.body.classList.remove('is-unlocking');
      success.focus({ preventScroll: true });
    }, reducedMotion ? 0 : 510);
  }, reducedMotion ? 0 : 480);
});
