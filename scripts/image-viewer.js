(function initializeImageViewer() {
  const viewer = document.getElementById('lesson-image-viewer');
  const frame = viewer.querySelector('.image-viewer-frame');
  const image = viewer.querySelector('img');
  const status = viewer.querySelector('.image-viewer-status');
  const previous = viewer.querySelector('.image-viewer-prev');
  const next = viewer.querySelector('.image-viewer-next');
  let figures = [];
  let index = 0;

  function showImage() {
    const original = figures[index].querySelector('img');
    image.src = original.currentSrc || original.src;
    image.alt = original.alt;
    status.textContent = original.alt + ' · ' + (index + 1) + ' из ' + figures.length;
    previous.hidden = next.hidden = figures.length < 2;
  }

  function move(direction) {
    index = (index + direction + figures.length) % figures.length;
    showImage();
  }

  document.getElementById('main-content').addEventListener('click', event => {
    const trigger = event.target.closest('.device-image, .figure-image, .figure-enlarge');
    if (!trigger) return;
    const lecture = trigger.closest('.lesson-view');
    figures = [...lecture.querySelectorAll('.device-card, .lesson-figure')];
    index = figures.indexOf(trigger.closest('figure'));
    frame.toggleAttribute('data-controls', event.pointerType === 'touch' || matchMedia('(hover: none)').matches);
    showImage();
    viewer.showModal();
  });

  image.addEventListener('click', event => {
    if (event.pointerType === 'touch' || matchMedia('(hover: none)').matches) {
      frame.toggleAttribute('data-controls');
    }
  });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  viewer.querySelector('.image-viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('keydown', event => {
    if (figures.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  window.addEventListener('hashchange', () => {
    if (viewer.open) viewer.close();
  });
})();
