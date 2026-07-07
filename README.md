# Gestion des Dépenses

Application full stack pour gérer les dépenses avec Node.js, Express, MongoDB, Mongoose, React, Vite et Tailwind CSS.

## Fonctionnalités

- Ajouter une dépense
- Modifier une dépense
- Supprimer une dépense
- Afficher toutes les dépenses
- Rechercher une dépense
- Filtrer par catégorie et par période
- Voir le total, la moyenne, la plus grosse dépense, le nombre de dépenses et la catégorie la plus utilisée

## Structure

```txt
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    utils/
frontend/
  src/
    api/
    components/
```

## Base de données locale

Le projet est configuré pour MongoDB Community en local.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/projetDepense
CLIENT_URL=http://localhost:5173
```

Vérifie que le service MongoDB local est démarré avant de lancer le backend.

## Lancer le backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

API disponible sur `http://localhost:5000`.

## Lancer le frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend disponible sur `http://localhost:5173`.

## Routes API

```txt
GET    /api/health
GET    /api/expenses
GET    /api/expenses/summary
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

## Filtres API

Les routes `GET /api/expenses` et `GET /api/expenses/summary` acceptent :

```txt
search
category
startDate
endDate
```

Exemple :

```txt
/api/expenses?search=Courses&category=Alimentation&startDate=2026-07-01&endDate=2026-07-31
```

## Exemple de dépense

```json
{
  "date": "2026-07-03",
  "category": "Alimentation",
  "description": "Courses du marché",
  "amount": 125000,
  "paymentMethod": "Orange Money",
  "note": "Achats de la semaine"
}
```

## Hebergement

Configuration recommandee :

- Backend : Render
- Frontend : Vercel
- Base de donnees : MongoDB Atlas

### 1. Backend sur Render

1. Poussez le projet sur GitHub.
2. Sur Render, creez un nouveau Blueprint depuis le fichier `render.yaml`.
3. Ajoutez les variables d'environnement du service backend :

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/projetDepense?retryWrites=true&w=majority
CLIENT_URL=https://votre-frontend.vercel.app
API_URL=https://votre-backend.onrender.com
JWT_SECRET=<une-longue-valeur-secrete>
```

Le backend expose une route de verification :

```txt
GET /api/health
```

### 2. Frontend sur Vercel

1. Importez le meme depot GitHub dans Vercel.
2. Selectionnez le dossier racine `frontend`.
3. Ajoutez la variable d'environnement :

```env
VITE_API_URL=https://votre-backend.onrender.com/api
```

4. Lancez le deploy.

Apres le deploy frontend, copiez l'URL Vercel finale dans `CLIENT_URL` sur Render, puis redeployez le backend.
