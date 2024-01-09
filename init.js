import { main } from "./main";

const section = document.querySelector("#grid-item3");
const button = section.querySelector(".button");
const dummy = () => {
  alert("Sequence Initilized!");
  main();
};
button.addEventListener("click", dummy, true);
