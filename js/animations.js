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

  const slides = [
    {
      title: 'Consumo',
      image: './resources/notch/consumption.webp',
      alt: 'Pasillo de supermercado',
      text1: 'Atendemos al sector de consumo garantizando cadenas de suministro ágiles, seguras y altamente eficientes.',
      text2: 'Gestionamos el movimiento de productos terminados, bienes de uso diario y mercancía de alta rotación, asegurando entregas puntuales y una operación flexible que se adapta a picos de demanda y temporadas.'
    },
    {
      title: 'Pharma',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
      alt: 'Laboratorio farmaceutico',
      text1: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.',
      text2: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.'
    },
    {
      title: 'Automotriz',
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80',
      alt: 'Linea de produccion automotriz',
      text1: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.',
      text2: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.'
    },
    {
      title: 'Retail',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Centro de distribucion retail',
      text1: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.',
      text2: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.'
    },
    {
      title: 'Tecnologia',
      image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
      alt: 'Componentes de tecnologia',
      text1: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.',
      text2: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.'
    },
    {
      title: 'Aeroespacial',
      image: 'https://images.unsplash.com/photo-1517976547714-720226b864c1?auto=format&fit=crop&w=1200&q=80',
      alt: 'Industria aeroespacial',
      text1: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.',
      text2: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam mumy nibh euismod tincidunt ut laoreet dolore magna.'
    }
  ];

  let currentIndex = 0;
  let wheelLocked = false;
  let touchStartY = 0;

  function renderSlide(index) {
    const item = slides[index];
    media.classList.add('is-changing');
    contentMain.classList.add('is-changing');

    setTimeout(() => {
      media.src = item.image;
      media.alt = item.alt;
      title.textContent = item.title;
      description1.textContent = item.text1;
      description2.textContent = item.text2;
      stepCurrent.textContent = String(index + 1).padStart(2, '0');
      const progress = (index / (slides.length - 1)) * 100;
      stepper.style.setProperty('--progress', `${progress}%`);
      media.classList.remove('is-changing');
      contentMain.classList.remove('is-changing');
    }, 120);
  }

  function inSectionViewport() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= vh * 0.35 && rect.bottom >= vh * 0.6;
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
    if (!inSectionViewport()) {
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
    if (!inSectionViewport()) {
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
    if (!inSectionViewport() || event.touches.length === 0) {
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

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
    initCargoCarousel();
  });
} else {
  animateCounters();
  initCargoCarousel();
}
