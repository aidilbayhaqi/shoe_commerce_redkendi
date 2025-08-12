from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from db.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    description = Column(String(255), nullable=True)
    stock = Column(Integer, nullable=False, default=0)
    price = Column(Integer, nullable=False)
    image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Filtering fields
    type = Column(JSON, nullable=True)     
    color = Column(String(20), nullable=True)   
    gender = Column(String(20), nullable=True)  
    age = Column(Integer, nullable=True)      
    
    __table_args__ = (
    Index('idx_product_name', 'name'),
    Index('idx_product_color', 'color'),
    Index('idx_product_gender', 'gender'),
    Index('idx_product_age', 'age'),
    )
    
    owner = relationship("User", back_populates="products")
    orders = relationship("Order", back_populates="product")
    checkouts = relationship("Checkout", back_populates="product")