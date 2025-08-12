# MultipleFiles/test_products.py
import pytest
import io
import json
from fastapi.testclient import TestClient

# Global variable to store product ID for subsequent tests
created_product_id = None

def test_create_product_as_admin(client, admin_auth_headers):
    global created_product_id
    headers = admin_auth_headers()
    product_data = {
        "name": "Test Product",
        "description": "A product for testing",
        "price": 100000,
        "stock": 500,
        "type": json.dumps([{"name": "Standard", "size": 42}]),
        "color": "Red",
        "gender": "Unisex",
        "age": 10
    }
    # Create a dummy image file
    image_file = io.BytesIO(b"fake image content")
    image_file.name = "test_image.jpg"

    files = {"image": (image_file.name, image_file, "image/jpeg")}

    response = client.post("/api/products/", data=product_data, files=files, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["price"] == 100000
    assert data["stock"] == 500
    assert "id" in data
    assert "image_url" in data
    assert data["type"] == [{"name": "Standard", "size": 42}]
    created_product_id = data["id"]

def test_create_product_as_regular_user_forbidden(client, auth_headers):
    headers = auth_headers()
    product_data = {
        "name": "Forbidden Product",
        "description": "Should not be created",
        "price": 100,
        "stock": 10,
        "type": json.dumps([{"name": "Basic", "size": 44}]),
        "color": "Blue",
        "gender": "Male",
        "age": 5
    }
    image_file = io.BytesIO(b"fake image content")
    image_file.name = "forbidden.jpg"
    files = {"image": (image_file.name, image_file, "image/jpeg")}

    response = client.post("/api/products/", data=product_data, files=files, headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Only admins can perform this action."

def test_get_all_products(client):
    response = client.get("/api/products/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0 # Should contain the product created by admin

def test_get_product_by_id(client):
    response = client.get(f"/api/products/{created_product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_product_id
    assert data["name"] == "Test Product"

def test_get_non_existent_product(client):
    response = client.get("/api/products/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"

def test_update_product_as_admin(client, admin_auth_headers):
    headers = admin_auth_headers()
    updated_data = {
        "name": "Updated Product",
        "description": "Updated description for testing",
        "price": 150000,
        "stock": 75,
        "type": json.dumps([{"name": "Premium", "size": 43}]),
        "color": "Green",
        "gender": "Female",
        "age": 15
    }
    # Optional: update image
    new_image_file = io.BytesIO(b"new fake image content")
    new_image_file.name = "new_test_image.png"
    files = {"image": (new_image_file.name, new_image_file, "image/png")}

    response = client.put(f"/api/products/{created_product_id}", data=updated_data, files=files, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_product_id
    assert data["name"] == "Updated Product"
    assert data["price"] == 150000
    assert data["stock"] == 75
    assert data["type"] == [{"name": "Premium", "size": 43}]
    assert "image_url" in data # Image URL should be updated

def test_update_product_as_regular_user_forbidden(client, auth_headers):
    headers = auth_headers()
    updated_data = {
        "name": "Attempted Update",
        "price": 10,
        "stock": 1
    }
    response = client.put(f"/api/products/{created_product_id}", data=updated_data, headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Only admins can perform this action."

def test_delete_product_as_admin(client, admin_auth_headers):
    headers = admin_auth_headers()
    response = client.delete(f"/api/products/{created_product_id}", headers=headers)
    assert response.status_code == 204 # No Content

    # Verify product is deleted
    response = client.get(f"/api/products/{created_product_id}")
    assert response.status_code == 404

def test_delete_non_existent_product(client, admin_auth_headers):
    headers = admin_auth_headers()
    response = client.delete("/api/products/99999", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"

def test_delete_product_as_regular_user_forbidden(client, auth_headers,admin_auth_headers):
    # First, create a new product to delete
    headers_admin = admin_auth_headers()
    product_data = {
        "name": "Product to Delete",
        "description": "Temp product",
        "price": 100,
        "stock": 50,
        "type": json.dumps([]),
        "color": "Black",
        "gender": "Unisex",
        "age": 1
    }
    image_file = io.BytesIO(b"fake image content")
    image_file.name = "temp.jpg"
    files = {"image": (image_file.name, image_file, "image/jpeg")}
    response = client.post("/api/products/", data=product_data, files=files, headers=headers_admin)
    assert response.status_code == 200
    temp_product_id = response.json()["id"]

    # Try to delete as regular user
    headers_user = auth_headers()
    response = client.delete(f"/api/products/{temp_product_id}", headers=headers_user)
    assert response.status_code == 403
    assert response.json()["detail"] == "Only admins can perform this action."

    # Clean up (delete as admin)
    client.delete(f"/products/{temp_product_id}", headers=headers_admin)

