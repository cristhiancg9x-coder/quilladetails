import { useState } from 'react';

export default function InspirationWidget() {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(false);

  const getIdea = async () => {
    setLoading(true);
    try {
      // Llamamos a TU cerebro Python
      const response = await fetch('/api/brain/idea');
      const data = await response.json();
      setIdea(data.sugerencia);
    } catch (error) {
      console.error("El cerebro está dormido:", error);
      setIdea("Intenta mezclar colores neón con texturas naturales.");
    }
    setLoading(false);
  };

  return (
    <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-cyber-rose to-purple-600 shadow-[0_0_20px_rgba(255,0,127,0.3)]">
      <div className="bg-deep-space rounded-xl p-6 text-center relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none"></div>
        
        <h3 className="text-white font-bold text-lg mb-2 z-10 relative">
          ✨ ¿Bloqueo Creativo?
        </h3>
        
        {idea ? (
          <div className="animate-fade-in my-4">
            <p className="text-2xl font-light text-cyber-rose italic">"{idea}"</p>
            <button 
                onClick={getIdea}
                className="mt-4 text-xs text-gray-400 hover:text-white underline"
            >
                Pedir otra idea
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-sm mb-4 z-10 relative">
            Deja que nuestra IA te sugiera tu próximo proyecto.
          </p>
        )}

        {!idea && (
            <button 
            onClick={getIdea}
            disabled={loading}
            className="
                relative z-10 px-6 py-2 rounded-full font-bold text-sm
                bg-white text-deep-space hover:bg-cyber-rose hover:text-white
                transition-all transform hover:scale-105
            "
            >
            {loading ? 'Pensando...' : 'Inspirarme'}
            </button>
        )}
      </div>
    </div>
  );
}