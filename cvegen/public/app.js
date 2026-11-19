(() => {
  "use strict";

  const generateBtn = document.getElementById("generate");
  const result = document.getElementById("result");
  const card = result.querySelector(".card");
  const copyBtn = document.getElementById("copy");
  const linkBtn = document.getElementById("link");

  let current = null;

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

    result.hidden = false;
    generateBtn.textContent = "Generate another";
    // Restart the reveal animation on every generation.
    card.classList.remove("reveal");
    void card.offsetWidth;
    card.classList.add("reveal");
  }

  function show(seed) {
    const v = window.CVEGen.generate(seed);
    render(v);
    // Put the seed in ?v= so the link reproduces this vuln, and so the Pages
    // Function can put it in the link-preview card (Teams, Slack, etc.).
    history.replaceState(null, "", location.pathname + "?v=" + v.code);
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

  generateBtn.addEventListener("click", () => show());

  copyBtn.addEventListener("click", () => {
    if (!current) return;
    const v = current;
    copyText(
      `${v.logo} ${v.name} (${v.cve}, CVSS ${v.cvss})\n` +
      `${v.description}\n` +
      `Vendor response: ${v.vendor}\n` +
      `Disclosed by ${v.credit} · ${location.href}`,
      copyBtn
    );
  });

  linkBtn.addEventListener("click", () => copyText(location.href, linkBtn));

  // Shared link: ?v=<code> → show that vuln on load.
  const shared = window.CVEGen.decodeSeed(new URLSearchParams(location.search).get("v"));
  if (shared != null) show(shared);
})();
