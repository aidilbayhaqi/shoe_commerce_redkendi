from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db

from models.order import Order
from models.user import User
from models.product import Product

from schemas.order import OrderCreate, OrderOut

from core.security import get_current_user

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)


@router.post("/", response_model=OrderOut)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Cek produk tersedia
    product = db.query(Product).filter(Product.id == order_data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Cek apakah stok cukup
    if product.stock < order_data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient product stock")

    # Hitung total harga
    total_price = product.price * order_data.quantity

    # Buat order baru
    new_order = Order(
        user_id=current_user.id,
        product_id=order_data.product_id,
        quantity=order_data.quantity,
        total_price=total_price,
    )

    # Kurangi stok produk
    product.stock -= order_data.quantity

    # Simpan perubahan stok dan order ke database
    db.add(new_order)
    db.commit()  
    db.refresh(new_order)

    return new_order



@router.get("/", response_model=list[OrderOut])
def get_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return orders

@router.get("/{order_id}", response_model=OrderOut)
def get_order_by_id(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
