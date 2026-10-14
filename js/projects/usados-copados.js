(() => {
  const sectionNav = document.querySelector('.section-nav');
  const sectionLinks = [...document.querySelectorAll('.section-nav a[href^="#"]')];
  const trackedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sectionNav && trackedSections.length) {
    let scheduled = false;

    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * .28;
      let activeSection = null;

      trackedSections.forEach((section) => {
        if (section.offsetTop <= marker) activeSection = section;
      });

      sectionLinks.forEach((link) => {
        const isActive = activeSection && link.getAttribute('href') === `#${activeSection.id}`;
        link.classList.toggle('is-active', Boolean(isActive));
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });

      scheduled = false;
    };

    const requestActiveSectionUpdate = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateActiveSection);
    };

    sectionLinks.forEach((link) => link.addEventListener('click', () => {
      sectionLinks.forEach((item) => item.classList.toggle('is-active', item === link));
    }));
    window.addEventListener('scroll', requestActiveSectionUpdate, { passive: true });
    window.addEventListener('resize', requestActiveSectionUpdate);
    updateActiveSection();
  }

  const viewer = document.querySelector('#image-viewer');
  if (!viewer) return;

  const stage = viewer.querySelector('.image-viewer__stage');
  const image = stage.querySelector('img');
  const title = viewer.querySelector('#image-viewer-title');
  const fitButton = viewer.querySelector('[data-view="fit"]');
  const actualButton = viewer.querySelector('[data-view="actual"]');
  const closeButton = viewer.querySelector('[data-view="close"]');

  let scale = 1;
  let fitScale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let mode = 'fit';
  let returnFocus = null;

  const clampOffsets = () => {
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    const maxX = Math.max(0, (width - stage.clientWidth) / 2 + 40);
    const maxY = Math.max(0, (height - stage.clientHeight) / 2 + 40);
    offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
    offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
  };

  const render = () => {
    clampOffsets();
    image.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale})`;
  };

  const calculateFitScale = () => {
    if (!image.naturalWidth || !image.naturalHeight) return 1;
    return Math.min(
      (stage.clientWidth - 40) / image.naturalWidth,
      (stage.clientHeight - 40) / image.naturalHeight,
      1
    );
  };

  const fitImage = () => {
    fitScale = calculateFitScale();
    scale = fitScale;
    offsetX = 0;
    offsetY = 0;
    mode = 'fit';
    render();
  };

  const showActualSize = () => {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    mode = 'actual';
    render();
  };

  const closeViewer = () => {
    viewer.hidden = true;
    document.body.classList.remove('viewer-open');
    image.removeAttribute('src');
    if (returnFocus) returnFocus.focus();
  };

  document.querySelectorAll('a.zoom-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const thumbnail = link.querySelector('img');
      returnFocus = link;
      const description = thumbnail?.alt || link.getAttribute('aria-label') || 'Image detail';
      title.textContent = description;
      image.alt = description;
      viewer.hidden = false;
      document.body.classList.add('viewer-open');
      image.onload = fitImage;
      image.src = link.href;
      if (image.complete) fitImage();
      closeButton.focus();
    });
  });

  fitButton.addEventListener('click', fitImage);
  actualButton.addEventListener('click', showActualSize);
  closeButton.addEventListener('click', closeViewer);

  stage.addEventListener('dblclick', () => {
    if (mode === 'fit') showActualSize();
    else fitImage();
  });

  stage.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    originX = offsetX;
    originY = offsetY;
    stage.classList.add('is-dragging');
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    offsetX = originX + event.clientX - startX;
    offsetY = originY + event.clientY - startY;
    render();
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  };

  stage.addEventListener('pointerup', stopDragging);
  stage.addEventListener('pointercancel', stopDragging);

  stage.addEventListener('wheel', (event) => {
    event.preventDefault();
    fitScale = calculateFitScale();
    const step = event.deltaY < 0 ? 1.12 : .89;
    scale = Math.max(fitScale, Math.min(4, scale * step));
    mode = Math.abs(scale - fitScale) < .01 ? 'fit' : 'custom';
    render();
  }, { passive: false });

  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) closeViewer();
  });

  document.addEventListener('keydown', (event) => {
    if (!viewer.hidden && event.key === 'Escape') closeViewer();
  });

  window.addEventListener('resize', () => {
    if (!viewer.hidden && mode === 'fit') fitImage();
  });
})();
