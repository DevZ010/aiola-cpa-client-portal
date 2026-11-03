# 🚀 Aiola CPA Portal - Python & React Implementation

This project is a secure client intake and document management portal for tax professionals, featuring a **FastAPI (Python) backend** and a **React/Vite frontend**.

## 🛠️ Local Setup Guide

### 1. Prerequisites
- **Node.js** (v18+) - Required for the React frontend build.
- **Python** (3.9+) - Required for the FastAPI backend.
- **PostgreSQL** (Optional) - The backend defaults to SQLite but is Postgres-ready.

### 2. Setting Up the Python Backend
1. Navigate to the backend folder:
   ```bash
   cd backend_python
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: If you run into bcrypt errors, use `pip install "bcrypt<4.1.0"`.

4. **Database Configuration**:
   The app uses SQLite by default. To use **PostgreSQL**, update `main.py`:
   ```python
   SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost:5432/dbname"
   ```

5. Start the backend:
   ```bash
   python main.py
   ```
   *The API will be live at `http://localhost:8000`.*

### 3. Setting Up the React Frontend
1. Open a new terminal at the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be live at `http://localhost:3000`. It is pre-configured to proxy API calls to your Python backend.*

### 4. Create Initial Staff Account
Run this command in your Python terminal (with venv active) to create your first admin:
```bash
python -c "from main import SessionLocal, User, get_password_hash; db=SessionLocal(); admin=User(email='admin@aiolacpa.com', password=get_password_hash('Admin123!'), name='Admin', role='staff'); db.add(admin); db.commit()"
```

---

## 🔒 Security Features
- **JWT Authentication**: Secure token-based sessions.
- **Bcrypt Hashing**: Passwords are never stored in plain text.
- **RBAC**: Strict role-based access control preventing clients from seeing other clients' data.
- **File Integrity**: Unique identifiers for all uploaded tax documents.
