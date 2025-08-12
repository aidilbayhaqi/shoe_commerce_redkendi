from pydantic import BaseModel, ConfigDict
from datetime import datetime
from schemas.product import ProductOut
from typing import Optional
from pydantic import EmailStr

class CheckoutBase(BaseModel):
    order_id: int
    payment_method: str
    address: Optional[str] = None  
    email: Optional[str] = None  
    no_hp: Optional[str] = None  

class CheckoutCreate(CheckoutBase):
    pass

class CheckoutResponse(CheckoutBase):
    id: int
    user_id: int
    total_price: int
    status: str
    created_at: datetime
    address: Optional[str] = None
    email: Optional[EmailStr] = None
    no_hp: Optional[str] = None
    product: Optional[ProductOut] = None  

    model_config = ConfigDict(from_attributes=True)
