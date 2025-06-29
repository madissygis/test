// rop.js (safe test version)

function debug_log(msg) {
  const el = document.createElement("pre");
  el.textContent = msg;
  document.body.appendChild(el);
}

debug_log("✅ rop.js loaded!");
