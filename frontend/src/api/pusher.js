import Pusher from "pusher-js";
Pusher.logToConsole = true;

var pusher = new Pusher(import.meta.env.VITE_KEY, {
  cluster: import.meta.env.VITE_CLUSTER,
});

export default pusher;
