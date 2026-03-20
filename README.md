# WebhookDrop 📦🚀 (Technical MVP)

WebhookDrop is a **reliable, high-fidelity MVP of a webhook delivery engine**, conceptually similar to a streamlined version of **Svix**. It acts as a "Reliable Postman" between your application and its consumers, ensuring every event is delivered with a robust, distributed retry system.

## 🌟 Key Features
- **Reliable Delivery:** Powered by BullMQ and Redis for background job persistence.
- **Smart Retries:** Exponential backoff with **Jitter** to prevent "thundering herd" issues.
- **HMAC Security:** Every payload is signed with a secret key, so receivers can verify it's really from you.
- **Chaos Simulator:** Built-in tool to test how your architecture handles flaky connections.
- **Modern Dashboard:** A polished React + Tailwind CSS UI to monitor all deliveries in real-time.

## 🏗️ Architecture
```mermaid
graph LR
    A[Your App] -->|POST /events| B[API Server]
    B --> C[(PostgreSQL)]
    B --> D[Redis Queue]
    D --> E[Background Worker]
    E -->|POST + Signature| F[Target URL]
    E -- Fail? --> D
```

### 1. Start Infrastructure (Cloud)
If deploying to **Render**, use these settings:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### 2. Start Infrastructure (Local)
```bash
docker-compose up -d
```

### 2. Start API (Backend)
```bash
cd apps/api
npm install
npm run dev
```

### 3. Start Dashboard (Frontend)
```bash
cd apps/ui
npm install
npm run dev
```

## 📖 API Reference

### Register Endpoint
`POST /endpoints`
```json
{
  "url": "https://yourapp.com/hook",
  "secret": "your-signing-secret",
  "label": "Production"
}
```

### Fire Event
`POST /events`
```json
{
  "payload": {
    "type": "order.completed",
    "id": "123"
  }
}
```

---
Built with ❤️ for reliable software.
