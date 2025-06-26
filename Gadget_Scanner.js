// gadget_scanner.js
// Passive byte signature-based ROP gadget scanner for PS4 (WebKit exploit context)

const GADGET_SIGS = [
  { name: "pop rdi ; ret", bytes: [0x5f, 0xc3] },
  { name: "pop rsi ; ret", bytes: [0x5e, 0xc3] },
  { name: "pop rdx ; ret", bytes: [0x5a, 0xc3] },
  { name: "pop rcx ; ret", bytes: [0x59, 0xc3] },
  { name: "pop rax ; ret", bytes: [0x58, 0xc3] },
  { name: "mov [rdi], rax ; ret", bytes: [0x48, 0x89, 0x07, 0xc3] },
  { name: "mov rax, [rdi] ; ret", bytes: [0x48, 0x8b, 0x07, 0xc3] },
  { name: "ret", bytes: [0xc3] }
];

// Dummy memory object to simulate read/write (to be replaced by real primitives)
const memory = {
  readByte(addr) {
    throw new Error("readByte(addr) must be implemented with memory read primitive");
  },

  readBytes(addr, len) {
    let out = [];
    for (let i = 0; i < len; i++) {
      out.push(this.readByte(addr + i));
    }
    return out;
  },

  matchesSignature(addr, sig) {
    const actual = this.readBytes(addr, sig.bytes.length);
    return sig.bytes.every((b, i) => b === actual[i]);
  }
};

// Scans memory for gadget signatures
function scanMemory(start, end) {
  const found = [];
  for (let addr = start; addr < end; addr++) {
    for (const sig of GADGET_SIGS) {
      try {
        if (memory.matchesSignature(addr, sig)) {
          found.push({ addr: addr, name: sig.name });
        }
      } catch (e) {
        // Memory read failure, skip address
      }
    }
  }
  return found;
}

// Entry point
function findGadgets(start, end) {
  log(`Scanning memory range: 0x${start.toString(16)} - 0x${end.toString(16)}`);
  const gadgets = scanMemory(start, end);
  log(`Found ${gadgets.length} gadgets:`);
  for (const g of gadgets) {
    log(`  0x${g.addr.toString(16)}: ${g.name}`);
  }
  return gadgets;
}

// Export for external use
if (typeof window !== 'undefined') {
  window.findGadgets = findGadgets;
  window.memory = memory;
}
