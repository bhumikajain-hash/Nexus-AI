# 🌌 NexusAI Assistant

A production-ready, full-stack AI chat platform featuring secure JWT cookie authentication, real-time bidirectional message streaming via WebSockets, persistent chat management, and RAG vector memory integration.

---

## ✨ Features

* **Secure Authentication**: Cookie-based JWT sessions with `bcryptjs` password encryption.
* **Real-Time WebSockets**: Live messaging and response streaming powered by Socket.io.
* **Vector RAG Memory**: Context-aware AI interactions integrated with the Google Gemini API.
* **Persistent Chat Management**: Create, load, switch, and delete chat threads saved in MongoDB.
* **Modern UI/UX**: Clean dark-mode interface built with Tailwind CSS, Redux Toolkit, and `react-hot-toast` alerts.

---

## 🛠️ Tech Stack

### **Frontend**
* React.js (Vite)
* Redux Toolkit
* Tailwind CSS
* React Hook Form
* React Hot Toast
* Socket.io-client

### **Backend**
* Node.js & Express.js
* MongoDB & Mongoose
* Socket.io
* JWT & Cookie-Parser
* Bcrypt.js

---

## 🚀 Getting Started & Installation

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB (Local instance or MongoDB Atlas cluster URI)
* pnpm (or npm)

### 1. Clone the Repository
```bash
git clone https://github.com/bhumikajain-hash/NexusAI.git
cd NexusAI
```
### 2. Backend Setup
```bash 
cd backend
npm install  # or pnpm install
npm run dev  # or pnpm dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install  # or pnpm install
npm run dev  # or pnpm dev