export class Int64 {
  constructor(v) {
    this.bytes = new Uint8Array(8);
    if (typeof v === 'number') {
      this.assignDouble(v);
    } else if (typeof v === 'bigint') {
      this.assignBigInt(v);
    } else {
      throw "Invalid Int64 initializer";
    }
  }

  assignBigInt(b) {
    let val = BigInt.asUintN(64, b);
    for (let i = 0; i < 8; i++) {
      this.bytes[i] = Number((val >> BigInt(i * 8)) & 0xffn);
    }
  }

  toBigInt() {
    let result = 0n;
    for (let i = 0; i < 8; i++) {
      result |= BigInt(this.bytes[i]) << BigInt(i * 8);
    }
    return result;
  }

  assignDouble(d) {
    let f64 = new Float64Array(1);
    f64[0] = d;
    let u8 = new Uint8Array(f64.buffer);
    this.bytes.set(u8);
  }
}
