from fastapi import FastAPI

app = FastAPI()

@app.get("/api")
def read_root():
    return {"mensaje": "¡Hola desde Vercel y FastAPI!"}

@app.get("/api/saludo")
def creative_greeting():
    return {"mensaje": "La creatividad es la inteligencia divirtiéndose ✨"}