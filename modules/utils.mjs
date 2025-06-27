export function debug_log(msg) {
  const logElem = document.getElementById('log');
  if (logElem) logElem.textContent += msg + "\n";
}

export function clear_log() {
  const logElem = document.getElementById('log');
  if (logElem) logElem.textContent = "";
}
