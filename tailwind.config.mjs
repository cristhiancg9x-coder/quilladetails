/** @type {import('tailwindcss').Config} */
export default {
	// Esto le dice a Tailwind dónde buscar clases CSS para compilar
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// NUESTRA PALETA DE COLORES PERSONALIZADA
				'cyber-rose': '#ff007f',  // Rosa neón potente
				'deep-space': '#0f0c29',  // Azul muy oscuro casi negro (fondo)
				'holo-silver': '#e0e0e0', // Plata para detalles
			},
			backgroundImage: {
				// Gradiente para el efecto vidrio
				'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
			},
			fontFamily: {
				// Vinculamos la fuente que pusimos en el Layout
				sans: ['Outfit', 'sans-serif'],
			}
		},
	},
	plugins: [],
}