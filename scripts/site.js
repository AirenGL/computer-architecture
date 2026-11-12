const $ = id => document.getElementById(id);
const themeSelect = $('theme-select');
themeSelect.value = document.documentElement.dataset.theme || 'white';
$('settings').addEventListener('click', () => $('appearance').showModal());
themeSelect.addEventListener('change', () => {
  document.documentElement.dataset.theme = themeSelect.value;
  try { localStorage.setItem('arch-theme', themeSelect.value); } catch {}
});

function redirectLegacyLesson() {
  const match = location.hash.match(/^#topic-(\d{1,2})(-part-\d+)?$/);
  if (!$('course') || !match) return false;
  const number = Number(match[1]);
  const link = $('course').querySelector('[data-topic="' + number + '"]');
  if (!link) return false;
  const destination = new URL(link.href);
  if (match[2]) destination.hash = 'topic-' + number + match[2];
  location.replace(destination);
  return true;
}

window.addEventListener('hashchange', redirectLegacyLesson);
redirectLegacyLesson();
