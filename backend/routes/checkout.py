from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from typing import List
from datetime import datetime

from models.checkout import Checkout
from models.order import Order
from models.user import User
from schemas.checkout import CheckoutCreate, CheckoutResponse
from db.database import get_db

from core.security import get_current_user

router = APIRouter(
    prefix="/api/checkouts",
    tags=["Checkouts"]
)

# GET ALL
@router.get("/", response_model=List[CheckoutResponse])
def get_checkouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return db.query(Checkout)\
                 .options(joinedload(Checkout.product))\
                 .filter(Checkout.user_id == current_user.id).all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# GET BY ID
@router.get("/{checkout_id}", response_model=CheckoutResponse)
def get_checkout_by_id(
    checkout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        checkout = db.query(Checkout).filter(Checkout.id == checkout_id).first()
        if not checkout:
            raise HTTPException(status_code=404, detail="Checkout not found")
        if checkout.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized access")
        return checkout
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# CREATE
@router.post("/", response_model=CheckoutResponse)
def create_checkout(
    data: CheckoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Ambil order
        order = db.query(Order).filter(Order.id == data.order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized access")

        if order.status == "complete":
            raise HTTPException(status_code=400, detail="Order already completed")

        # Validasi & perbarui data user jika perlu
        address_to_use = current_user.address or data.address
        email_to_use = current_user.email or data.email
        phone_to_use = current_user.phone or data.no_hp

        if not all([address_to_use, email_to_use, phone_to_use]):
            raise HTTPException(status_code=400, detail="Address, email, and phone are required")

        current_user.address = address_to_use
        current_user.email = email_to_use
        current_user.phone = phone_to_use

        # Ubah status order
        order.status = "complete"

        # Buat checkout
        new_checkout = Checkout(
            order_id=order.id,
            user_id=current_user.id,
            product_id=order.product_id,
            total_price=order.total_price,
            payment_method=data.payment_method,
            status="complete",
            created_at=datetime.utcnow(),
            address=address_to_use,
            email=email_to_use,
            no_hp=phone_to_use
        )

        db.add(new_checkout)
        db.commit()
        db.refresh(new_checkout)

        return new_checkout

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# DELETE
@router.delete("/{checkout_id}")
def delete_checkout(
    checkout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        checkout = db.query(Checkout).filter(Checkout.id == checkout_id).first()
        if not checkout:
            raise HTTPException(status_code=404, detail="Checkout not found")
        if checkout.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized access")

        db.delete(checkout)
        db.commit()
        return {"message": "Checkout deleted successfully"}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
