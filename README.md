# Application Web de Gestion des Dépenses

Application full stack professionnelle avec API REST Node.js/Express/MongoDB Atlas et interface React Vite/Tailwind CSS.

## Fonctionnalités

- Ajouter, modifier, supprimer et afficher les dépenses
- Recherche par description, note et mode de paiement
- Filtre par catégorie et par période
- Dashboard responsive avec total, moyenne, plus grosse dépense, nombre et catégorie la plus utilisée
- Loader, notifications toast et confirmation avant suppression
- Interface moderne, mobile first, en Tailwind CSS

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

## Installation Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Dans `backend/.env`, remplacez `MONGO_URI` par votre URI MongoDB Atlas.

API disponible sur `http://localhost:5000`.

## Installation Frontend

```bash
cd frontend
npm install
cp .env.example .env
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
  "date": "2026-07-02",
  "category": "Alimentation",
  "description": "Courses du marché",
  "amount": 1250000,
  "paymentMethod": "Orange Money",
  "note": "Achats hebdomadaires"
}
```

## Variables d'environnement

Backend:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gestion_depenses?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```
