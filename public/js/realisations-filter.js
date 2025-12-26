/**
 * REALISATIONS PAGE - Filtrage et animations
 * 
 * Gère le filtrage des projets par catégorie et les animations au scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-purple-600', 'text-white');
        b.classList.add('bg-[#1a1a2e]', 'text-gray-300');
      });
      btn.classList.add('active', 'bg-purple-600', 'text-white');
      btn.classList.remove('bg-[#1a1a2e]', 'text-gray-300');

      // Filter projects
      projectItems.forEach(item => {
        const categories = item.getAttribute('data-category');
        
        if (filter && categories && (filter === 'all' || categories.includes(filter))) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Animation au scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  projectItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.5s ease';
    observer.observe(item);
  });
});
