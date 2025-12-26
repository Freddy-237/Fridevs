/**
 * HEADER SCROLL ANIMATION
 * 
 * Gère l'effet sticky du header avec changement de fond au scroll
 * - Transparent au top
 * - Fond sombre + blur en dessous
 */

document.addEventListener('DOMContentLoaded', () => {
  
  const header = document.getElementById('main-header');
  
  if (!header) return;

  // Fonction pour gérer le scroll
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
      // Header scrollé: fond sombre + blur
      header.classList.add('bg-[#0B0E14]/90', 'backdrop-blur-md', 'shadow-lg');
      header.classList.remove('bg-transparent');
    } else {
      // Header au top: transparent
      header.classList.remove('bg-[#0B0E14]/90', 'backdrop-blur-md', 'shadow-lg');
      header.classList.add('bg-transparent');
    }
  };

  // Écouter le scroll
  window.addEventListener('scroll', handleScroll);

  // Vérifier la position initiale
  handleScroll();

});
