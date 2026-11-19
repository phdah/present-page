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
      document.body.classList.add('is-unlocked');
      success.focus({ preventScroll: true });
      startJourney();
    }, reducedMotion ? 0 : 510);
  }, reducedMotion ? 0 : 480);
});


// The reveal is progressive and visual, never required for the information to be readable.
function startJourney() {
  const root = document.getElementById('success-screen');
  if (!root) return;

  const targets = typeof root.querySelectorAll === 'function'
    ? Array.from(root.querySelectorAll('[data-reveal]'))
    : [];
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  if (reduceMotion || typeof window.IntersectionObserver !== 'function') {
    targets.forEach((target) => target.classList.add('is-visible'));
  } else {
    const observer = new window.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px 70px 0px' });
    targets.forEach((target) => observer.observe(target));
  }

  const progress = document.getElementById('scroll-progress');
  const update = () => {
    if (root.hidden) return;
    const documentHeight = document.documentElement?.scrollHeight ?? 0;
    const viewport = window.innerHeight ?? 0;
    const scrollY = window.scrollY ?? 0;
    const denominator = documentHeight - viewport;
    if (progress?.style) {
      progress.style.width = (denominator > 0
        ? Math.min(100, Math.max(0, (scrollY / denominator) * 100))
        : 0) + '%';
    }
    if (!reduceMotion) {
      root.style?.setProperty?.('--story-scroll', String(Math.min(scrollY, 1400)));
    }
  };
  window.addEventListener?.('scroll', update, { passive: true });
  window.addEventListener?.('resize', update);
  update();
}
