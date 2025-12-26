# 🎨 Guide de Personnalisation FRIDEVS

Ce guide vous permet de personnaliser facilement le site FRIDEVS selon vos besoins.

## 🎨 Couleurs

### Palette Principale
Modifiez les couleurs dans vos composants en remplaçant les classes Tailwind :

```css
/* Couleur violet principal */
bg-purple-600     → Boutons principaux
text-purple-400   → Liens et accents
border-purple-500 → Bordures interactives

/* Couleurs de fond */
bg-[#0B0E14]     → Fond noir principal
bg-[#111827]     → Fond gris sombre
bg-[#2A234A]     → Fond violet foncé
bg-black         → Noir pur (footer)
```

### Personnalisation des Couleurs
Pour changer la couleur principale de violet à une autre :

1. **Dans tous les composants**, remplacer :
   - `purple-600` → `votre-couleur-600`
   - `purple-500` → `votre-couleur-500`
   - `purple-400` → `votre-couleur-400`

2. **Couleurs disponibles dans Tailwind** :
   - `blue` (bleu)
   - `indigo` (indigo)
   - `green` (vert)
   - `red` (rouge)
   - `orange` (orange)
   - `pink` (rose)
   - `teal` (turquoise)

## ✏️ Textes

### Titres Principaux
Fichier : `src/components/[NomComposant].astro`

```astro
<!-- Exemple dans Hero.astro -->
<h1>VOTRE NOUVEAU TITRE</h1>
```

### Sous-titres et Descriptions
Recherchez les balises `<p>` avec la classe `text-gray-300` ou `text-gray-400` pour modifier les descriptions.

### Textes Clés à Personnaliser

#### Hero Section (`Hero.astro`)
```astro
<h1>
  FRIDEVS conçoit des solutions digitales qui accélèrent la croissance des entreprises.
</h1>

<p>
  Nous développons des sites web, applications et outils métiers performants, pensés pour générer de vrais résultats.
</p>
```

#### CTA Final (`CtaFinal.astro`)
```astro
<h2>
  Prêt à faire évoluer votre projet digital ?
</h2>
```

## 🖼️ Images

### Logo
Remplacez le fichier : `public/images/f.png`

Taille recommandée : 200x200px (PNG transparent)

Utilisé dans :
- `src/components/Header.astro` (ligne ~13)
- `src/components/Footer.astro` (ligne ~26)

### Images des Projets
Remplacez les placeholders SVG dans `Realisations.astro` par de vraies images :

```astro
<!-- Avant (placeholder) -->
<div class="absolute inset-0 flex items-center justify-center">
  <svg>...</svg>
</div>

<!-- Après (image réelle) -->
<img 
  src="/images/projet-1.jpg" 
  alt="Description du projet"
  class="absolute inset-0 w-full h-full object-cover"
/>
```

## 📞 Coordonnées

### Footer (`Footer.astro`)

```astro
<!-- Email -->
<a href="mailto:contact@fridevs.com">
  contact@fridevs.com
</a>

<!-- Téléphone -->
<a href="tel:+33000000000">
  +33 (0)X XX XX XX XX
</a>

<!-- Adresse -->
<span>Paris, France</span>
```

### CTA Final (`CtaFinal.astro`)

```astro
<!-- Téléphone dans le bouton -->
<a href="tel:+33000000000">
  Appelez-nous
</a>
```

## 🔗 Réseaux Sociaux

### Footer (`Footer.astro`)

Remplacez les `href="#"` par vos vrais liens :

```astro
<!-- LinkedIn -->
<a href="https://linkedin.com/company/votre-entreprise">

<!-- GitHub -->
<a href="https://github.com/votre-organisation">

<!-- Twitter -->
<a href="https://twitter.com/votre-compte">
```

## 📊 Chiffres Clés

### Crédibilité (`Credibilite.astro`)

```astro
<!-- Années d'expérience -->
<div class="text-5xl md:text-6xl font-bold">
  5+
</div>

<!-- Projets livrés -->
<div class="text-5xl md:text-6xl font-bold">
  50+
</div>

<!-- Clients satisfaits -->
<div class="text-5xl md:text-6xl font-bold">
  98%
</div>
```

## 🎯 Services

### Solutions FRIDEVS (`SolutionsFridevs.astro`)

Modifiez ou ajoutez des services :

```astro
<div class="solution-card ...">
  <h3>Nom du Service</h3>
  <p>Description du service...</p>
  <a href="/lien-vers-page">En savoir plus</a>
</div>
```

## 🛠️ Technologies

### Crédibilité (`Credibilite.astro`)

Ajoutez ou retirez des logos de technologies :

```astro
<div class="tech-logo ...">
  <svg><!-- Logo SVG --></svg>
  <span>Nom de la techno</span>
</div>
```

**Sources de logos SVG** :
- [Simple Icons](https://simpleicons.org/)
- [DevIcons](https://devicon.dev/)

## ⚙️ Polices

### Changer la Police Principale

Dans `Layout.astro`, modifiez le lien Google Fonts :

```html
<!-- Exemple : Remplacer DM Sans par Poppins -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

Puis dans les composants, changez :
```css
font-family: 'DM Sans' → font-family: 'Poppins'
```

## 🎬 Animations

### Désactiver les Animations

Supprimez ou commentez les imports de scripts dans les composants :

```astro
<!-- <script type="module" src="/js/hero-animation.js" defer></script> -->
```

### Modifier la Vitesse des Animations

Dans `public/js/hero-animation.js` :

```javascript
// Durée de l'animation pulse (en secondes)
circle.style.animation = `pulse ${3 + index}s ease-in-out infinite`;

// Changez 3 en 1, 2, 5, etc.
```

## 📱 Menu Mobile

### Hamburger Button (`Header.astro`)

Pour changer l'icône du menu mobile :

```astro
<!-- Actuel -->
<button id="mobile-menu-btn">
  ☰
</button>

<!-- Avec SVG -->
<button id="mobile-menu-btn">
  <svg><!-- Icône SVG --></svg>
</button>
```

## 🔧 Configuration Avancée

### Ajouter un Formulaire de Contact

Créez `src/components/ContactForm.astro` :

```astro
<form action="/api/contact" method="POST">
  <input type="text" name="name" placeholder="Nom" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <button type="submit">Envoyer</button>
</form>
```

### Ajouter Google Analytics

Dans `Layout.astro`, avant `</head>` :

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 💡 Conseils

### Tester les Modifications
```bash
npm run dev
```

### Build de Production
```bash
npm run build
npm run preview
```

### Réinitialiser les Styles
Si quelque chose ne fonctionne pas, vérifiez `src/styles/global.css` pour les conflits de styles.

---

**🎉 Bon développement !**
