from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from schemas.product import ProductOut
from schemas.user import UserOut

class OrderCreate(BaseModel):
    product_id: int
    quantity: int = 1

class OrderOut(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    created_at: datetime
    total_price: float
    status: str
    user: UserOut
    product: ProductOut

    model_config = ConfigDict(from_attributes=True)