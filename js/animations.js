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

function initLenisSmoothScroll() {
  if (!window.Lenis || window.__lenisInitialized) {
    return;
  }

  const lenis = new window.Lenis({
    duration: 1.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.15
  });

  function raf(time) {
    lenis.raf(time);
    if (window.ScrollTrigger) {
      window.ScrollTrigger.update();
    }
    window.requestAnimationFrame(raf);
  }

  window.requestAnimationFrame(raf);
  window.__lenisInitialized = true;
  window.__lenisInstance = lenis;
}

function initCargoCarousel() {
  const section = document.querySelector('.cargo-tech-section');
  const sliderEvent = document.getElementById('Sliderevent');
  const card = document.getElementById('cargoCarousel');
  const mediaWrap = document.querySelector('.cargo-media-wrap');
  const contentMain = document.querySelector('.cargo-content-main');
  const stepCurrent = document.getElementById('cargoStepCurrent');
  const stepTotal = document.querySelector('.cargo-step-bottom');
  const stepper = document.querySelector('.cargo-stepper');

  if (!section || !sliderEvent || !card || !mediaWrap || !contentMain || !stepCurrent || !stepper) {
    return;
  }

  if (!(window.gsap && window.ScrollTrigger)) {
    return;
  }

  window.gsap.registerPlugin(window.ScrollTrigger);

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

  function getLocalizedCta() {
    const lang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'es';
    const notchSection = window.pageTexts?.notch;
    if (notchSection?.[lang]?.cta) {
      return notchSection[lang].cta;
    }
    if (notchSection?.es?.cta) {
      return notchSection.es.cta;
    }
    return lang === 'es' ? 'Conoce nuestras soluciones' : 'Discover our solutions';
  }

  const backgroundPalette = ['#eceef1', '#e7edf8', '#e8f3ef', '#f2ece4', '#e9ecf6', '#ebf2f0'];

  let slides = [];
  let timeline = null;
  let trigger = null;
  let activeTextIndex = -1;
  let progressValue = 0;
  let unbindInteractions = null;
  let isAnimating = false; // Controla si la animación está activa
  let scrollTriggerInstance = null; // Instancia de ScrollTrigger
  let cargoTextTitle = null;
  let cargoTextStrong = null;
  let cargoTextBody = null;
  let cargoCtaButton = null;

  function updateStepper(progress) {
    const normalized = Math.max(0, Math.min(1, progress));
    const total = Math.max(slides.length, 1);
    const stepIndex = Math.min(total - 1, Math.floor(normalized * total));
    const denominator = Math.max(total - 1, 1);
    const fill = (stepIndex / denominator) * 100;
    stepCurrent.textContent = String(stepIndex + 1).padStart(2, '0');
    stepper.style.setProperty('--progress', `${fill}%`);
    return stepIndex;
  }

  function renderTextSlide(index) {
    const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
    const slide = slides[safeIndex] || slides[0];

    if (!slide || !cargoTextTitle || !cargoTextStrong || !cargoTextBody || !cargoCtaButton) {
      return;
    }

    cargoTextTitle.textContent = slide.title || '';
    cargoTextStrong.textContent = slide.text1 || '';
    cargoTextBody.textContent = slide.text2 || '';
    cargoCtaButton.textContent = getLocalizedCta();

    activeTextIndex = safeIndex;
  }

  function buildContent() {
    mediaWrap.innerHTML = [
      '<div class="cargo-media-stack">',
      slides.map((slide, index) => {
        const z = slides.length - index;
        return [
          `<div class="cargo-media-layer" data-layer="${index}" style="z-index:${z};">`,
          `  <img class="cargo-media" src="${slide.image}" alt="${slide.alt || slide.title || 'Vertical image'}">`,
          '</div>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');

    if (stepTotal) {
      stepTotal.textContent = String(slides.length).padStart(2, '0');
    }
    stepCurrent.textContent = '01';
    stepper.style.setProperty('--progress', '0%');

    contentMain.innerHTML = `
      <div class="cargo-text-active">
        <h3 class="cargo-item-title"></h3>
        <p class="cargo-description cargo-description-strong"></p>
        <p class="cargo-description"></p>
        <br><br><br><br><br>
        <br>
      </div>
      <div class="cargo-btn-fixed">
        <a href="#" class="cargo-btn"></a>
      </div>
      <br>
      <br>
      <br>
      <br>
    `;

    cargoTextTitle = contentMain.querySelector('.cargo-text-active .cargo-item-title');
    cargoTextStrong = contentMain.querySelector('.cargo-text-active .cargo-description-strong');
    cargoTextBody = contentMain.querySelector('.cargo-text-active .cargo-description:not(.cargo-description-strong)');
    cargoCtaButton = contentMain.querySelector('.cargo-btn-fixed .cargo-btn');

    renderTextSlide(0);
  }

  function destroyAnimation() {
    if (unbindInteractions) {
      unbindInteractions();
      unbindInteractions = null;
    }

    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }

    if (trigger) {
      trigger.kill();
      trigger = null;
    }
    if (timeline) {
      timeline.kill();
      timeline = null;
    }
    
    isAnimating = false;
    progressValue = 0;
  }

  function applyProgress(nextProgress, force) {
    if (!isAnimating && !force) {
      return;
    }
    
    progressValue = Math.max(0, Math.min(1, nextProgress));
    if (timeline) {
      timeline.progress(progressValue);
    }
    const stepIndex = updateStepper(progressValue);
    if (stepIndex !== activeTextIndex) {
      renderTextSlide(stepIndex);
    }
  }

  function buildScrollAnimation() {
    const gsap = window.gsap;
    const layers = Array.from(mediaWrap.querySelectorAll('.cargo-media-layer'));
    const images = Array.from(mediaWrap.querySelectorAll('.cargo-media'));
    const textActive = contentMain.querySelector('.cargo-text-active');

    destroyAnimation();

    if (layers.length <= 1 || images.length <= 1) {
      updateStepper(0);
      renderTextSlide(0);
      return;
    }

    gsap.set(layers, { clipPath: 'inset(0px 0px 0px 0px)' });
    gsap.set(images, { objectPosition: '50% 50%' });
    gsap.set(textActive, { opacity: 1 });

    // Crear timeline pero PAUSADO inicialmente
    timeline = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
    const bodyColorTarget = document.body;
    const htmlColorTarget = document.documentElement;

    for (let index = 0; index < layers.length - 1; index += 1) {
      const currentLayer = layers[index];
      const currentImage = images[index];
      const nextImage = images[index + 1];
      const bgColor = backgroundPalette[(index + 1) % backgroundPalette.length];

      // Animación de la capa de imagen (reveal)
      timeline.to(currentLayer, {
        clipPath: 'inset(0px 0px 100% 0px)',
        duration: 1
      }, index);

      // Animación de la posición del objeto en la imagen actual
      timeline.to(currentImage, {
        objectPosition: '50% 66%',
        duration: 1
      }, index);

      // Animación de la posición del objeto en la siguiente imagen
      timeline.fromTo(nextImage, {
        objectPosition: '50% 32%'
      }, {
        objectPosition: '50% 50%',
        duration: 1
      }, index);

      // Animación fadeOut del texto actual
      timeline.to(textActive, {
        opacity: 0,
        duration: 0.5
      }, index);

      // Cambio de color de fondo
      timeline.to([bodyColorTarget, htmlColorTarget], {
        backgroundColor: bgColor,
        duration: 0.22
      }, index + 0.98);

      // Animación fadeIn del nuevo texto
      timeline.to(textActive, {
        opacity: 1,
        duration: 0.5
      }, index + 0.5);
    }

    function isSectionCentered() {
      const rect = sliderEvent.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // Activa cuando Sliderevent está realmente en pantalla,
      // evitando la condición anterior que era demasiado estricta.
      return rect.top < vh * 0.9 && rect.bottom > vh * 0.1;
    }

    const progressState = { value: progressValue };
    let progressTween = null;

    function animateToProgress(nextProgress) {
      const target = Math.max(0, Math.min(1, nextProgress));
      if (progressTween) {
        progressTween.kill();
      }

      progressTween = gsap.to(progressState, {
        value: target,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => {
          applyProgress(progressState.value, true);
        }
      });
    }

    function onSectionWheel(event) {
      if (!isAnimating) return; // No procesar si la animación no está activa
      if (!isSectionCentered()) {
        return;
      }

      const delta = event.deltaY;
      const current = progressState.value;
      const next = current + delta * 0.0011;
      const clamped = Math.max(0, Math.min(1, next));
      const atStartGoingUp = current <= 0 && delta < 0;
      const atEndGoingDown = current >= 1 && delta > 0;

      if (atStartGoingUp || atEndGoingDown) {
        return;
      }

      event.preventDefault();
      animateToProgress(clamped);
    }

    // Crear ScrollTrigger para activar la animación cuando la sección entra en el viewport
    scrollTriggerInstance = window.ScrollTrigger.create({
      trigger: sliderEvent,
      start: "top 85%", // Cuando el top de la sección alcanza el 85% del viewport
      end: "bottom 15%", // Hasta que el bottom alcanza el 15% del viewport
      onEnter: () => {
        if (!isAnimating) {
          isAnimating = true;
          // Asegurar que el timeline esté en el progreso correcto
          if (timeline) {
            timeline.progress(progressValue);
          }
        }
      },
      onLeave: () => {
        // Opcional: pausar cuando sale completamente
        // isAnimating = false;
      },
      onEnterBack: () => {
        if (!isAnimating) {
          isAnimating = true;
          if (timeline) {
            timeline.progress(progressValue);
          }
        }
      },
      onLeaveBack: () => {
        // isAnimating = false;
      }
    });

    sliderEvent.addEventListener('wheel', onSectionWheel, { passive: false });
    unbindInteractions = function () {
      sliderEvent.removeEventListener('wheel', onSectionWheel);
      if (progressTween) {
        progressTween.kill();
        progressTween = null;
      }
    };

    // NO aplicar progress automáticamente - esperar a que el usuario haga scroll
    // applyProgress(progressValue); // <-- ELIMINADO: esto causaba la animación automática
  }

  function rebuild() {
    slides = getLocalizedSlides();
    buildContent();
    buildScrollAnimation();
  }

  rebuild();

  window.addEventListener('app:language-change', () => {
    rebuild();
  });

  window.addEventListener('resize', () => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  });
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
    initLenisSmoothScroll();
    animateCounters();
    initCargoCarousel();
    initGalleryImageHoverSwap();
  });
} else {
  initDynamicHeaderOffset();
  initLenisSmoothScroll();
  animateCounters();
  initCargoCarousel();
  initGalleryImageHoverSwap();
}
