window.read_target = new Uint8Array(8);

function run_payload() {
  debug_log("Running copyout read64 test...");

  // Set up a known value for JS to detect later
  for (let i = 0; i < 8; i++) read_target[i] = 0xAA;

  // Use static read from libkernel base
  schedule_read64(0xFFFFFFFF82600000);

  setTimeout(() => {
    let v = new DataView(read_target.buffer);
    const lo = v.getUint32(0, true);
    const hi = v.getUint32(4, true);
    const result = (BigInt(hi) << 32n) | BigInt(lo);

    debug_log("read_target updated: 0x" + result.toString(16));
  }, 500);
}
