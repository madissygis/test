function Int64(lo, hi) {
  this.lo = lo >>> 0;
  this.hi = hi >>> 0;
}

Int64.prototype.toString = function () {
  return '0x' + this.hi.toString(16).padStart(8, '0') + this.lo.toString(16).padStart(8, '0');
};

Int64.prototype.asDouble = function () {
  var buffer = new ArrayBuffer(8);
  var u32 = new Uint32Array(buffer);
  u32[0] = this.lo;
  u32[1] = this.hi;
  return new Float64Array(buffer)[0];
};

Int64.fromDouble = function (d) {
  var buffer = new ArrayBuffer(8);
  new Float64Array(buffer)[0] = d;
  var u32 = new Uint32Array(buffer);
  return new Int64(u32[0], u32[1]);
};
