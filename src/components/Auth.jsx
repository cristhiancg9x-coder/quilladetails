import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Nuevo: Controla si estamos en Login o Registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    let data, error;

    if (isLogin) {
      // MODO 1: INICIAR SESIÓN (Usuarios existentes)
      const res = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      data = res.data;
      error = res.error;
    } else {
      // MODO 2: REGISTRARSE (Usuarios nuevos)
      const res = await supabase.auth.signUp({
        email,
        password,
        // Opcional: Podríamos guardar datos extra aquí, pero lo haremos en el perfil luego
      });
      data = res.data;
      error = res.error;
    }

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    // Si es registro y Supabase pide confirmar email (aunque lo desactivamos), avisamos
    if (!isLogin && !data.session) {
      alert("Cuenta creada. Si no entraste automáticamente, verifica tu configuración de Supabase.");
      setLoading(false);
      return;
    }

    // SI TENEMOS SESIÓN (Login exitoso o Registro exitoso inmediato)
    if (data.session) {
        const { access_token, refresh_token } = data.session;

        // Enviamos las cookies al servidor Astro
        const response = await fetch("/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token, refresh_token }),
        });

        if (response.ok) {
            window.location.href = "/feed";
        } else {
            alert("Error de conexión con el servidor");
        }
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
        
        {/* Pestañas para cambiar modo */}
        <div className="flex justify-center gap-4 mb-6 mt-4 relative z-10">
            <button 
                onClick={() => setIsLogin(true)}
                className={`pb-2 text-sm font-bold transition-all ${isLogin ? 'text-cyber-rose border-b-2 border-cyber-rose' : 'text-gray-400 hover:text-white'}`}
            >
                INICIAR SESIÓN
            </button>
            <button 
                onClick={() => setIsLogin(false)}
                className={`pb-2 text-sm font-bold transition-all ${!isLogin ? 'text-cyber-rose border-b-2 border-cyber-rose' : 'text-gray-400 hover:text-white'}`}
            >
                REGISTRARSE
            </button>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4 relative z-10">
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
            placeholder="Contraseña (Mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-cyber-rose to-purple-600 hover:from-purple-600 hover:to-cyber-rose text-white font-bold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Procesando...' : (isLogin ? 'ENTRAR' : 'CREAR CUENTA')}
          </button>
        </form>
        
        <p className="mt-4 text-xs text-center text-gray-400">
            {isLogin ? "¿No tienes cuenta? Pásate a la pestaña de Registrarse." : "Al registrarte aceptas ser parte de nuestra comunidad creativa."}
        </p>

      </div>
    </div>
  );
}