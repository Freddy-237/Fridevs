# 📊 Configuration Google Analytics & Search Console

## 🎯 ÉTAPE 1: Créer un compte Google Analytics 4 (GA4)

### 1. Accéder à Google Analytics
- Aller sur: https://analytics.google.com/
- Se connecter avec votre compte Google
- Cliquer sur "Commencer à mesurer"

### 2. Configurer la propriété
1. **Nom du compte**: FRIDEVS
2. **Nom de la propriété**: FRIDEVS Website
3. **Fuseau horaire**: (GMT+01:00) Afrique centrale occidentale
4. **Devise**: Franc CFA (XAF) ou Euro (EUR)

### 3. Ajouter un flux de données Web
1. Cliquer sur "Web"
2. **URL du site web**: `https://fridevs.com`
3. **Nom du flux**: FRIDEVS Production
4. Cliquer sur "Créer un flux"

### 4. Récupérer l'ID de mesure
- Vous obtiendrez un ID du type: **G-XXXXXXXXXX**
- Exemple: `G-ABC123XYZ`

---

## 🔧 ÉTAPE 2: Configurer le site

### Remplacer l'ID Google Analytics
Dans le fichier `src/layouts/Layout.astro`, remplacer:

```astro
<!-- Google Analytics (GA4) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX'); // ⚠️ REMPLACER ICI
</script>
```

**Par votre véritable ID**:
```astro
gtag('config', 'G-ABC123XYZ'); // Votre ID réel
```

---

## 🔍 ÉTAPE 3: Configurer Google Search Console

### 1. Accéder à Search Console
- Aller sur: https://search.google.com/search-console/
- Cliquer sur "Ajouter une propriété"

### 2. Choisir le type de propriété
- Sélectionner: **Préfixe d'URL**
- Entrer: `https://fridevs.com`

### 3. Vérifier la propriété (Méthode recommandée: Balise HTML)
1. Choisir "Balise HTML"
2. Copier le code de vérification (exemple: `abc123def456ghi789`)
3. Dans `src/layouts/Layout.astro`, remplacer:

```astro
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
```

Par:
```astro
<meta name="google-site-verification" content="abc123def456ghi789" />
```

4. Déployer le site
5. Retourner dans Search Console et cliquer sur "Vérifier"

---

## 📈 ÉTAPE 4: Configurer le Sitemap dans Search Console

Une fois la propriété vérifiée:

1. Dans Search Console, aller dans **Sitemaps** (menu gauche)
2. Ajouter le sitemap: `https://fridevs.com/sitemap-index.xml`
3. Cliquer sur "Envoyer"

---

## ✅ ÉTAPE 5: Rebuild et déployer

```bash
# Rebuild avec les nouveaux IDs
npm run build

# Déployer sur votre hébergeur (Netlify/Vercel/autre)
```

---

## 🎯 Données disponibles après configuration

### Google Analytics 4 (GA4) trackera:
- ✅ Nombre de visiteurs (temps réel)
- ✅ Pages vues par page
- ✅ Durée de session
- ✅ Taux de rebond
- ✅ Sources de trafic (Google, Direct, Réseaux sociaux, etc.)
- ✅ Événements (clics sur boutons WhatsApp, navigation, etc.)
- ✅ Conversions (formulaires, appels à l'action)
- ✅ Données démographiques (âge, pays, appareils)

### Google Search Console trackera:
- ✅ Position moyenne dans les résultats Google
- ✅ Impressions (combien de fois votre site apparaît)
- ✅ Clics depuis Google
- ✅ Taux de clic (CTR)
- ✅ Requêtes de recherche qui amènent du trafic
- ✅ Performance par page
- ✅ Couverture d'indexation (pages indexées/erreurs)
- ✅ Core Web Vitals (LCP, CLS, FID)
- ✅ Problèmes d'ergonomie mobile

---

## 🔔 Événements personnalisés (Optionnel)

Pour suivre des actions spécifiques (clics WhatsApp, soumissions formulaire):

```javascript
// Dans contact.js, par exemple
gtag('event', 'contact_form_submit', {
  'event_category': 'engagement',
  'event_label': 'Contact Form'
});

// Pour bouton WhatsApp
gtag('event', 'whatsapp_click', {
  'event_category': 'conversion',
  'event_label': 'WhatsApp CTA'
});
```

---

## 📊 Délais d'activation

- **Google Analytics**: Données visibles en **temps réel** immédiatement
- **Search Console**: Premières données sous **2-3 jours**
- **Référencement complet**: **1-2 semaines** pour voir l'évolution

---

## ⚠️ IMPORTANT

1. **Remplacer `G-XXXXXXXXXX`** par votre véritable ID GA4
2. **Remplacer `YOUR_VERIFICATION_CODE_HERE`** par votre code Search Console
3. **Rebuild le site** après modifications
4. **Déployer** en production

---

## 🔗 Liens utiles

- Google Analytics: https://analytics.google.com/
- Google Search Console: https://search.google.com/search-console/
- Documentation GA4: https://support.google.com/analytics/answer/10089681
- Documentation Search Console: https://support.google.com/webmasters/
