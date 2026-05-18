# . BioControl — Formulaire de Devis & Back-Office Sécurisé

BioControl est un prototype full-stack haut de gamme conçu pour une agence parisienne de désinfection et dératisation. Développé en **Next.js 15+ (App Router)**, **TypeScript**, **Supabase** et **Tailwind CSS v4**, ce projet propose un formulaire public multi-étapes sécurisé et une interface d'administration complète et protégée.

---

## . Instructions de Lancement Rapide

Le projet intègre un **mode de démonstration intelligent**. Si aucune variable d'environnement Supabase n'est fournie, l'application bascule automatiquement sur une **base de données en mémoire (mock persistante)** sur le serveur. Cela permet de tester et d'évaluer 100% des fonctionnalités (soumission, validation, rate limiting, filtres, recherche admin, changement de statut, export CSV) immédiatement sans aucune configuration préalable !

### 1. Installation
Cloner le répertoire et installer les dépendances :
```bash
# Se placer dans le répertoire du projet
cd devis-app

# Installer les dépendances
npm install
```

### 2. Configuration (`.env.local`)
Un fichier `.env.example` est fourni à la racine. Pour l'exécution locale classique, copiez-le :
```bash
cp .env.example .env.local
```
Contenu par défaut de `.env.local` :
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Identifiants du Back-Office
ADMIN_PASSWORD=AdminPestControl2026!
ADMIN_BEARER_TOKEN=secret_bearer_token_2026
```

### 3. Exécution locale
Lancez le serveur de développement :
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.
- La page d'accueil redirige automatiquement vers `/devis` (Le formulaire client).
- Le tableau de bord d'administration est accessible sur `/admin` (Mot de passe : `AdminPestControl2026!`).

---

## . Identifiants de Test Administrateur

- **Portail d'Administration** : `/admin`
- **Mot de passe statique** : `AdminPestControl2026!`
- **Token Bearer pour l'API** : `secret_bearer_token_2026`
  *(Exemple de header : `Authorization: Bearer secret_bearer_token_2026`)*

---

## 🗄️ Schéma SQL Supabase (Database Setup)

Pour brancher l'application sur votre propre instance Supabase, configurez vos clés réelles dans `.env.local` et exécutez le script SQL suivant dans le **SQL Editor** de votre console Supabase :

```sql
-- ==========================================
-- 1. CRÉATION DE LA TABLE DEVIS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.devis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    etablissement TEXT NOT NULL CHECK (etablissement IN ('Restaurant', 'Hôtel', 'Copropriété', 'Autre')),
    surface NUMERIC NOT NULL CHECK (surface >= 10 AND surface <= 50000),
    nuisibles JSONB NOT NULL, -- Stocke l'array des nuisibles ex: ["Rats", "Cafards"]
    urgence TEXT NOT NULL CHECK (urgence IN ('24h', 'annuel', 'simple')),
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT NOT NULL,
    message TEXT,
    statut TEXT DEFAULT 'nouveau'::text NOT NULL CHECK (statut IN ('nouveau', 'traite', 'archive')),
    ip_address TEXT NOT NULL
);

-- Indexation pour accélérer les filtres du back-office et la recherche
CREATE INDEX IF NOT EXISTS idx_devis_statut ON public.devis(statut);
CREATE INDEX IF NOT EXISTS idx_devis_created_at ON public.devis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_devis_email ON public.devis(email);
CREATE INDEX IF NOT EXISTS idx_devis_nom ON public.devis(nom);

-- ==========================================
-- 2. CRÉATION DE LA TABLE RATE LIMITS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour accélérer les requêtes de comptage et de nettoyage du rate limiter
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_created ON public.rate_limits(ip_address, created_at);

-- ==========================================
-- 3. POLITIQUES DE SÉCURITÉ (RLS)
-- ==========================================
-- Nous activons la sécurité RLS sur la table devis
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;

