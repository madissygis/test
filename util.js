function log(msg) {
  const pre = document.createElement("pre");
  pre.textContent = msg;
  document.body.appendChild(pre);
}

function sprayHeap(size = 0x10000, count = 1000) {
  const spray = [];
  for (let i = 0; i < count; i++) {
    spray.push(new Uint8Array(size));
  }
  return spray;
}
