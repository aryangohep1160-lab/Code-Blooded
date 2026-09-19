# 🚀 How to Run the Complete ReCircle Website (Step-by-Step Guide)

---

## 📋 Prerequisites
Before running the project, ensure your system has:
- **Node.js** (v18 or higher installed)
- **Git** installed
- A modern Web Browser (Google Chrome, Microsoft Edge, or Mozilla Firefox)

---

## 1️⃣ Step 1: Clone the Repository from GitHub
Open your terminal (Command Prompt, PowerShell, or Git Bash) and run:

```bash
git clone https://github.com/aryangohep1160-lab/Code-Blooded.git
cd Code-Blooded
```

---

## 2️⃣ Step 2: Setup & Start the Backend API Server

Open a terminal window and navigate into the `backend` directory:

```bash
cd backend
```

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Initialize Database & Seed Test Data**:
   ```bash
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

3. **Start the Backend Development Server**:
   ```bash
   npx ts-node src/index.ts
   ```

> 🟢 **Backend Health Verification**: The backend API server will run on **`http://localhost:5001/`**. You can verify health by visiting `http://localhost:5001/api/health`.

---

## 3️⃣ Step 3: Setup & Start the Frontend Web Application

Open a **second terminal window** and navigate into the `frontend` directory:

```bash
cd frontend
```

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```

> 🟢 **Frontend Web Server**: Vite will start the frontend web application on **`http://localhost:5173/`**.

---

## 4️⃣ Step 4: Open & Explore the Website

Open your web browser and navigate to:

👉 **`http://localhost:5173/`**

---

## 🎯 Quick Presentation Walkthrough Flow (For Judges & Evaluators)

When demonstrating the live website to judges or evaluators, follow this exact sequence:

1. **Landing Page (`/`)**: Show the deep green circular theme, living interactive orbit system, custom ReCircle logo, and the **Explore Circular Capabilities & Our Contributions** 2-column layout.
2. **User Onboarding (`/login` or `/signup`)**: Sign in as a test user (`aarav@recircle.eco` / `password123`).
3. **Dashboard & Eco-AI Assistant (`/dashboard`)**:
   - Demonstrate the **Live Hyperlocal GPS** widget showing automatic location detection and interactive Google Maps area pin.
   - Upload an item image (e.g., bicycle, gadget, or furniture) to the **Eco-AI Chat Assistant** to demonstrate the 5 R’s circular breakdown (Refuse, Reduce, Reuse, Repurpose, Recycle) and prioritized Sell vs Donate vs Repair vs Throw guidance.
4. **Hyperlocal Marketplace (`/marketplace`)**: Show listings (including Ergonomic Chair with working photo), filter by category, and click **Claim Item**.
5. **Local Repair Network (`/network`)**: Show the **15 certified repair & circular partners** (Mechanics, Bicycles, Electronics, Solar, Shoes, Appliances) with real-time search filtering and direct Google Maps directions.
6. **Green Squads & Leaderboard (`/community`)**: Show the **Global Leaderboard** on the left column and **Green Squads** on the right column.
7. **Rewards Catalogue (`/rewards`)**: Demonstrate the compact frosted glass **Your Balance** pill and EcoPoints redemption.
