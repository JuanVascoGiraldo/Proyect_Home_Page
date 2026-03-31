(function () {
  const supported = ['es', 'en'];
  const storageKey = 'site-lang';

  function normalizeLanguage(value) {
    const lang = (value || '').toLowerCase().slice(0, 2);
    return supported.includes(lang) ? lang : 'es';
  }

  function getSection(sectionName, lang) {
    const allTexts = window.pageTexts || {};
    const section = allTexts[sectionName] || {};
    return section[lang] || section.es || {};
  }

  function setNodeText(node, text) {
    if (node && typeof text === 'string') {
      node.textContent = text;
    }
  }

  function setButtonLabel(button, label) {
    if (!button || typeof label !== 'string') {
      return;
    }

    if (button.childNodes.length > 0) {
      button.childNodes[0].nodeValue = `${label} `;
      return;
    }

    button.textContent = label;
  }

  function applyHeader(lang) {
    const data = getSection('header', lang);
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    navLinks.forEach((link, index) => {
      if (data.nav && data.nav[index]) {
        link.textContent = data.nav[index];
      }
    });

    const countryNode = document.querySelector('.locale-country');
    if (countryNode && data.country) {
      const textNode = countryNode.childNodes[countryNode.childNodes.length - 1];
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.nodeValue = ` ${data.country}`;
      }
    }

    const langSelect = document.querySelector('.lang-select');
    if (langSelect) {
      langSelect.value = lang;
    }

    const langButton = document.querySelector('.lang-btn');
    if (langButton) {
      setButtonLabel(langButton, data.langLabel || (lang === 'es' ? 'ESP' : 'ENG'));
    }
  }

  function applyHero(lang) {
    const data = getSection('hero', lang);
    setNodeText(document.querySelector('.hero-title'), data.title);
    setNodeText(document.querySelector('.hero-text'), data.text);

    const primaryButton = document.querySelector('.hero-btn-primary');
    if (primaryButton) {
      const labelNode = primaryButton.childNodes[0];
      if (labelNode && labelNode.nodeType === Node.TEXT_NODE) {
        labelNode.nodeValue = data.primaryCta ? `${data.primaryCta}` : labelNode.nodeValue;
      }
    }

    setNodeText(document.querySelector('.hero-btn-outline'), data.secondaryCta);

    const statLabels = document.querySelectorAll('.stats-bar .stat-label');
    statLabels.forEach((label, index) => {
      if (data.stats && data.stats[index]) {
        label.innerHTML = data.stats[index];
      }
    });
  }

  function applyInnovation(lang) {
    const data = getSection('innovation', lang);
    setNodeText(document.querySelector('.innovation-kicker'), data.kicker);
    setNodeText(document.querySelector('.innovation-title'), data.title);
    setNodeText(document.querySelector('.innovation-text'), data.intro);
    setNodeText(document.querySelector('.innovation-btn'), data.cta);

    const itemTitles = document.querySelectorAll('.innovation-item-title');
    itemTitles.forEach((title, index) => {
      if (data.items && data.items[index]) {
        title.textContent = data.items[index];
      }
    });

    const itemBodies = document.querySelectorAll('.innovation-panel-inner p');
    itemBodies.forEach((body, index) => {
      if (data.itemBodies && data.itemBodies[index]) {
        body.textContent = data.itemBodies[index];
      }
    });
  }

  function applyNotch(lang) {
    const data = getSection('notch', lang);
    setNodeText(document.querySelector('.cargo-kicker'), data.kicker);
    setNodeText(document.querySelector('.cargo-subtitle'), data.subtitle);
    setNodeText(document.querySelector('.cargo-lead'), data.lead);
    setNodeText(document.getElementById('cargoBtn'), data.cta);

    const stepBottom = document.querySelector('.cargo-step-bottom');
    setNodeText(stepBottom, data.stepTotal || '06');
  }

  function applyServices(lang) {
    const data = getSection('services', lang);
    const introCard = document.querySelector('.service-card--1 .service-solid-content');
    if (introCard) {
      setNodeText(introCard.querySelector('.service-titulo'), data.introTitle);
      setNodeText(introCard.querySelector('.service-subtitulo'), data.introSubtitle);
      setNodeText(introCard.querySelector('.service-texto'), data.introText);

      const cta = introCard.querySelector('.hero-btn-primary');
      if (cta) {
        const labelNode = cta.childNodes[0];
        if (labelNode && labelNode.nodeType === Node.TEXT_NODE && data.introCta) {
          labelNode.nodeValue = data.introCta;
        }
      }
    }

    const hoverBlocks = document.querySelectorAll('.service-card--image .texto-hover');
    hoverBlocks.forEach((block, index) => {
      if (!data.cards || !data.cards[index]) {
        return;
      }

      const cardData = data.cards[index];
      setNodeText(block.querySelector('.service-titulo'), cardData.title);
      setNodeText(block.querySelector('.service-subtitulo'), cardData.subtitle);
      setNodeText(block.querySelector('.service-texto'), cardData.text);
    });
  }

  function applyTraceability(lang) {
    const data = getSection('traceability', lang);
    setNodeText(document.querySelector('.traceability-kicker'), data.kicker);
    setNodeText(document.querySelector('.traceability-title'), data.title);
    setNodeText(document.querySelector('.traceability-text'), data.text);

    const featureLabels = document.querySelectorAll('.traceability-grid .trace-item span');
    featureLabels.forEach((feature, index) => {
      if (data.features && data.features[index]) {
        feature.textContent = data.features[index];
      }
    });
  }

  function applySecurity(lang) {
    const data = getSection('security', lang);
    setNodeText(document.querySelector('.security-kicker'), data.kicker);
    setNodeText(document.querySelector('.security-title'), data.title);
    setNodeText(document.querySelector('.security-text'), data.text);
    setNodeText(document.querySelector('.security-btn'), data.cta);
    setNodeText(document.querySelector('.security-list-title'), data.listTitle);

    const controls = document.querySelectorAll('.security-list li');
    controls.forEach((item, index) => {
      if (data.controls && data.controls[index]) {
        item.textContent = data.controls[index];
      }
    });
  }

  function applyPerformance(lang) {
    const data = getSection('performance', lang);
    setNodeText(document.querySelector('.performance-kicker'), data.kicker);
    setNodeText(document.querySelector('.performance-title'), data.title);

    const paragraphs = document.querySelectorAll('.performance-card--text .performance-text');
    if (paragraphs[0] && data.text1) {
      paragraphs[0].textContent = data.text1;
    }

    if (paragraphs[1] && data.text2) {
      paragraphs[1].textContent = data.text2;
    }

    const checks = document.querySelectorAll('.performance-check-list li span:last-child');
    checks.forEach((item, index) => {
      if (data.checks && data.checks[index]) {
        item.textContent = data.checks[index];
      }
    });
  }

  function applyInfrastructure(lang) {
    const data = getSection('infrastructure', lang);
    setNodeText(document.querySelector('.infrastructure-text'), data.text);
  }

  function applyFooter(lang) {
    const data = getSection('footer', lang);

    const footerMeta = document.querySelector('.footer-meta');
    if (footerMeta && data.copyrightPrefix && data.privacy) {
      footerMeta.innerHTML = `${data.copyrightPrefix} <a href="#" class="footer-inline-link">${data.privacy}</a>`;
    }

    setNodeText(document.querySelector('.footer-address'), data.address);

    const footerTitles = document.querySelectorAll('.footer-title');
    if (footerTitles[0]) {
      footerTitles[0].textContent = data.menuTitle || footerTitles[0].textContent;
    }

    if (footerTitles[1]) {
      footerTitles[1].textContent = data.contactTitle || footerTitles[1].textContent;
    }

    const menuLinks = document.querySelectorAll('.footer-nav a');
    menuLinks.forEach((link, index) => {
      if (data.menuLinks && data.menuLinks[index]) {
        link.textContent = data.menuLinks[index];
      }
    });
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    applyHeader(lang);
    applyHero(lang);
    applyInnovation(lang);
    applyNotch(lang);
    applyServices(lang);
    applyTraceability(lang);
    applySecurity(lang);
    applyPerformance(lang);
    applyInfrastructure(lang);
    applyFooter(lang);

    window.dispatchEvent(new CustomEvent('app:language-change', { detail: { lang } }));
  }

  function setLanguage(lang) {
    const normalized = normalizeLanguage(lang);
    window.currentLanguage = normalized;
    window.localStorage.setItem(storageKey, normalized);
    applyLanguage(normalized);
  }

  function init() {
    const persisted = normalizeLanguage(window.localStorage.getItem(storageKey));
    const initial = normalizeLanguage(window.currentLanguage || document.documentElement.lang || persisted);
    window.currentLanguage = initial;

    const langSelect = document.querySelector('.lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (event) => {
        setLanguage(event.target.value);
      });
    }

    const langButton = document.querySelector('.lang-btn');
    if (langButton) {
      langButton.addEventListener('click', () => {
        const next = window.currentLanguage === 'es' ? 'en' : 'es';
        setLanguage(next);
      });
    }

    applyLanguage(initial);
  }

  window.getCurrentLanguage = function () {
    return normalizeLanguage(window.currentLanguage || 'es');
  };

  window.setLanguage = setLanguage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
