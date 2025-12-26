/**
 * HERO ANIMATION
 * 
 * Gère les animations de la section Hero :
 * - Animation motion du titre
 * - Animation des cercles et points lumineux
 * - Animation de parallaxe au mouvement de la souris
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
  
  // ========== ANIMATION DU TITRE MOTION ==========
  const heroTitle = document.querySelector('.hero-title-animated');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    
    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.animation = 'slideInUp 0.8s ease-out forwards';
    }, 200);

    // Effet de glow subtil sur le titre
    setInterval(() => {
      heroTitle.style.textShadow = '0 0 20px rgba(139, 92, 246, 0.3)';
      setTimeout(() => {
        heroTitle.style.textShadow = 'none';
      }, 1000);
    }, 3000);
  }

  // Animation du texte au chargement
  const heroText = document.querySelector('.hero-text-fade');
  if (heroText) {
    setTimeout(() => {
      heroText.style.opacity = '0';
      heroText.style.transform = 'translateY(20px)';
      heroText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      
      setTimeout(() => {
        heroText.style.opacity = '1';
        heroText.style.transform = 'translateY(0)';
      }, 100);
    }, 100);
  }

  // Animation des cercles concentriques
  const circles = [
    document.querySelector('.hero-circle-1'),
    document.querySelector('.hero-circle-2'),
    document.querySelector('.hero-circle-3')
  ];

  circles.forEach((circle, index) => {
    if (circle) {
      circle.style.animation = `pulse ${3 + index}s ease-in-out infinite`;
    }
  });

  // Animation des points lumineux
  const dots = document.querySelectorAll('.hero-dot');
  dots.forEach((dot, index) => {
    if (dot) {
      dot.style.animation = `float ${2 + (index * 0.5)}s ease-in-out infinite`;
      dot.style.animationDelay = `${index * 0.2}s`;
    }
  });

  // Animation de parallaxe au mouvement de la souris
  const visualContainer = document.querySelector('.hero-visual-container');
  if (visualContainer) {
    visualContainer.addEventListener('mousemove', (e) => {
      const rect = visualContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      circles.forEach((circle, index) => {
        if (circle) {
          const speed = (index + 1) * 10;
          circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        }
      });

      dots.forEach((dot, index) => {
        if (dot) {
          const speed = (index + 1) * 15;
          dot.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        }
      });
    });
  }

  // Animation de la grille de fond
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    heroGrid.style.backgroundImage = `
      linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
    `;
    heroGrid.style.backgroundSize = '50px 50px';
    heroGrid.style.width = '100%';
    heroGrid.style.height = '100%';
  }

  // Animation du laptop 3D
  const laptop3d = document.querySelector('.laptop-3d');
  if (laptop3d) {
    laptop3d.style.animation = 'float 3s ease-in-out infinite';
  }

});

// ========== DÉFINITION DES KEYFRAMES CSS ==========
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.5;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Styles pour le laptop 3D */
  .laptop-3d {
    width: 200px;
    height: 150px;
    position: relative;
    transform: rotateX(-25deg) rotateY(-35deg);
    transition: transform 0.5s ease;
  }

  .laptop-3d:hover {
    transform: rotateX(-20deg) rotateY(-30deg) scale(1.08);
  }

  .laptop-screen {
    width: 180px;
    height: 110px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 3px solid #8B5CF6;
    border-radius: 8px 8px 0 0;
    position: relative;
    transform-origin: bottom;
    transform: rotateY(25deg);
    box-shadow: -10px 10px 40px rgba(139, 92, 246, 0.5),
                inset 0 0 20px rgba(139, 92, 246, 0.1);
    overflow: hidden;
  }

  .screen-content {
    padding: 10px;
    height: 100%;
  }

  .code-line {
    height: 8px;
    background: linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%);
    border-radius: 4px;
    margin-bottom: 6px;
    animation: codePulse 2s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  }

  .code-line.short {
    width: 60%;
  }

  .laptop-base {
    width: 200px;
    height: 12px;
    background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
    border-radius: 0 0 8px 8px;
    position: absolute;
    bottom: -12px;
    left: -10px;
    box-shadow: 0 5px 20px rgba(139, 92, 246, 0.5);
  }

  .laptop-keyboard {
    width: 200px;
    height: 8px;
    background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
    position: absolute;
    bottom: -20px;
    left: -10px;
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(139, 92, 246, 0.3);
  }

  @keyframes codePulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
