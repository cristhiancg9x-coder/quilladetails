import { useState, useEffect } from 'react';

export default function ColorPalette({ imageUrl }) {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const encodedUrl = encodeURIComponent(imageUrl);
        // Usa la ruta completa que ya confirmamos que funciona
        const res = await fetch(`/api/brain/analizar-colores?url_imagen=${encodedUrl}`);
        if (!res.ok) throw new Error("Error en la API");
        const data = await res.json();
        setColors(data.colores || []);
      } catch (err) {
        console.error("Fallo al detectar colores", err);
      }
      setLoading(false);
    };

    if (imageUrl) fetchColors();
  }, [imageUrl]);

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Color ${color} copiado al portapapeles 🎨`);
  };

  if (loading) return <div className="h-12 w-full animate-pulse bg-white/5 rounded-xl mb-6 flex gap-3 p-2"><div className="w-10 h-10 rounded-full bg-white/10"></div><div className="w-10 h-10 rounded-full bg-white/10"></div></div>;
  if (colors.length === 0) return null;

  return (
    <div className="mb-8 animate-fade-in">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Paleta de Colores IA ✨
      </h3>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color, index) => (
          <button 
            key={index} 
            onClick={() => copyColor(color)}
            className="group relative flex flex-col items-center focus:outline-none"
            title="Clic para copiar"
          >
            {/* Círculo de color */}
            <div 
                className="w-12 h-12 rounded-full shadow-lg border-2 border-white/10 group-hover:scale-110 group-active:scale-95 transition-transform"
                style={{ backgroundColor: color }}
            ></div>
            
            {/* Código HEX visible al pasar mouse */}
            <span className="mt-2 text-[10px] text-gray-400 font-mono opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                {color}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}