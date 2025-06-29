window.onload = () => {
  const log = document.createElement("pre");
  log.textContent = "✅ payload.js loaded!";
  document.body.appendChild(log);

  schedule_read64(0xDEADBEEF);
};
