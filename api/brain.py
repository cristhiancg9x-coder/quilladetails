from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import requests
from io import BytesIO
from colorthief import ColorThief
from PIL import Image  # <--- Importamos la librería de imágenes

# Configuración inicial
app = FastAPI(root_path="/api/brain")

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

@app.get("/analizar-colores")
def analizar_colores(url_imagen: str):
    print(f"Iniciando análisis inteligente de: {url_imagen}")
    try:
        # 1. Descargar imagen
        response = requests.get(url_imagen, timeout=10)
        response.raise_for_status()
        
        # 2. Abrir con Pillow para arreglar transparencias
        img_original = Image.open(BytesIO(response.content))
        
        # Si tiene transparencia (RGBA), poner fondo BLANCO
        if img_original.mode in ('RGBA', 'LA') or (img_original.mode == 'P' and 'transparency' in img_original.info):
            # Crear fondo blanco
            fondo = Image.new('RGB', img_original.size, (255, 255, 255))
            # Convertir a RGBA para poder usarla de máscara
            if img_original.mode != 'RGBA':
                img_original = img_original.convert('RGBA')
            # Pegar la imagen sobre el fondo blanco
            fondo.paste(img_original, mask=img_original.split()[3])
            img_final = fondo
        else:
            img_final = img_original.convert('RGB')

        # 3. Guardar la imagen arreglada en memoria para ColorThief
        buffer_arreglado = BytesIO()
        img_final.save(buffer_arreglado, format="JPEG")
        buffer_arreglado.seek(0)

        # 4. Extraer colores ahora sí
        ct = ColorThief(buffer_arreglado)
        paleta = ct.get_palette(color_count=5, quality=10)
        colores_hex = ['#%02x%02x%02x' % color for color in paleta]
        
        return {"colores": colores_hex}

    except Exception as e:
        print(f"Error procesando imagen: {str(e)}")
        # Si falla, devolvemos una paleta de seguridad (no negro)
        return {"colores": ["#DDDDDD", "#AAAAAA", "#888888"], "error": str(e)}