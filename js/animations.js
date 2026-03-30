// Stats Counter Animation
function animateCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  statNumbers.forEach((element, index) => {
    const target = parseInt(element.getAttribute('data-target'));
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    let current = 0;
    
    const delay = index * 150;
    
    setTimeout(() => {
      const duration = 1.5; // segundos
      const increment = target / (duration * 60); // 60 FPS
      const step = setInterval(() => {
        current += increment;
        
        if (current >= target) {
          current = target;
          clearInterval(step);
        }
        
        const displayValue = Math.floor(current);
        element.textContent = prefix + displayValue.toLocaleString() + suffix;
      }, 1000 / 60);
    }, 500 + delay); 
  });
}

function initCargoCarousel() {
  const section = document.querySelector('.cargo-tech-section');
  const media = document.getElementById('cargoMedia');
  const title = document.getElementById('cargoItemTitle');
  const description1 = document.getElementById('cargoDescription1');
  const description2 = document.getElementById('cargoDescription2');
  const stepCurrent = document.getElementById('cargoStepCurrent');
  const stepper = document.querySelector('.cargo-stepper');
  const cargoContent = document.querySelector('.cargo-content');
  const contentMain = document.querySelector('.cargo-content-main');
  const carouselCard = document.getElementById('cargoCarousel');
  const mediaWrap = media.closest('.cargo-media-wrap');

  if (!section || !media || !title || !description1 || !description2 || !stepCurrent || !stepper || !cargoContent || !contentMain) {
    return;
  }

  let hasCenteredCargoContent = false;

  function centerCargoContent() {
    // if (hasCenteredCargoContent) {
    //   return;
    // }

    // hasCenteredCargoContent = true;
    // cargoContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // cargoContent.setAttribute('tabindex', '-1');
    // cargoContent.focus({ preventScroll: true });
  }

  const fallbackSlides = [
    {
      title: 'Consumo',
      image: './resources/notch/consumption.webp',
      alt: 'Pasillo de supermercado',
      text1: 'Atendemos al sector de consumo garantizando cadenas de suministro agiles, seguras y altamente eficientes.',
      text2: 'Gestionamos el movimiento de productos terminados, bienes de uso diario y mercancia de alta rotacion, asegurando entregas puntuales y una operacion flexible que se adapta a picos de demanda y temporadas.'
    }
  ];

  function getLocalizedSlides() {
    const lang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'es';
    const notchSection = window.pageTexts?.notch;
    const localized = notchSection?.[lang]?.slides;
    if (Array.isArray(localized) && localized.length > 0) {
      return localized;
    }

    const defaultSlides = notchSection?.es?.slides;
    if (Array.isArray(defaultSlides) && defaultSlides.length > 0) {
      return defaultSlides;
    }

    return fallbackSlides;
  }

  let slides = getLocalizedSlides();

  const mediaRevealDuration = 460;
  const mediaSwapDelay = 270;

  let currentIndex = 0;
  let wheelLocked = false;
  let touchStartY = 0;
  let centerLockActive = true;
  let renderToken = 0;
  let renderSwapTimeout = null;
  let renderFinalizeTimeout = null;

  function preloadImage(source) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(source);
      image.onerror = () => resolve(source);
      image.src = source;
    });
  }

  function clearRenderTimers() {
    if (renderSwapTimeout !== null) {
      window.clearTimeout(renderSwapTimeout);
      renderSwapTimeout = null;
    }

    if (renderFinalizeTimeout !== null) {
      window.clearTimeout(renderFinalizeTimeout);
      renderFinalizeTimeout = null;
    }
  }

  function renderSlide(index) {
    const token = ++renderToken;
    const item = slides[index];

    clearRenderTimers();
    media.classList.remove('is-entering');
    contentMain.classList.remove('is-entering');
    media.classList.add('is-changing');
    contentMain.classList.add('is-changing');

    if (mediaWrap) {
      mediaWrap.classList.add('is-changing');
    }

    preloadImage(item.image).then(() => {
      if (token !== renderToken) {
        return;
      }

      renderSwapTimeout = window.setTimeout(() => {
        if (token !== renderToken) {
          return;
        }

        media.src = item.image;
        media.alt = item.alt;
        title.textContent = item.title;
        description1.textContent = item.text1;
        description2.textContent = item.text2;
        stepCurrent.textContent = String(index + 1).padStart(2, '0');
        const denominator = Math.max(slides.length - 1, 1);
        const progress = (index / denominator) * 100;
        stepper.style.setProperty('--progress', `${progress}%`);

        media.classList.add('is-entering');
        contentMain.classList.add('is-entering');

        renderFinalizeTimeout = window.setTimeout(() => {
          if (token !== renderToken) {
            return;
          }

          media.classList.remove('is-changing', 'is-entering');
          contentMain.classList.remove('is-changing', 'is-entering');

          if (mediaWrap) {
            mediaWrap.classList.remove('is-changing');
          }
        }, mediaRevealDuration + 20);
      }, mediaSwapDelay);
    });
  }

  function isSectionCentered() {
    const focusTarget = carouselCard || cargoContent || section;
    const rect = focusTarget.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const viewportCenter = vh / 2;
    const targetCenter = rect.top + rect.height / 2;

    // Histéresis: activa con un rango mas amplio y libera mas tarde.
    // Evita perder el bloqueo cuando el usuario hace scroll rapido.
    const enterTolerance = Math.max(110, vh * 0.2);
    const exitTolerance = Math.max(170, vh * 0.3);
    const tolerance = centerLockActive ? exitTolerance : enterTolerance;

    const crossesViewportCenterLine = rect.top <= viewportCenter && rect.bottom >= viewportCenter;
    const isCentered = Math.abs(targetCenter - viewportCenter) <= tolerance || crossesViewportCenterLine;
    const hasEnoughVisibleArea = rect.top < vh * 0.9 && rect.bottom > vh * 0.1;

    centerLockActive = isCentered && hasEnoughVisibleArea;

    return centerLockActive;
  }

  function handleStep(direction) {
    if (direction > 0 && currentIndex < slides.length - 1) {
      currentIndex += 1;
      renderSlide(currentIndex);
      return true;
    }

    if (direction < 0 && currentIndex > 0) {
      currentIndex -= 1;
      renderSlide(currentIndex);
      return true;
    }

    return false;
  }

  function onWheel(event) {
    if (!isSectionCentered()) {
      return;
    }

    const direction = event.deltaY > 0 ? 1 : -1;

    if (wheelLocked) {
      event.preventDefault();
      return;
    }

    const consumed = handleStep(direction);

    if (consumed) {
      event.preventDefault();
      wheelLocked = true;
      window.setTimeout(() => {
        wheelLocked = false;
      }, 420);
    }
  }

  function onKeyDown(event) {
    if (!isSectionCentered()) {
      return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }

    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const consumed = handleStep(direction);
    if (consumed) {
      event.preventDefault();
    }
  }

  function onTouchStart(event) {
    if (event.touches.length > 0) {
      touchStartY = event.touches[0].clientY;
    }
  }

  function onTouchMove(event) {
    if (!isSectionCentered() || event.touches.length === 0) {
      return;
    }

    const delta = touchStartY - event.touches[0].clientY;
    if (Math.abs(delta) < 30) {
      return;
    }

    const direction = delta > 0 ? 1 : -1;
    const consumed = handleStep(direction);
    if (consumed) {
      event.preventDefault();
      touchStartY = event.touches[0].clientY;
    }
  }

  if ('IntersectionObserver' in window) {
    const cargoFocusObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            centerCargoContent();
            observer.disconnect();
          }
        });
      },
      {
        threshold: [0.55]
      }
    );

    cargoFocusObserver.observe(cargoContent);
  }

  renderSlide(currentIndex);

  window.addEventListener('app:language-change', () => {
    slides = getLocalizedSlides();
    if (currentIndex > slides.length - 1) {
      currentIndex = slides.length - 1;
    }

    renderSlide(Math.max(currentIndex, 0));
  });

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
}

