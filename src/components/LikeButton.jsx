import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LikeButton({ postId, initialLikes, userId, initialHasLiked }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialHasLiked);
  const [animating, setAnimating] = useState(false);

  const toggleLike = async () => {
    if (!userId) return alert("Inicia sesión para dar like");

    // Feedback visual instantáneo (Optimistic UI)
    const previousLiked = isLiked;
    setIsLiked(!previousLiked);
    setLikes(previousLiked ? likes - 1 : likes + 1);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300); // Reset animación

    if (!previousLiked) {
      // DAR LIKE: Insertar en la tabla
      const { error } = await supabase
        .from('post_likes')
        .insert({ user_id: userId, post_id: postId });
      
      if (error) {
        console.error(error);
        // Si falla, revertimos el cambio visual
        setIsLiked(false);
        setLikes(likes);
      }
    } else {
      // QUITAR LIKE: Borrar de la tabla
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);

      if (error) {
        console.error(error);
        setIsLiked(true);
        setLikes(likes);
      }
    }
  };

  return (
    <button 
      onClick={toggleLike}
      className={`
        flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300
        ${isLiked 
          ? 'bg-cyber-rose/20 border-cyber-rose text-cyber-rose shadow-[0_0_10px_rgba(255,0,127,0.4)]' 
          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
        ${animating ? 'scale-110' : 'scale-100'}
      `}
    >
      {/* Icono de Corazón SVG */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-5 w-5 transition-transform duration-300 ${isLiked ? 'fill-current' : 'fill-none stroke-current'}`}
        viewBox="0 0 24 24" 
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      
      <span className="text-sm font-semibold">{likes}</span>
    </button>
  );
}