from pydantic import BaseModel, EmailStr
from pydantic import ConfigDict
from typing import List, Optional

        
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    is_admin: bool
    
    model_config = ConfigDict(from_attributes=True)
        
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    address: Optional[str] = None
    phone: Optional[str] = None
    is_admin: bool = False  
    
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None