// Importamos los módulos de Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// Configuración obtenida desde Firebase Console
const firebaseConfig = {
      apiKey: "AIzaSyBSozZACEwNHU1vwSVacySicEPNIdsSdCI",
      authDomain: "pwa-rolando.firebaseapp.com",
      projectId: "pwa-rolando",
      storageBucket: "pwa-rolando.firebasestorage.app",
      messagingSenderId: "1076632724479",
      appId: "1:1076632724479:web:4fd0fe4a50e985b8a8fdca"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Utilidades para manipular el DOM
const $ = (sel) => document.querySelector(sel);
const log = (m) => ($("#log").textContent += ( ($("#log").textContent === "—" ? "" : "\n") + m));

// Mostramos el estado inicial del permiso
$("#perm").textContent = Notification.permission;

// Registramos el Service Worker que manejará las notificaciones en segundo plano
let swReg;
if ('serviceWorker' in navigator) {
  swReg = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
  console.log('SW registrado:', swReg.scope);
}

// Verificamos si el navegador soporta FCM
const supported = await isSupported();
let messaging = null;

if (supported) {
  messaging = getMessaging(app);
} else {
  log("Este navegador no soporta FCM en la Web.");
}

// Clave pública VAPID (de Cloud Messaging)
const VAPID_KEY = "BLZ4WG5KHtY43U49O_Pn-uhyI-sEWNhZPaw1ykvCpY0MavMCQCCPy9NrRzJGp06-wMc0-Ju4G1YTnwOWUdRNBRI";

// Función para pedir permiso al usuario y obtener token
async function requestPermissionAndGetToken() {
  try {
    const permission = await Notification.requestPermission();
    $("#perm").textContent = permission;

    if (permission !== 'granted') {
      log("Permiso denegado por el usuario.");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      $("#token").textContent = token;
      log("Token obtenido. Usa este token en Firebase Console → Cloud Messaging.");
    } else {
      log("No se pudo obtener el token.");
    }
  } catch (err) {
    console.error(err);
    log("Error al obtener token: " + err.message);
  }
}

// Escuchamos mensajes cuando la pestaña está abierta
if (messaging) {
  onMessage(messaging, (payload) => {
    log("Mensaje en primer plano:\n" + JSON.stringify(payload, null, 2));
  });
}

// Vinculamos la función al botón de permiso
$("#btn-permission").addEventListener("click", requestPermissionAndGetToken);