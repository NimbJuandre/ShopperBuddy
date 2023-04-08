import { Workbox } from "workbox-window";

let wb;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then(reg => {
      console.log(`Service Worker Registration (Scope: ${reg.scope})`);

      Notification.requestPermission().then(res => {
        if (Notification.permission == 'granted') {
          console.log("Granted permission")
          return
        }
        console.log(res)
      })
    })
    .catch(error => {
      const msg = `Service Worker Error (${error})`;
      console.error(msg);
    });

  wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);

  wb.addEventListener("controlling", () => {
    window.location.reload();
  });

  wb.register();
} else {
  wb = null;
}

export default wb;