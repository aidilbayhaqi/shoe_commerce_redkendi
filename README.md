# 🛒 E-Commerce Mini App

Project test aplikasi e-commerce sederhana yang memungkinkan pengguna:
- Melihat daftar produk dengan filter dan paginasi
- Melakukan checkout sebagai login
- Melihat daftar pesanan

## 📚 Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS (optional styling)
- Axios, React Router, lucide-react, swiper
- State Management (useContext)

### Backend
- FastAPI (Python)
- Pydantic for validation and type safety
- SQLAlchemy ORM
- MySQL / PostgreSQL

### Deployment
- Frontend: Vercel 
- Backend: Railway 

---

## 🚀 Features

### ✅ Produk
- List produk dengan filter: kategori, harga, warna, usia, gender
- Paginasi 
- produk bisa di create oleh user dengan role admin

### ✅ Checkout
- Form checkout untuk user login
- Validasi input (email, jumlah produk, alamat)

### ✅ Orders
- List dan detail order
- Status order (`pending`, `completed`)

---

## 💻 Local Development

### 🔹 1. Backend (FastAPI)

`bash
- cd backend
- python -m venv venv
- source venv/bin/activate  # or venv\Scripts\activate on Windows
- pip install -r requirements.txt

# Jalankan server
uvicorn app.main:app --reload
 
buat file .env dan masukkan:
- DATABASE_URL=mysql+mysqlconnector://root:@localhost:3306/shoe_commerce
- SECRET_KEY=test123
- ALGORITHM=HS256
- ALLOWED_ORIGINS=http://localhost:3000,http://localhost5173
- ACCESS_TOKEN_EXPIRE_MINUTES=120

pada folder backend terdapat file db_shoe_commerce.sql dan bisa di import ke my sql dengan cara:
- buka xampp lalu jalankan dan masuk ke menu import

### 🔹 2. FrontEnd (typescript + react)
- cd frontend
- npm install
- npm run start


REACT_APP_API_BASE_URL = http://localhost:8000
