from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Inicializamos la app
app = FastAPI()

# Configuración de CORS para que tu Astro Frontend pueda hablar con este Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta de prueba
@app.get("/api/brain")
def cerebro_central():
    return {"mensaje": "¡Hola! Soy el cerebro Python de QuillaDetails viviendo en Vercel 🧠"}

# Una ruta útil: Generador de ideas (Simulado)
@app.get("/api/brain/idea")
def idea_creativa():
    import random
    ideas = [
        "Usa resina epóxica con flores secas",
        "Intenta tejer con lana gruesa de colores neón",
        "Pinta cerámica con efecto marmolado",
        "Haz una lámpara con botellas recicladas"
    ]
    return {"sugerencia": random.choice(ideas)}