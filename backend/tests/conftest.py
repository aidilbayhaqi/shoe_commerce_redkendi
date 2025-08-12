# MultipleFiles/conftest.py
import pytest
import os
import sys
from typing import Callable

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app  # Asumsi ada file main.py yang mengimpor router Anda
from db.database import Base, get_db
from models.user import User
from core.security import hash_password

DATABASE_URL = "sqlite:///./test.db"  # Testing pakai SQLite

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override FastAPI dependency
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def setup_users(client):
    db = TestingSessionLocal()
    # Create a regular user
    user_data = {
        "email": "testuser@example.com",
        "username": "testuser",
        "password": hash_password("testpassword"),
        "address": "User Address",
        "phone": "081234567890",
        "is_admin": False
    }
    user = User(**user_data)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create an admin user
    admin_data = {
        "email": "admin@example.com",
        "username": "adminuser",
        "password": hash_password("adminpassword"),
        "address": "Admin Address",
        "phone": "089876543210",
        "is_admin": True
    }
    admin_user = User(**admin_data)
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    db.close()

@pytest.fixture(scope="module")
def get_token(client, setup_users) -> Callable[[], str]:
    def _get_token(email: str = "testuser@example.com", password: str = "testpassword") -> str:
        login_data = {
            "email": email,
            "password": password
        }
        res = client.post("/api/users/login", json=login_data)
        assert res.status_code == 200
        return res.json()["access_token"]
    return _get_token

@pytest.fixture(scope="module")
def auth_headers(get_token) -> Callable[[], dict]:
    def _auth_headers(email: str = "testuser@example.com", password: str = "testpassword") -> dict:
        token = get_token(email, password)
        return {"Authorization": f"Bearer {token}"}
    return _auth_headers

@pytest.fixture(scope="module")
def admin_auth_headers(get_token) -> Callable[[], dict]:
    def _admin_auth_headers() -> dict:
        token = get_token(email="admin@example.com", password="adminpassword")
        return {"Authorization": f"Bearer {token}"}
    return _admin_auth_headers

