/* Entry point de la aplicación */

import { createApp } from "vue";
import { pinia } from "./stores";
import router from "./router";
import App from "./App.vue";
import { useDatabase } from "@hooks";

// Estilos globales
import "@styles/index.css";

const app = createApp(App);

// Plugins
app.use(pinia);
app.use(router);

// Inicializar base de datos
const { initialize } = useDatabase();
initialize();

app.mount("#app");
