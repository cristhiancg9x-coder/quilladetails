import { supabase } from "../../../lib/supabase";

export const GET = async ({ url, cookies, redirect }: any) => {
  const authCode = url.searchParams.get("code");

  // CASO 1: No llegó el código desde Supabase
  if (!authCode) {
    console.log("❌ Error: No code received in URL");
    return redirect("/?error=no_code_received");
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);

  // CASO 2: Supabase rechazó el código (quizás expiró o es inválido)
  if (error) {
    console.log("❌ Error Supabase Exchange:", error.message);
    return redirect(`/?error=exchange_failed&details=${error.message}`);
  }

  const { access_token, refresh_token } = data.session;
  
  // Guardamos las cookies con configuración explícita para Localhost
  cookies.set("sb-access-token", access_token, { 
    path: "/",
    httpOnly: true,
    secure: false, // Importante: false en localhost (true en producción)
    sameSite: 'lax'
  });
  
  cookies.set("sb-refresh-token", refresh_token, { 
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });

  console.log("✅ Éxito: Cookies guardadas. Redirigiendo al Feed...");
  return redirect("/feed");
};