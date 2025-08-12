from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    DATABASE_URL: str 
    SECRET_KEY: str
    ALGORITHM: str 
    ALLOWED_ORIGINS: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

    @field_validator("ALLOWED_ORIGINS")    
    def parse_allowed_origins(cls, v:str)->List[str]:
        return v.split(',') if v else []
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        
settings = Settings()