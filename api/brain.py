from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
import requests
from io import BytesIO
from colorthief import ColorThief

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def cerebro_central():
    return {"mensaje": "Cerebro de QuillaDetails: ACTIVO 🟢"}

@app.get("/idea")
def idea_creativa():
    ideas = [
        "Usa resina epóxica con flores secas",
        "Intenta tejer con lana gruesa de colores neón",
        "Pinta cerámica con efecto marmolado",
        "Haz una lámpara con botellas recicladas",
        "Crea joyería con arcilla polimérica"
    ]
    return {"sugerencia": random.choice(ideas)}

# --- NUEVA FUNCIÓN IA: ANALIZADOR DE COLORES ---
@app.get("/analizar-colores")
def analizar_colores(url_imagen: str):
    try:
        # 1. Descargar la imagen de la URL (Supabase)
        response = requests.get(url_imagen)
        response.raise_for_status()
        
        # 2. Convertir la imagen a bytes en memoria
        imagen_memoria = BytesIO(response.content)
        
        # 3. Usar ColorThief para extraer la paleta
        ct = ColorThief(imagen_memoria)
        # Pedimos 4 colores dominantes
        paleta = ct.get_palette(color_count=5, quality=10)
        
        # 4. Convertir RGB a HEX (ej: #FF0000)
        colores_hex = ['#%02x%02x%02x' % color for color in paleta]
        
        return {"colores": colores_hex}

    except Exception as e:
        print(f"Error analizando imagen: {e}")
        # Si falla, devolvemos una lista vacía para no romper la app
        return {"colores": []}