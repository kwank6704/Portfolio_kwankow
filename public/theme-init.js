// Runs before first paint. Kept as a separate file (not inline) so the Content-Security-Policy can forbid inline scripts.
//  · applies the saved / system theme so it never flashes the wrong colours
//  · marks <html class="js">, so scroll-reveal content is only hidden when JS can reveal it again
document.documentElement.classList.add("js");
try {
  var fs = parseFloat(localStorage.getItem("fs") || "1");
  if (fs === 0.9 || fs === 1 || fs === 1.15 || fs === 1.3) document.documentElement.style.setProperty("--fs", String(fs));
} catch (e) { /* storage unavailable */ }
try {
  var t = localStorage.getItem("theme");
  if (t !== "light" && t !== "dark") t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.dataset.theme = t;
} catch (e) {
  document.documentElement.dataset.theme = "dark";
}
