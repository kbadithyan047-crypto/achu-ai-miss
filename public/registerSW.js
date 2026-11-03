if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('Achu AI ServiceWorker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('Achu AI ServiceWorker registration notice:', err);
      });
  });
}
