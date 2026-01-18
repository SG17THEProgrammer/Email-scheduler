# 📧 Email Scheduler System

A full-stack **Email Scheduling Platform** built with **Node.js, Express, BullMQ, Redis, MySQL**, and **React (MUI)**.
It allows users to authenticate, compose emails, schedule them for future delivery, and reliably send them using a background worker (used Ethereal for mailing).

---

## 🚀 Tech Stack

### Backend

* Node.js + Express
* TypeScript
* MySQL (email persistence)
* Redis (queue & delayed jobs)
* BullMQ (job scheduling & worker)

### Frontend

* React + TypeScript
* Material UI (MUI)
* Google OAuth
* CSV parsing for email leads

---

# 📦 Backend Setup

## 1️⃣ Prerequisites

Make sure you have installed:

* Node.js (v18+)
* MySQL
* Redis (right now it is local)
* npm

---

## 2️⃣ Environment Variables

Create `.env` in `backend/`

```env
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=db_name

# Redis
REDIS_URL=redis://localhost:6379

# Worker
WORKER_CONCURRENCY=5
MAX_EMAILS_PER_HOUR=200
MAX_EMAILS_PER_HOUR_PER_SENDER=20

# Auth
JWT_SECRET=supersecret

# Ethereal SMTP
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=user@ethereal.email
SMTP_PASS=ethereal_password


FRONTEND_URL = http://localhost:5001
```

---

## 3️⃣ Install Dependencies

```bash
cd backend
npm install
```

---

## 4️⃣ Run Backend Services

### Start API Server

```bash
npm run dev
```

### Start Worker

```bash
npm run worker
```

Entry point for worker is workers/email.worker.ts


⚠️ **Note : Both API & Worker must run simultaneously**

---

## 5️⃣ Redis Setup

This project uses Redis via Docker (Redis is NOT installed locally).

### Start Redis using Docker

```bash
docker run -p 6379:6379 redis

Note: This will start the redis. If not already it will create it automatically by itself.
Also install Redis Insight to have a clear understanding of the job queues.
---

## 6️⃣ Database

Run migrations / create tables:

```sql
CREATE TABLE emails (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT,
  to_email VARCHAR(255),
  subject TEXT,
  body TEXT,
  scheduled_at DATETIME,
  sent_at DATETIME,
  status ENUM('scheduled','sent','failed') DEFAULT 'scheduled'
);
```

---

# 📬 Ethereal Email Setup

Used **only for testing** (no real emails).

After sending, check logs:

```
📧 Email sent: https://ethereal.email/message/XXXX
```

---

# 🖥 Frontend Setup

## 1️⃣ Install

```bash
cd frontend
npm install
```

## 2️⃣ Environment Variables

Create `.env`

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=xxxxx
```

## 3️⃣ Run Frontend

```bash
npm run dev
```

---

# 🧠 Architecture Overview

```
Frontend (React + MUI)
        |
        | REST API
        ↓
Backend (Express)
        |
        | Insert email in DB
        | Enqueue job
        ↓
Redis (BullMQ Queue)
        |
        | Delayed Job
        ↓
Worker (BullMQ Worker)
        |
        | Rate limit check
        | Send email
        ↓
Ethereal SMTP
```

---

# ⏱ How Scheduling Works

1. User submits email + scheduled time
2. Email stored in **MySQL**
3. Job added to **BullMQ queue** with delay
4. Redis holds delayed job
5. Worker wakes up at correct time
6. Email sent
7. DB updated → `sent`

---

# 🔁 Persistence on Restart

✔️ Emails stored in **MySQL**
✔️ Jobs stored in **Redis**

If:

* API restarts → no data loss
* Worker restarts → jobs resume
* Server crashes → delayed jobs still fire whose scheduled time is not over still.

---

# 🚦 Rate Limiting & Concurrency

### Global Worker Limits

```ts
limiter: {
  max: 200,
  duration: 1 hour
}
```

### Per-Sender Rate Limiting

* In-memory map (hourly window)
* Prevents abuse
* Auto-reschedules when exceeded

### Concurrency

```ts
concurrency: 5
```

Worker can process **5 emails simultaneously**

---

# 📋 Features Implemented

## ✅ Backend Features

| Feature               | Status |
| --------------------- | ------ |
| Email scheduling      | ✅      |
| Delayed execution     | ✅      |
| Redis persistence     | ✅      |
| BullMQ worker         | ✅      |
| Rate limiting         | ✅      |
| Concurrency           | ✅      |
| Rescheduling on limit | ✅      |
| Ethereal SMTP         | ✅      |

---

## ✅ Frontend Features

| Feature                | Status |
| ---------------------- | ------ |
| Google OAuth Login     | ✅      |
| Dashboard              | ✅      |
| Compose Email          | ✅      |
| CSV upload & parsing   | ✅      |
| Scheduled emails table | ✅      |
| Sent emails table      | ✅      |
| Loading & empty states | ✅      |
| MUI-based UI           | ✅      |

---

# 🧩 Features Already Scaffolded (Needs Time to implement)

These are **designed and partially wired**, just not fully implemented yet:

### 1️⃣ Attachments Support

* Upload files
* Store metadata
* Send via Nodemailer

### 2️⃣ Manual Login & Register

* Email + password auth
* Store auth method (`google | manual`)
* Unified user table

### 3️⃣ User-Specific Limits

Currently hardcoded via env:

```env
MAX_EMAILS_PER_HOUR
```

Can be extended to:

* Per user hourly limit
* Custom delay between emails
* Campaign-level throttling

---