-- Politique : Permettre les insertions anonymes (soumission publique du formulaire)
CREATE POLICY "Permettre l'insertion publique anonyme" 
ON public.devis FOR INSERT 
WITH CHECK (true);

-- Politique : Bloquer les lectures et modifications anonymes directes sur devis 
-- Le back-office utilise le token de service ou l'API Route sécurisée (bypassing RLS côté serveur)
CREATE POLICY "Restreindre la lecture publique" 
ON public.devis FOR SELECT 
USING (false);

CREATE POLICY "Restreindre la modification publique" 
ON public.devis FOR UPDATE 
USING (false);
```

---

## Choix Techniques & Architecture

1. **Next.js (App Router)** : Utilisation des API Routes modernes pour la séparation claire entre le frontend et le backend.
2. **Tailwind CSS v4** : Intégration de la toute nouvelle version de Tailwind v4, plus performante avec une configuration CSS moderne et native.
3. **Zod Validation** : Partage des schémas de validation entre le frontend (vérification en temps réel étape par étape) et le backend (sécurité stricte à l'insertion).
4. **Design & Ergonomie Premium** :
   - Esthétique soignée avec des tons naturels (émeraude, ardoise), des ombres douces et du verre dépoli (glassmorphism).
   - Indicateur de progression interactif avec icônes dynamiques.
   - Les boutons de sélection d'urgence et de nuisibles se comportent comme des tuiles interactives tactiles et animées au survol, largement supérieures à des cases à cocher classiques.
   - Feedback instantané lors des soumissions avec micro-animations de chargement (loaders).

---

## Implémentations de Sécurité & Anti-Spam

- **Double Validation Stricte** : La validation des entrées se fait côté client à chaque étape, mais est **impérativement réévaluée côté serveur** dans `/api/devis` via Zod.
- **Anti-XSS (Input Sanitization)** : Un module de sanitisation (`lib/sanitize.ts`) filtre tous les champs de texte utilisateur. Les balises HTML, crochets et injections `<script>` sont détectés et encodés en entités HTML sûres avant d'entrer en base.
- **Rate Limiting d'IP Robuste** : L'API résout l'adresse IP réelle de l'utilisateur (tenant compte des proxys/CDN via `x-forwarded-for`). Une requête vérifie le nombre de soumissions dans la dernière heure. Si `comptage >= 3`, l'insertion est bloquée et retourne un code HTTP `429`. Un auto-nettoyage des entrées obsolètes (> 1 heure) est lancé à chaque soumission.
- **Protection Strict Anti-IDOR & Auth** :
  - La page `/admin` est bloquée par un **Middleware Next.js** interceptant les requêtes et inspectant la présence d'un cookie HTTP-Only chiffré `admin_session`.
  - Les routes API `/api/admin/devis` et `/api/admin/devis/[id]` sont protégées par une **double authentification** : elles valident soit la présence d'un jeton `Bearer` valide (pour l'évaluation/tests automatisés), soit la session du cookie. Toute requête non autorisée se solde immédiatement par un **HTTP 401 Unauthorized**.

---

## . Fonctionnalités Bonus Livrées

1. **Indicateur de Charge Dynamique** : Une carte statistique dédiée dans le back-office calcule en temps réel le nombre de dossiers reçus au cours des dernières 24 heures.
2. **Export CSV Natif** : Un bouton permet d'extraire instantanément la liste des demandes actuellement filtrées (par exemple, "Tous les nouveaux dossiers") dans un fichier `.csv` formaté, compatible avec Microsoft Excel et Google Sheets (gestion de l'encodage BOM pour le français).
3. **Tableau Réactif & Détails en Modal** : Au-delà d'un simple tableau, un clic sur une demande ouvre une boîte modale complète de consultation et de qualification du dossier. Sur mobile, le tableau se transforme automatiquement en une élégante liste de cartes adaptées aux écrans tactiles.
