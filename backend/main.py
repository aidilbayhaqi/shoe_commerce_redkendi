from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes.user import router as user_router
from routes.product import router as product_router
from routes.order import router as order_router
from routes.checkout import router as checkout_router
from core.config import settings



app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include router dari user route
app.include_router(user_router)
app.include_router(product_router)
app.include_router(order_router)
app.include_router(checkout_router)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {"message": "Welcome to the FastAPI application!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
