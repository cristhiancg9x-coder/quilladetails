from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="QuillaDetails Brain",
    description="API Inteligente para la app de manualidades",
    version="1.0.0"
)

# Configuración de CORS (Vital para que tu Frontend Astro pueda hablar con este Backend)
# Por seguridad, luego restringiremos esto a tu dominio de Vercel.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite a todos (Vercel, Localhost)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mensaje": "¡Hola! Soy el cerebro de QuillaDetails 🧠 funcionando en Python."}

@app.get("/saludo-creativo")
def creative_greeting():
    return {"mensaje": "La creatividad es la inteligencia divirtiéndose ✨"}