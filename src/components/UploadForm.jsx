import { useState } from 'react';
import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression'; 

export default function UploadForm({ userId }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(''); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatus('Comprimiendo imagen...');

    const title = e.target.title.value;
    const description = e.target.description.value;

    try {
      // 1. CONFIGURACIÓN DE COMPRESIÓN (WebP + Reducción Inteligente)
      const options = {
        maxSizeMB: 1,              // Intentar que pese menos de 1MB
        maxWidthOrHeight: 1920,    // Si es gigante (4K), bajarla a Full HD
        useWebWorker: true,        // Usar hilo secundario para no congelar la pantalla
        fileType: 'image/webp',    // Convertir a WebP (formato super ligero)
        initialQuality: 0.8,       // 80% de calidad
      };

      // ¡Aquí ocurre la magia!
      const compressedFile = await imageCompression(file, options);
      
      console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Comprimido: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

      setStatus('Subiendo a la nube...');

      // 2. SUBIDA DIRECTA A SUPABASE
      // Cambiamos la extensión a .webp
      const fileName = `${userId}/${Date.now()}-optimized.webp`;
      
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, compressedFile, {
            contentType: 'image/webp',
            cacheControl: '3600',
            upsert: false
        });

      if (uploadError) throw uploadError;

      // 3. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(fileName);

      setStatus('Guardando datos...');

      // 4. Guardar en Base de Datos
      // Asegúrate de que este endpoint exista (/pages/api/create_post.ts)
      const response = await fetch('/guardar_post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          image_url: publicUrl,
          user_id: userId
        })
      });

      if (response.ok) {
        window.location.href = "/feed"; 
      } else {
        throw new Error("Error guardando el post en la base de datos");
      }

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)]">
        
        {/* Selector de Archivo */}
        <div className="relative group cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            required
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          
          <div className="w-full h-64 border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center text-gray-300 group-hover:border-cyber-rose transition-colors overflow-hidden bg-black/20">
            {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
            ) : (
                <div className="text-center">
                    <span className="text-4xl mb-2 block">📷</span>
                    <span className="text-sm font-medium">Toca para subir foto</span>
                </div>
            )}
          </div>
        </div>

        {/* Campos */}
        <div>
          <label className="block text-cyber-rose text-sm font-bold mb-2 ml-1">TÍTULO</label>
          <input type="text" name="title" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-rose" />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-bold mb-2 ml-1">DESCRIPCIÓN</label>
          <textarea name="description" rows="3" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-rose"></textarea>
        </div>

        <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 mt-2 bg-gradient-to-r from-cyber-rose to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? status : 'PUBLICAR OPTIMIZADO'}
        </button>
    </form>
  );
}