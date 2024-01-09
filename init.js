/* import { main } from "./main.js"; */

const section = document.querySelector("#grid-item3");
const button = section.querySelector(".button");

button.addEventListener(
  "click",
  (event) => {
    button.textContent = "...";
  },
  true
);
