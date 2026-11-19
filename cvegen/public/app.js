(() => {
  "use strict";

  const form = document.getElementById("form");
  const input = document.getElementById("name");
  const randomBtn = document.getElementById("random");
  const result = document.getElementById("result");
  const card = result.querySelector(".card");
  const copyBtn = document.getElementById("copy");
  const linkBtn = document.getElementById("link");

  let current = null;
  let currentInput = "";

  const $ = (id) => document.getElementById(id);

  function render(v) {
    current = v;
    $("r-logo").textContent = v.logo;
    $("r-name").textContent = v.name;
    $("r-cve").textContent = v.cve;
    $("r-cvss").textContent = `CVSS ${v.cvss}`;
    $("r-desc").textContent = v.description;
    $("r-site").textContent = v.website;
    $("r-vendor").textContent = v.vendor;
    $("r-credit").textContent = v.credit;
    linkBtn.hidden = !currentInput; // random results have no stable link

    result.hidden = false;
    // Restart the reveal animation on every generation.
    card.classList.remove("reveal");
    void card.offsetWidth;
    card.classList.add("reveal");
  }

  function generateFor(name) {
    currentInput = name;
    render(window.CVEGen.generate(name || null));
    // Keep the name in ?n= so a shared link reproduces the same vuln, and so the
    // Pages Function can put it in the link-preview card (Teams, Slack, etc.).
    const query = name ? "?n=" + encodeURIComponent(name) : "";
    history.replaceState(null, "", location.pathname + query);
  }

  async function copyText(text, btn) {
    const original = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied!";
    } catch (_) {
      btn.textContent = "Copy failed";
    }
    setTimeout(() => { btn.textContent = original; }, 1500);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    generateFor(name);
  });

  randomBtn.addEventListener("click", () => {
    input.value = "";
    generateFor("");
  });

  copyBtn.addEventListener("click", () => {
    if (!current) return;
    const v = current;
    copyText(
      `${v.logo} ${v.name} (${v.cve}, CVSS ${v.cvss})\n` +
      `${v.description}\n` +
      `Vendor response: ${v.vendor}\n` +
      `Disclosed by ${v.credit} · ${location.origin}`,
      copyBtn
    );
  });

  linkBtn.addEventListener("click", () => copyText(location.href, linkBtn));

  // Shared link: ?n=Name → generate on load.
  const shared = (new URLSearchParams(location.search).get("n") || "").slice(0, 60).trim();
  if (shared) {
    input.value = shared;
    generateFor(shared);
  }
})();
