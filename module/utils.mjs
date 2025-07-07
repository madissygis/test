export function debug_log(msg) {
  const status = document.getElementById("status");
  if (status) {
    status.textContent += msg + "\n";
  }
}
