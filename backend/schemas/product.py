from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class ProductTypeItem(BaseModel):
    name: str
    size: int


class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: int
    image_url: Optional[str]
    created_at: datetime
    stock: Optional[int] = None
    type: Optional[List[ProductTypeItem]] = None
    color: Optional[str]
    gender: Optional[str]
    age: Optional[int]

    model_config = ConfigDict(from_attributes=True)