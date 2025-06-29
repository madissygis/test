function debug_log(msg) {
  const el = document.createElement("pre");
  el.textContent = msg;
  document.body.appendChild(el);
}

let ropChain = new Uint32Array(0x100);

function schedule_read64(addr) {
  debug_log("📦 schedule_read64() called");

  let i = 0;

  // Simulate setting up a copyout syscall (dummy values)
  ropChain[i++] = 0x41414141;
  ropChain[i++] = 0x42424242;
  ropChain[i++] = 0x43434343;
  ropChain[i++] = 0x44444444;

  debug_log("✅ ropChain initialized");
}
