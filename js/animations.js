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

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', animateCounters);
} else {
  animateCounters();
}
