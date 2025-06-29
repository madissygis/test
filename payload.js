let read_target = new Uint8Array(8); // Kernel will copy 8 bytes here

function run_payload() {
  debug_log("Payload starting...");

  // Run a test read from libkernel base
  const addr = 0xFFFFFFFF82600000; // libkernel base (known on 11.50)
  const val = read64(addr);

  debug_log("read64(libkernel base): 0x" + val.toString(16));
}
