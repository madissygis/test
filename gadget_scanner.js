export function findGadgets(start, end) {
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

  function readBytes(addr, length) {
    let result = [];
    for (let i = 0; i < length; i++) {
      result.push(readByte(addr + i));
    }
    return result;
  }

  function matchesSignature(addr, sig) {
    const actual = readBytes(addr, sig.bytes.length);
    return sig.bytes.every((b, i) => b === actual[i]);
  }

  const found = [];
  for (let addr = start; addr < end; addr++) {
    for (const sig of GADGET_SIGS) {
      if (matchesSignature(addr, sig)) {
        log(`0x${addr.toString(16)}: ${sig.name}`);
        found.push({ addr: addr, name: sig.name });
      }
    }
  }
  log(`Found ${found.length} gadgets.`);
  return found;
}