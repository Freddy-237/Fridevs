// Animation au scroll pour la page À Propos
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      (entry.target as HTMLElement).style.animationPlayState = 'running';
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
  observer.observe(el);
});
