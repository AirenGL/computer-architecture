try {
  const saved = localStorage.getItem('arch-theme');
  const themes = ['white', 'dark', 'blue', 'contrast', 'dead-by-daylight'];
  document.documentElement.dataset.theme = themes.includes(saved) ? saved : 'white';
} catch {}
