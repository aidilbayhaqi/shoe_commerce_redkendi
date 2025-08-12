# MultipleFiles/test_orders.py
import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.product import Product
from db.database import get_db
import io

# Fixture to create a product for order testing
@pytest.fixture(scope="module")
def setup_product_for_order(client, admin_auth_headers):
    headers = admin_auth_headers()
    product_data = {
        "name": "Orderable Product",
        "description": "Product for order tests",
        "price": 50000,
        "stock": 100,
        "type": json.dumps([{"name": "Default", "size": 44}]),
        "color": "White",
        "gender": "Unisex",
        "age": 0
    }
    image_file = io.BytesIO(b"fake image content")
    image_file.name = "order_product.jpg"
    files = {"image": (image_file.name, image_file, "image/jpeg")}

    response = client.post("/api/products/", data=product_data, files=files, headers=headers)
    assert response.status_code == 200
    return response.json()["id"]

def test_create_order_success(client, auth_headers, setup_product_for_order):
    headers = auth_headers()
    product_id = setup_product_for_order
    order_data = {
        "product_id": product_id,
        "quantity": 2  
    }
    response = client.post("/api/orders/", json=order_data, headers=headers)
    
    # Tambahkan print untuk memeriksa respons
    print("Response status code:", response.status_code)
    print("Response data:", response.json())
    
    assert response.status_code == 200
    data = response.json()
    assert data["product_id"] == product_id
    assert data["quantity"] == 2
    assert data["total_price"] == 100000 
    assert data["status"] == "pending"
    assert "id" in data
    assert "user_id" in data


def test_create_order_product_not_found(client, auth_headers):
    headers = auth_headers()
    order_data = {
        "product_id": 99999,
        "quantity": 1
    }
    response = client.post("/api/orders/", json=order_data, headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"

def test_create_order_insufficient_stock(client, auth_headers, setup_product_for_order):
    headers = auth_headers()
    product_id = setup_product_for_order
    order_data = {
        "product_id": product_id,
        "quantity": 100 
    }
    response = client.post("/api/orders/", json=order_data, headers=headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Insufficient product stock"

def test_get_user_orders(client, auth_headers, setup_product_for_order):
    headers = auth_headers()

    order_data = {
        "product_id": setup_product_for_order,
        "quantity": 1
    }
    client.post("/api/orders/", json=order_data, headers=headers)

    response = client.get("/api/orders/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2 
  
    assert "product" in data[0]
    assert "user" in data[0]
    assert data[0]["product"]["id"] == setup_product_for_order
    assert data[0]["user"]["email"] == "testuser@example.com"

def test_get_orders_unauthenticated(client):
    response = client.get("/api/orders/")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

