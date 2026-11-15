# FRIDEVS — site vitrine

Site de l'agence FRIDEVS : [fridevs.com](https://fridevs.com).
Astro 5 + Tailwind CSS 4, site 100 % statique déployé sur Vercel.

## Commandes

| Commande          | Action                                           |
| ----------------- | ------------------------------------------------ |
| `npm install`     | Installe les dépendances                         |
| `npm run dev`     | Serveur local sur `http://localhost:4321`        |
| `npm run build`   | Génère le site dans `dist/`                      |
| `npm run preview` | Prévisualise le build de production en local     |

## Structure

```
public/            fichiers servis tels quels (images, JS, favicons, robots.txt)
src/components/    sections réutilisables (Header, Footer, Hero, CookieBanner…)
src/layouts/       Layout.astro (SEO, GTM, consentement) et LegalPage.astro
src/pages/         une page = une URL (realisations/ contient les études de cas)
src/styles/        global.css (Tailwind + styles globaux)
vercel.json        en-têtes de cache et de sécurité, URLs propres
```

## Déploiement

- Chaque push sur `main` déploie automatiquement en production sur Vercel.
- Chaque autre branche obtient une URL de prévisualisation.
- Les URLs n'ont ni `.html` ni slash final (`/about`), grâce à `cleanUrls` et
  `trailingSlash: false` dans `vercel.json`, et `trailingSlash: 'never'` dans `astro.config.mjs`.

## À savoir

- **Tarifs** : affichés dans `src/components/SolutionsFridevs.astro`, `src/pages/services.astro` (section `#tarifs`)
  et la FAQ de `src/pages/contact.astro`. Penser à mettre à jour les trois.
- **Mentions légales** : les informations de l'éditeur sont en haut de `src/pages/mentions-legales.astro`.
- **Analytics** : GTM `GTM-NN5WKSRJ`, Consent Mode v2 (mesure refusée par défaut jusqu'à acceptation).
  Événements envoyés au `dataLayer` : `whatsapp_click`, `playstore_click`, `email_click`, `phone_click`,
  `contact_form_submit`, `cookie_consent_granted` / `cookie_consent_denied`.
- **Polices** : auto-hébergées via `@fontsource-variable` (noms CSS : `'Inter Variable'`, `'Space Grotesk Variable'`,
  `'DM Sans Variable'`).
