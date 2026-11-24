// js/main.js
// Einstiegspunkt: genau ein <script type="module">.

import { App } from "./core/App.js";
import { loadChronik } from "./data/loader.js";

const root = document.getElementById("app");
const chronik = await loadChronik();
const app = new App(root, { chronik });
app.start();
