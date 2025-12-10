import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // 1. Recibimos los tokens desde el Login de React
  const { access_token, refresh_token } = await request.json();

  if (!access_token || !refresh_token) {
    return new Response("Datos incompletos", { status: 400 });
  }

  // 2. Guardamos las cookies en el navegador
  cookies.set("sb-access-token", access_token, { path: "/" });
  cookies.set("sb-refresh-token", refresh_token, { path: "/" });

  // 3. Respondemos que todo salió bien
  return redirect("/feed");
};