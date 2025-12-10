import { useState, useEffect } from 'react';

export default function ColorPalette({ imageUrl }) {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        // Codificamos la URL de la imagen para enviarla segura
        const encodedUrl = encodeURIComponent(imageUrl);
        const res = await fetch(`/cerebro/analizar-colores?url_imagen=${encodedUrl}`);
        const data = await res.json();
        setColors(data.colores || []);
      } catch (err) {
        console.error("Fallo al detectar colores", err);
      }
      setLoading(false);
    };

    if (imageUrl) fetchColors();
  }, [imageUrl]);

  if (loading) return <div className="h-10 w-full animate-pulse bg-white/5 rounded-xl mb-6"></div>;
  if (colors.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Paleta de Colores IA</h3>
      <div className="flex gap-3">
        {colors.map((color, index) => (
          <div key={index} className="group relative flex flex-col items-center">
            {/* Círculo de color */}
            <div 
                className="w-12 h-12 rounded-full shadow-lg border-2 border-white/10 group-hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: color }}
            ></div>
            {/* Tooltip con el código HEX */}
            <span className="absolute -bottom-6 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                {color}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}