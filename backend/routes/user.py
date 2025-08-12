from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from datetime import timedelta

from db.database import get_db
from models.user import User
from schemas.user import UserCreate, UserOut, UserUpdate, UserLogin
from schemas.user import Token
from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

import os

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

# Register
@router.post("/register", response_model=UserOut)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        password=hashed_pw,
        address=user_data.address,
        phone=user_data.phone,
        is_admin=user_data.is_admin  
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Login
@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Me (current user)
@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Update profile
@router.put("/me", response_model=UserOut)
def update_profile(
    update_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # pastikan auth terpasang
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_data.username:
        user.username = update_data.username
    if update_data.email:
        # Cek jika email baru sudah dipakai user lain
        email_exist = db.query(User).filter(
            User.email == update_data.email,
            User.id != current_user.id
        ).first()
        if email_exist:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = update_data.email
    if update_data.password:
        user.password = hash_password(update_data.password)
    if update_data.address is not None:
        user.address = update_data.address
    if update_data.phone is not None:
        user.phone = update_data.phone

    db.commit()
    db.refresh(user)
    return user

# Logout (just a placeholder since JWT is stateless)
@router.post("/logout")
def logout():
    return {"message": "Logout successful (client should delete the token)"}
