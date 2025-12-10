import type { APIRoute } from "astro";
import { supabase } from "../lib/supabase"; 

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // 1. Leer los datos que envía el formulario
    const formData = await request.json();
    const { title, description, image_url, user_id } = formData;

    // 2. Validar sesión (Seguridad: Solo si tiene cookies permitimos guardar)
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (!accessToken || !refreshToken) {
      return new Response(JSON.stringify({ error: "No autorizado: Faltan cookies" }), { status: 401 });
    }

    // 3. Guardar en la Base de Datos de Supabase
    const { error } = await supabase.from('posts').insert({
      user_id: user_id,
      title: title,
      description: description,
      image_url: image_url
    });

    if (error) {
      console.error("Error Supabase:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // 4. Todo salió bien
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("Error del servidor:", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
};