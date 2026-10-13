// Runs before first paint so the saved / system theme never flashes the wrong colours.
// Kept as a separate file (not inline) so the Content-Security-Policy can forbid inline scripts.
try {
  var t = localStorage.getItem("theme");
  if (t !== "light" && t !== "dark") t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.dataset.theme = t;
} catch (e) {
  document.documentElement.dataset.theme = "dark";
}
