// Gestion du formulaire de contact
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Récupération des données du formulaire
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const projectType = document.getElementById('project-type').value;
    const budget = document.getElementById('budget').value;
    const message = document.getElementById('message').value;

    // Formatage du message pour WhatsApp
    let whatsappMessage = `🚀 *Nouvelle demande de projet*\n\n`;
    whatsappMessage += `👤 *Nom:* ${name}\n`;
    whatsappMessage += `📧 *Email:* ${email}\n`;
    
    if (phone) {
      whatsappMessage += `📱 *Téléphone:* ${phone}\n`;
    }
    
    whatsappMessage += `💼 *Type de projet:* ${projectType}\n`;
    
    if (budget) {
      whatsappMessage += `💰 *Budget estimatif:* ${budget}\n`;
    }
    
    whatsappMessage += `\n📝 *Message:*\n${message}`;

    // Encodage pour URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Numéro WhatsApp (format international sans +)
    const whatsappNumber = '237694634551';
    
    // Redirection vers WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'contact_form_submit', project_type: projectType, budget: budget || 'non précisé' });

    window.open(whatsappUrl, '_blank');

    // Message de confirmation
    formMessage.classList.remove('hidden', 'bg-red-500/20', 'text-red-400');
    formMessage.classList.add('bg-green-500/20', 'text-green-400', 'border', 'border-green-500/30');
    formMessage.textContent = '✓ Redirection vers WhatsApp... Envoyez le message pour finaliser votre demande.';
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
      formMessage.classList.add('hidden');
    }, 5000);
  });
}

// Gestion FAQ Accordéon
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  const icon = question.querySelector('svg');

  question.addEventListener('click', () => {
    const isOpen = !answer.classList.contains('hidden');

    // Fermer tous les autres items
    faqItems.forEach(otherItem => {
      const otherAnswer = otherItem.querySelector('.faq-answer');
      const otherIcon = otherItem.querySelector('.faq-question svg');
      
      if (otherItem !== item) {
        otherAnswer.classList.add('hidden');
        otherIcon.style.transform = 'rotate(0deg)';
      }
    });

    // Toggle l'item actuel
    if (isOpen) {
      answer.classList.add('hidden');
      icon.style.transform = 'rotate(0deg)';
    } else {
      answer.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
    }
  });
});

// Animation au scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
  observer.observe(el);
});

// Scroll smooth vers le formulaire
const ctaLinks = document.querySelectorAll('a[href="#contact-form"]');
ctaLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const formSection = document.getElementById('contact-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});
