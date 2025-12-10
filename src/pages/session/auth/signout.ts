import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // 1. Avisamos a Supabase que cerramos sesión
  await supabase.auth.signOut();

  // 2. Borramos las cookies del navegador
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  // 3. Te enviamos a la pantalla de Login
  return redirect("/");
};