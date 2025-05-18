# 💰 Finance Dashboard

**Node.js CI | Next.js | Supabase | AI-Powered**

A smart budgeting and financial dashboard built with cutting-edge tech. Track finances, get insights, and chat with an AI assistant to stay on top of your money game.

---

## 📚 Table of Contents

- [Pages](#pages)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

---

## 📄 Pages

- **Dashboard** – Overview of your finances (revenue, expenses, trends)
- **Analytics** – Charts and visualizations
- **Insights** – AI-generated suggestions for financial decisions
- **Chatbot** – Ask financial questions and get smart responses

---

## ✨ Features

- **Interactive Data Visualization**  
  See your financial data in beautiful bar and pie charts.

- **Dashboard Overview**  
  Quickly grasp your current financial health.

- **AI-Powered Insights**  
  Get smart suggestions for budget optimization, risk detection, and resource allocation.

- **AI Chatbot**  
  Powered by [diffy.ai](https://diffy.ai), ask questions and receive contextual answers.

---

## 🛠️ Technologies Used

- **Frontend**: React (Next.js + TypeScript), Radix UI, CSS
- **Backend**: Node.js, Express
- **AI & Data**: Supabase, diffy.ai, Gemini
- **Other**: Nix for reproducible dev environments

---

## 🚀 Installation

```bash
git clone https://github.com/AriathGonzalez/studio.git
cd studio
npm install

cd studio/server
npm install
```

## ▶️ Usage

```bash
cd studio
npm run dev

cd studio/server
node index.js
```

Visit http://localhost:9002 in your browser.

## 📡 API Endpoints

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| POST   | `/chat-bot`             | Send a user query to the AI chatbot |
| GET    | `/data/revenue`         | Fetch revenue data                  |
| GET    | `/data/expenses`        | Fetch overall expenses data         |
| GET    | `/expenses/get-payroll` | Get payroll-specific expense data   |
| GET    | `/expenses/get-other`   | Get other types of expense data     |
