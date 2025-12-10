import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nueva versión disponible. Recargando...');
  },
  onOfflineReady() {
    console.log('App lista para trabajar offline');
  },
});