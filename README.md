# Smart Crop Decision Intelligence System 🌱

A complete, scalable, production-ready full-stack AI web application designed to help farmers select the best crops for their specific soil and weather conditions using Machine Learning.

## Features
- **AI-Powered Recommendations:** Uses a trained RandomForest model to predict top crops with confidence scores.
- **Farmer-Friendly UI:** Intuitive, mobile-responsive, and clean interface with large readable inputs and dropdowns. No typing required where avoidable.
- **Rich Output:** Displays Expected Profit per acre, AI Reasoning, and a Fertilizer Roadmap.
- **PDF Export:** Farmers can download a complete PDF report of their results offline.
- **Future-Ready:** The backend generates concise text summaries for easy WhatsApp Bot integration.

---

## Project Structure

```
/project-root
├── frontend/           # React.js UI (Vite)
├── backend/            # Node.js + Express API
├── ml-service/         # Python + Flask AI Microservice
├── database/           # MongoDB details
└── README.md
```

---

## Prerequisites
- Node.js (v16+)
- Python 3.9+
- MongoDB running locally on port 27017

## 1. Setup ML Service (AI Prediction Engine)
This service trains the model and exposes the `/predict` API.

```bash
cd ml-service
# Create virtual environment (optional but recommended)
python -m venv venv
# Activate it:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model and generate model.pkl
python train_model.py

# Start the Flask service
python app.py
```
*Runs on http://localhost:8000*

---

## 2. Setup Backend System
This acts as the main gateway orchestrating the database, UI, and ML service.

```bash
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
# OR
npm start
```
*Runs on http://localhost:5000*

> **Note on Environment Variables**: Ensure `.env` is present in `/backend/` with `MONGO_URI`, `PORT`, and `ML_API_URL` specified.

---

## 3. Setup Frontend Application
The user-facing portal built with React.

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
*Runs on http://localhost:5173*

---

## Testing the APIs

**POST `/api/recommend`**
```json
{
  "soil": {
    "N": 90,
    "P": 42,
    "K": 43,
    "type": "Black",
    "pH": 6.5,
    "moisture": "Medium"
  },
  "weather": {
    "temperature": 28,
    "humidity": 70,
    "rainfall": 150
  },
  "water": {
    "availability": "Medium",
    "pH": 7.0
  },
  "season": "Kharif"
}
```
Enjoy maximizing agricultural yields! 🌾
