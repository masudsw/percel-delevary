# Parcel Delivery API Documentation

**Base URL**: `https://parcel-delevery-backend.vercel.app/api/v1`

---

## 📌 Authentication

### Login
```http
POST /auth/login

{
  "email": "user@example.com",
  "password": "yourpassword"
}