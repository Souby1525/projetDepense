# Gestion des Dépenses

Application full stack simple pour gérer les dépenses avec Node.js, Express, MongoDB Atlas, Mongoose, React, Vite et Tailwind CSS.

## Fonctionnalités

- Ajouter une dépense
- Modifier une dépense
- Supprimer une dépense
- Afficher toutes les dépenses
- Rechercher une dépense
- Filtrer par catégorie et par date
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

## Connexion MongoDB Atlas

1. Crée une base de données MongoDB Atlas.
2. Copie ton URI de connexion.
3. Crée le fichier `backend/.env`.
4. Colle ton URI dans `MONGO_URI`.

Exemple :

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/gestion_depenses?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

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
GET    /api/expenses
GET    /api/expenses/summary
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
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
