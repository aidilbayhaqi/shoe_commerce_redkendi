def test_update_user_profile(client, auth_headers):
    headers = auth_headers()
    update_data = {
        "username": "updated_testuser",
        "phone": "081234567899",
        "address": "Updated Test Address"
    }
    response = client.put("/api/users/me", json=update_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "updated_testuser"
    assert data["phone"] == "081234567899"
    assert data["address"] == "Updated Test Address"
    
def test_update_user_profile_email_already_in_use(client, auth_headers):
    headers = auth_headers()
    update_data = {
        "email": "admin@example.com" # Email already used by admin user
    }
    response = client.put("/api/users/me", json=update_data, headers=headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already in use"
def test_logout_user(client):
    response = client.post("/api/users/logout")
    assert response.status_code == 200
    assert response.json()["message"] == "Logout successful (client should delete the token)"