/**
 * PROCESS ANIMATION
 * 
 * Animation du process de travail au scroll
 * - Révèle les étapes progressivement
 * - Active la ligne de connexion
 * - Ajoute des effets au survol
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
  
  const processSteps = document.querySelectorAll('.process-step');
  const processLine = document.querySelector('.process-line');

  if (processSteps.length === 0) return;

  // Configuration de l'Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  // Fonction callback pour l'observer
  const handleIntersect = (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Animation d'entrée avec délai progressif
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Animation de la ligne de connexion
          if (processLine) {
            const progress = ((parseInt(entry.target.dataset.step) - 1) / (processSteps.length - 1)) * 100;
            processLine.style.background = `linear-gradient(to right, 
              rgb(147, 51, 234) 0%, 
              rgb(168, 85, 247) ${progress}%, 
              rgba(147, 51, 234, 0.2) ${progress}%, 
              rgba(147, 51, 234, 0.2) 100%)`;
          }
        }, parseInt(entry.target.dataset.step) * 150);

        // Une fois animé, on arrête d'observer cet élément
        observer.unobserve(entry.target);
      }
    });
  };

  // Créer l'observer
  const observer = new IntersectionObserver(handleIntersect, observerOptions);

  // Observer chaque étape
  processSteps.forEach((step, index) => {
    // Style initial pour l'animation
    step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Observer l'élément
    observer.observe(step);
  });

  // Animation de la ligne au chargement
  if (processLine) {
    processLine.style.transition = 'background 0.8s ease';
  }

  // Effet hover supplémentaire sur les étapes
  processSteps.forEach(step => {
    step.addEventListener('mouseenter', () => {
      step.style.transform = 'translateY(-5px) scale(1.02)';
    });

    step.addEventListener('mouseleave', () => {
      step.style.transform = 'translateY(0) scale(1)';
    });
  });

});
