# 📄 Templates pour les Futures Pages

Ce fichier contient des templates pour créer facilement les autres pages du site.

## 📄 Template: Page Service

Créez `src/pages/services/[nom-service].astro` :

```astro
---
/**
 * PAGE SERVICE: [Nom du Service]
 * 
 * Template pour une page de service détaillée
 */
import Layout from "../../layouts/Layout.astro";
import Header from "../../components/Header.astro";
import Footer from "../../components/Footer.astro";
---

<Layout>
  <Header />

  <main>
    <!-- Hero Service -->
    <section class="pt-32 pb-20 bg-gradient-to-br from-[#0B0E14] via-[#1a062e] to-[#2A234A]">
      <div class="max-w-7xl mx-auto px-6">
        
        <!-- Breadcrumb -->
        <nav class="text-sm text-gray-400 mb-8">
          <a href="/" class="hover:text-purple-400">Accueil</a>
          <span class="mx-2">/</span>
          <a href="/services" class="hover:text-purple-400">Services</a>
          <span class="mx-2">/</span>
          <span class="text-white">Nom du Service</span>
        </nav>

        <!-- Titre -->
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6" style="font-family: 'DM Sans', sans-serif;">
          Nom du 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
            Service
          </span>
        </h1>

        <p class="text-xl text-gray-300 max-w-3xl">
          Description courte du service et de sa valeur ajoutée pour le client.
        </p>

      </div>
    </section>

    <!-- Problème Client -->
    <section class="py-20 bg-[#111827]">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-8">
          Le problème que nous résolvons
        </h2>
        <p class="text-xl text-gray-300">
          Description du problème que rencontre le client...
        </p>
      </div>
    </section>

    <!-- Notre Solution -->
    <section class="py-20 bg-[#0B0E14]">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-8">
          Notre solution
        </h2>
        <!-- Détails de la solution -->
      </div>
    </section>

    <!-- Résultats Attendus -->
    <section class="py-20 bg-[#111827]">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-12">
          Résultats attendus
        </h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl text-purple-400 mb-4">📈</div>
            <h3 class="text-xl font-bold text-white mb-2">Performance</h3>
            <p class="text-gray-400">Description...</p>
          </div>
          <!-- Répéter pour autres résultats -->
        </div>
      </div>
    </section>

    <!-- Technologies -->
    <section class="py-20 bg-[#0B0E14]">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-12">
          Technologies utilisées
        </h2>
        <!-- Logos des technos -->
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-br from-[#2A234A] to-[#1a062e]">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Intéressé par ce service ?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Discutons de votre projet
        </p>
        <a href="/contact" class="inline-flex items-center px-10 py-5 bg-white text-purple-700 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all duration-300">
          Demander un devis
        </a>
      </div>
    </section>

  </main>

  <Footer />
</Layout>
```

## 📄 Template: Page Contact

Créez `src/pages/contact.astro` :

```astro
---
/**
 * PAGE CONTACT
 * 
 * Formulaire de contact avec informations
 */
import Layout from "../layouts/Layout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
---

<Layout>
  <Header />

  <main>
    <section class="pt-32 pb-20 bg-gradient-to-br from-[#0B0E14] via-[#1a062e] to-[#2A234A]">
      <div class="max-w-7xl mx-auto px-6">
        
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6" style="font-family: 'DM Sans', sans-serif;">
            Parlons de votre 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              projet
            </span>
          </h1>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Décrivez-nous votre objectif, nous vous répondrons rapidement
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12">
          
          <!-- Formulaire -->
          <div class="bg-[#111827] p-8 rounded-2xl border border-gray-800">
            <form action="/api/contact" method="POST" class="space-y-6">
              
              <!-- Nom -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  class="w-full px-4 py-3 bg-[#0B0E14] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  class="w-full px-4 py-3 bg-[#0B0E14] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <!-- Téléphone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">
                  Téléphone
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  class="w-full px-4 py-3 bg-[#0B0E14] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="+33 6 XX XX XX XX"
                />
              </div>

              <!-- Type de projet -->
              <div>
                <label for="project-type" class="block text-sm font-medium text-gray-300 mb-2">
                  Type de projet *
                </label>
                <select 
                  id="project-type" 
                  name="project-type"
                  required
                  class="w-full px-4 py-3 bg-[#0B0E14] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="">Sélectionnez une option</option>
                  <option value="web">Site web</option>
                  <option value="mobile">Application mobile</option>
                  <option value="saas">Solution métier</option>
                  <option value="seo">SEO</option>
                  <option value="design">Design</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-300 mb-2">
                  Décrivez votre projet *
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5"
                  required
                  class="w-full px-4 py-3 bg-[#0B0E14] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Décrivez votre besoin..."
                ></textarea>
              </div>

              <!-- Budget (optionnel) -->
              <div>
                <label for="budget" class="block text-sm font-medium text-gray-300 mb-2">
                  Budget estimé (optionnel)
                </label>
                <select 
                  id="budget" 
                  name="budget"
                  class="w-full px-4 py-3 bg-[#0B0E14] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="">Non défini</option>
                  <option value="5-10k">5 000 - 10 000 €</option>
                  <option value="10-25k">10 000 - 25 000 €</option>
                  <option value="25-50k">25 000 - 50 000 €</option>
                  <option value="50k+">50 000 € +</option>
                </select>
              </div>

              <!-- Submit -->
              <button 
                type="submit"
                class="w-full px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                Envoyer la demande
              </button>

            </form>
          </div>

          <!-- Informations de contact -->
          <div class="space-y-8">
            
            <!-- Contact direct -->
            <div class="bg-[#111827] p-8 rounded-2xl border border-gray-800">
              <h3 class="text-2xl font-bold text-white mb-6">
                Contact direct
              </h3>
              
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-400 mb-1">Email</p>
                    <a href="mailto:contact@fridevs.com" class="text-white hover:text-purple-400 transition-colors">
                      contact@fridevs.com
                    </a>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-400 mb-1">Téléphone</p>
                    <a href="tel:+33000000000" class="text-white hover:text-purple-400 transition-colors">
                      +33 (0)X XX XX XX XX
                    </a>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-400 mb-1">Adresse</p>
                    <p class="text-white">Paris, France</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Réassurance -->
            <div class="bg-gradient-to-br from-purple-900/20 to-purple-800/20 p-8 rounded-2xl border border-purple-500/20">
              <h3 class="text-xl font-bold text-white mb-4">
                Notre engagement
              </h3>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Réponse sous 48h
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Devis gratuit et détaillé
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Sans engagement
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Accompagnement personnalisé
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>

  </main>

  <Footer />
</Layout>

<script>
  // Gérer la soumission du formulaire
  document.querySelector('form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      // Envoyer les données (à configurer selon votre backend)
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Message envoyé avec succès ! Nous vous répondrons rapidement.');
        form.reset();
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  });
</script>
```

## 📝 Notes d'Utilisation

Ces templates utilisent :
- La même palette de couleurs que la page d'accueil
- Les mêmes polices (DM Sans, Space Grotesk, Inter)
- Le même système de composants (Header, Footer)
- Les mêmes conventions de nommage et structure

**Personnalisez** simplement le contenu selon vos besoins !

---

Pour plus d'exemples, consultez la documentation Astro : https://docs.astro.build