function initGalleryImageHoverSwap() {
  const galleryImages = document.querySelectorAll('.service-card--image img');
  if (galleryImages.length === 0) {
    return;
  }

  function buildHoverSrc(source) {
    const queryIndex = source.indexOf('?');
    const hashIndex = source.indexOf('#');
    let cutIndex = source.length;

    if (queryIndex !== -1) {
      cutIndex = Math.min(cutIndex, queryIndex);
    }

    if (hashIndex !== -1) {
      cutIndex = Math.min(cutIndex, hashIndex);
    }

    const basePath = source.slice(0, cutIndex);
    const suffix = source.slice(cutIndex);
    const lastSlash = basePath.lastIndexOf('/');
    const dotIndex = basePath.lastIndexOf('.');

    if (dotIndex <= lastSlash) {
      return `${basePath}_aul${suffix}`;
    }

    if (basePath.slice(lastSlash + 1, dotIndex).endsWith('_azul')) {
      return `${basePath}${suffix}`;
    }

    const pathWithHover = `${basePath.slice(0, dotIndex)}_azul${basePath.slice(dotIndex)}`;
    return `${pathWithHover}${suffix}`;
  }

  galleryImages.forEach((image) => {
    const originalSrc = image.getAttribute('src');
    if (!originalSrc) {
      return;
    }

    const hoverSrc = buildHoverSrc(originalSrc);
    image.dataset.originalSrc = originalSrc;
    image.dataset.hoverSrc = hoverSrc;

    image.addEventListener('mouseenter', () => {
      image.src = image.dataset.hoverSrc;
    });

    image.addEventListener('mouseleave', () => {
      image.src = image.dataset.originalSrc;
    });

    image.addEventListener('focus', () => {
      image.src = image.dataset.hoverSrc;
    });

    image.addEventListener('blur', () => {
      image.src = image.dataset.originalSrc;
    });
  });
}

function initDynamicHeaderOffset() {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');

  if (!root || !header) {
    return;
  }

  let rafId = null;

  function applyOffset() {
    const headerHeight = Math.ceil(header.getBoundingClientRect().height);
    root.style.setProperty('--header-offset', `${headerHeight}px`);
  }

  function requestOffsetUpdate() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      applyOffset();
      rafId = null;
    });
  }

  applyOffset();

  window.addEventListener('resize', requestOffsetUpdate, { passive: true });
  window.addEventListener('orientationchange', requestOffsetUpdate, { passive: true });

  if (document.fonts && typeof document.fonts.ready?.then === 'function') {
    document.fonts.ready.then(requestOffsetUpdate);
  }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initDynamicHeaderOffset();
    animateCounters();
    initCargoCarousel();
    initGalleryImageHoverSwap();
  });
} else {
  initDynamicHeaderOffset();
  animateCounters();
  initCargoCarousel();
  initGalleryImageHoverSwap();
}
