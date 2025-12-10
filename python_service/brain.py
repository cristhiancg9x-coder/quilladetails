from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

# Inicializamos la app
app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# RUTA 1: Verificación de salud
# Al entrar a /cerebro, Vercel nos trae aquí.
@app.get("/")
def cerebro_central():
    return {"mensaje": "¡Hola! Soy el cerebro Python de QuillaDetails viviendo en Vercel 🧠"}

# RUTA 2: Generador de ideas
# Esta es la que llama tu Widget: /cerebro/idea -> entra aquí en /idea
@app.get("/idea")
def idea_creativa():
    ideas = [
        "Usa resina epóxica con flores secas",
        "Intenta tejer con lana gruesa de colores neón",
        "Pinta cerámica con efecto marmolado",
        "Haz una lámpara con botellas recicladas",
        "Crea joyería con arcilla polimérica",
        "Personaliza una chaqueta de mezclilla con bordados",
        "Haz macetas de cemento con detalles dorados"
    ]
    return {"sugerencia": random.choice(ideas)}