def test_create_order_success(client, auth_headers, setup_product_for_order):
    headers = auth_headers()
    product_id = setup_product_for_order
    order_data = {
        "product_id": product_id,
        "quantity": 2
    }
    response = client.post("/api/orders/", json=order_data, headers=headers)
    assert response.status_code == 201  
    data = response.json()
    assert data["product_id"] == product_id
    assert data["quantity"] == 2
    assert "total_price" in data
    assert data["status"] == "completed"
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
        "quantity": 10000  
    }
    response = client.post("/api/checkouts/", json=order_data, headers=headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Insufficient product stock"

def test_get_orders(client, auth_headers):
    headers = auth_headers()
    response = client.get("/api/orders/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_order_by_id_not_found(client, auth_headers):
    headers = auth_headers()
    response = client.get("/api/orders/99999", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Order not found"
