for (const demo of document.querySelectorAll('[data-walkthrough]')) {
  const steps = [...demo.querySelectorAll('[data-walkthrough-step]')];
  const lines = demo.querySelectorAll('[data-code-line]');
  const progress = demo.querySelector('[data-walkthrough-progress]');
  const back = demo.querySelector('[data-walkthrough-back]');
  const next = demo.querySelector('[data-walkthrough-next]');
  let current = 0;

  function showStep() {
    const step = steps[current];
    steps.forEach((item, index) => { item.hidden = index !== current; });
    for (const line of lines) {
      if (line.dataset.codeLine === step.dataset.walkthroughStep) {
        line.setAttribute('aria-current', 'step');
      } else {
        line.removeAttribute('aria-current');
      }
    }
    back.setAttribute('aria-disabled', String(current === 0));
    next.setAttribute('aria-disabled', String(current === steps.length - 1));
    progress.textContent = `Шаг ${current + 1} из ${steps.length}. ${step.querySelector('h4').textContent}`;
  }

  back.addEventListener('click', () => {
    if (current === 0) return;
    current -= 1;
    showStep();
  });
  next.addEventListener('click', () => {
    if (current === steps.length - 1) return;
    current += 1;
    showStep();
  });
  showStep();
  demo.querySelector('[data-walkthrough-controls]').hidden = false;
}
