export function debug_log(msg) {
  const logElem = document.getElementById('log');
  if (logElem) {
    logElem.textContent += msg + "\n";
  }
}
