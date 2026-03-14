# DashLingo 🚗

Conversational AI for Instant BMW Vehicle Inventory Dashboards.
Type a plain English question, get an interactive chart instantly.

## Tech Stack
- **Frontend:** React (Vite) + Tailwind + Recharts
- **Backend:** Node.js + Express
- **Database:** SQLite (BMW data) + MongoDB (query history)
- **AI:** Google Gemini API

## Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally

### Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/dashLingo.git
cd dashLingo

# Install frontend dependencies
cd client && npm install

# Install backend dependencies
cd ../server && npm install
```

### Environment Variables
Create `server/.env`:
```
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/dashlingo
PORT=5000
```

### Seed the database
```bash
cd server
node data/seed.js
```

### Run the app
```bash
# Terminal 1 - Frontend
cd client && npm run dev

# Terminal 2 - Backend
cd server && node index.js
```

## Example Queries
- "Show me the average price of each BMW model"
- "Compare average mpg of Diesel vs Petrol cars by year"
- "Show top 5 most fuel efficient automatic cars under £20000"
