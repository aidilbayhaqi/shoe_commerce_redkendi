from sqlalchemy import Column, Integer, String, DateTime, Boolean, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))
    address = Column(String(255))
    phone = Column(String(20))
    is_admin = Column(Boolean, default=False)
    
    
    __table_args__ = (
        Index('idx_user_username', 'username'),
        Index('idx_user_email', 'email'),
    )
    
    products = relationship("Product", back_populates="owner")
    orders = relationship("Order", back_populates="user")
    checkouts = relationship("Checkout", back_populates="user")
