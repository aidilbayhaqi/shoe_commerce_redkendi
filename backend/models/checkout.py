from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from db.database import Base

class Checkout(Base):
    __tablename__ = 'checkouts'
    
    id=Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    product = relationship("Product", back_populates="checkouts")
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    total_price = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    status = Column(String(50), nullable=False, default='pending')
    payment_method = Column(String(50), nullable=False)
    address = Column(String(255), nullable=False)
    email = Column(String(50), nullable=False)
    no_hp = Column(String(20), nullable=False)
    
    __table_args__ = (
        Index('idx_checkout_order_id', 'order_id'),
        Index('idx_checkout_user_id', 'user_id'),
    )
    order = relationship("Order", back_populates="checkout")
    user = relationship("User", back_populates="checkouts")
    product = relationship("Product", back_populates="checkouts")