from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile
import os
import uuid
import json
import shutil
from sqlalchemy.orm import Session
from typing import List, Optional

from db.database import get_db
from models.product import Product
from schemas.product import ProductOut
from core.security import get_current_admin_user

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)

UPLOAD_FOLDER = os.path.join("uploads", "images")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# GET all products
@router.get("/", response_model=List[ProductOut])
def get_products(db: Session = Depends(get_db)):
    try:
        return db.query(Product).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve products: {str(e)}")


# GET product by ID
@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# POST create product
@router.post("/", response_model=ProductOut)
def create_product(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: int = Form(...),
    stock: int = Form(...),
    type: Optional[str] = Form(None),  # JSON string
    color: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    age: Optional[int] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user)
):
    try:
        image_url = None
        if image:
            if not image.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                raise HTTPException(status_code=400, detail="Invalid image format. Use JPG, PNG, or WEBP.")
            filename = f"{uuid.uuid4().hex}_{image.filename}"
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_url = f"/{file_path}"

        try:
            product_type = json.loads(type) if type else []
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid format for 'type'. Must be a valid JSON list.")

        new_product = Product(
            name=name,
            description=description,
            price=price,
            stock=stock,
            image_url=image_url,
            type=product_type,
            color=color,
            gender=gender,
            age=age,
            owner_id=current_user.id
        )

        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return new_product

    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")


# PUT update product
@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: int = Form(...),
    stock: int = Form(...),
    type: Optional[str] = Form(None),
    color: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    age: Optional[int] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        product.name = name
        product.description = description
        product.price = price
        product.stock = stock
        product.color = color
        product.gender = gender
        product.age = age
        product.owner_id = current_user.id

        if type:
            try:
                product.type = json.loads(type)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid format for 'type'. Must be JSON list.")

        if image:
            if not image.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                raise HTTPException(status_code=400, detail="Invalid image format. Use JPG, PNG, or WEBP.")
            filename = f"{uuid.uuid4().hex}_{image.filename}"
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            product.image_url = f"/{file_path}"

        db.commit()
        db.refresh(product)
        return product

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update product: {str(e)}")


# DELETE product
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        db.delete(product)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete product: {str(e)}")
