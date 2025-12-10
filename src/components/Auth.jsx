import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Nuevo estado para contraseña

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Login directo con Supabase (Sin correos)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    // 2. Si el login funciona, enviamos los tokens a nuestro servidor Astro
    const { access_token, refresh_token } = data.session;

    // Llamamos a la API que creamos en el Paso 2
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token, refresh_token }),
    });

    if (response.ok) {
        // 3. Redirigimos al Feed manualmente
        window.location.href = "/feed";
    } else {
        alert("Error al iniciar sesión en el servidor");
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        
        {/* Decoración */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyber-rose/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-600/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-wider drop-shadow-md uppercase">
          QUILLA<span className="text-cyber-rose">DETAILS</span>
        </h2>
        <p className="text-center text-gray-200 mb-8 font-light">
          Ingresa con tu contraseña.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 relative z-10">
          <input
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-rose/50 transition-all"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-rose/50 transition-all"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-cyber-rose to-purple-600 hover:from-purple-600 hover:to-cyber-rose text-white font-bold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}