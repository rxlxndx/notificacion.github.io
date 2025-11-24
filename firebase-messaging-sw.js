// Importamos las versiones compat de Firebase para SW
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Configuración igual que en app.js
firebase.initializeApp({
      apiKey: "AIzaSyBSozZACEwNHU1vwSVacySicEPNIdsSdCI",
      authDomain: "pwa-rolando.firebaseapp.com",
      projectId: "pwa-rolando",
      storageBucket: "pwa-rolando.firebasestorage.app",
      messagingSenderId: "1076632724479",
      appId: "1:1076632724479:web:4fd0fe4a50e985b8a8fdca"
});

const messaging = firebase.messaging();

// Evento cuando llega un mensaje en segundo plano
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Notificación";
  const options = {
    body: payload.notification?.body || "",
    icon: "/icon-192.png"
  };
  self.registration.showNotification(title, options);
});

// Manejar clics en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});