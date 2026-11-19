// Word lists and naming patterns for the CVE name generator.
// Same input name always produces the same vulnerability (seeded RNG), Wu-Tang-generator style.
// Edit the lists freely — keep entries short, they get glued together.
(() => {
  "use strict";

  // ---------- Seeded randomness ----------

  // FNV-1a string hash → 32-bit seed
  function hashString(s) {
    let h = 2166136261 >>> 0;
    for (const ch of s) {
      h ^= ch.codePointAt(0);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // mulberry32: tiny deterministic PRNG returning floats in [0, 1)
  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

  // ---------- Word lists ----------

  // Things that get pwned. Lowercase entries keep the whole name lowercase (like nginx2root).
  const TARGETS = [
    "Log", "PHP", "nginx", "YAML", "JSON", "CSV", "SVG", "GIF", "PDF", "Excel", "Regex",
    "Emoji", "Unicode", "Markdown", "Cron", "DNS", "LDAP", "SMB", "NTP", "Kerberos",
    "Printer", "Copier", "Projector", "Smartboard", "Chromebook", "Bluetooth", "WiFi", "USB",
    "HDMI", "Fridge", "Toaster", "Thermostat", "Doorbell", "Elevator", "Vending", "Badge",
    "Lanyard", "Vacuum", "Chatbot", "Agent", "Prompt", "Cookie", "Calendar", "Spreadsheet",
    "Webhook", "Docker", "Kube", "Helm", "npm", "pip", "curl", "grep", "tar", "sudo",
  ];

  const CONNECTORS = ["2", "4", "2", "4", "2", "To"];

  const PAYLOADS = [
    "Shell", "Root", "Pwn", "RCE", "Admin", "Owned", "Sudo", "Kernel", "Ransom", "Chaos",
    "Doom", "SYSTEM", "Takeover", "Escape", "Leak", "Bleed", "Panic",
  ];

  const BLEED_WORDS = [
    "Toaster", "Lanyard", "Spreadsheet", "Calendar", "Fridge", "Badge", "Emoji", "Cookie",
    "Printer", "Thermostat", "Smartboard", "Payroll", "Stapler", "Cafeteria", "Parking",
  ];

  // Hand-made acronym puns, regreSSHion-style.
  const PUNS = [
    "SMBarrassment", "XSStential Crisis", "DNSaster", "RCEssion", "CVEsuvius", "APIcalypse",
    "SSHenanigans", "KerbeROASTED", "LDAPocalypse", "SQLiquidation", "VPNdemic", "SSOrry",
    "MFAiled", "IoTsunami", "DNSecration", "TLSunami", "CRONic Fatigue", "XSSive Force",
    "USBetrayal", "SQLaughter", "NTPanic", "JSONdemonium",
  ];

  const ANIMALS = [
    "Goose", "Llama", "Raccoon", "Possum", "Ferret", "Pigeon", "Badger", "Walrus",
    "Capybara", "Moose", "Gecko", "Platypus",
  ];
  const NIGHTMARE_THINGS = [
    "Lanyard", "Spreadsheet", "Calendar", "Badge", "Cafeteria", "Projector", "Parking",
    "Webcam", "Gradebook", "Hallpass", "Stapler",
  ];
  const PROXY_THINGS = ["Panic", "Shame", "Llama", "Regret", "Gremlin", "Mayhem", "Lunch"];
  const ZERO_THINGS = ["Lunch", "Chill", "Budget", "Sleep", "Patience", "Coffee", "Context"];
  const COLORS = ["Beige", "Mauve", "Chartreuse", "Taupe", "Puce", "Teal", "Magenta", "Ecru"];

  // Never "generate" an actual existing vuln name.
  const REAL_NAMES = new Set([
    "log4shell", "php2shell", "nginx2root", "java4shell", "react2shell", "redishell",
    "heartbleed", "citrixbleed", "zerologon", "eternalblue", "bluekeep", "printnightmare",
    "proxylogon", "proxyshell", "proxynotshell", "dirtycow", "dirtypipe", "regresshion",
  ]);

  // ---------- Flavor text ----------

  const ACTORS = [
    "intern", "smart fridge", "substitute teacher", "disgruntled robot vacuum", "AI agent",
    "LinkedIn recruiter", "former employee", "squirrel", "middle schooler", "vendor sales rep",
    "pigeon carrying a thumb drive", "board member's nephew", "printer", "browser extension",
  ];
  const IMPACTS = [
    "gain root", "read every email", "order 400 pizzas to the server room",
    "become domain admin", "rename every printer to \"HELP\"", "mine crypto on the smartboards",
    "rewrite the lunch menu", "disable MFA for everyone", "reply-all to the entire organization",
    "change everyone's wallpaper to a goose", "exfiltrate the gradebook", "set the thermostat to 85",
    "approve their own access request", "delete the backups (and the backups of the backups)",
  ];
  const VECTORS = [
    "a malformed emoji", "a 1×1 GIF", "a calendar invite", "an extremely long filename",
    "a cursed PDF", "a QR code on a flyer", "a carefully worded Slack message",
    "a USB stick labeled \"Payroll\"", "a single misplaced YAML indent", "a leap second",
    "a spreadsheet with 1,048,577 rows", "a very polite prompt", "a Bluetooth pairing request named \"Free Wi-Fi\"",
    "an unescaped apostrophe in the name O'Brien",
  ];
  const VENDOR_RESPONSES = [
    "Working as intended.",
    "We take security very seriously.",
    "Fixed in the next major version (ETA 2031).",
    "Customers should simply not use the product.",
    "Closed as duplicate of a ticket from 2019.",
    "Our AI triaged this as low severity.",
    "Out of office until Monday.",
    "Disputed. Also, please delete your blog post.",
    "Patch available for customers on the Platinum Plus plan.",
    "Have you tried turning it off and on again?",
  ];
  const CVSS = ["10.0", "10.0", "10.0", "9.8", "9.9", "9.8", "11.0 (vendor disputes)", "3.1 (according to the vendor)"];
  const LOGOS = ["🔥", "💀", "🐛", "🦠", "🧨", "💣", "🐍", "🦀", "🐙", "🕷️", "🦂", "🧟", "👻", "🌋", "☢️", "⚡", "🧀", "🦆", "🪳", "🐐", "🦝", "🪿"];
  const TLDS = [".lol", ".wtf", ".fail", ".sh", ".io", ".exposed"];

  // ---------- Name patterns ----------

  function connectorName(rng) {
    const target = pick(rng, TARGETS);
    let payload = pick(rng, PAYLOADS);
    if (target === target.toLowerCase()) payload = payload.toLowerCase();
    return target + pick(rng, CONNECTORS) + payload;
  }

  const PATTERNS = [
    // weight, generator
    [40, connectorName],
    [12, (rng) => pick(rng, BLEED_WORDS) + "bleed"],
    [18, (rng) => pick(rng, PUNS)],
    [6, (rng) => "Dirty " + pick(rng, ANIMALS)],
    [6, (rng) => pick(rng, NIGHTMARE_THINGS) + "Nightmare"],
    [6, (rng) => "Proxy" + pick(rng, PROXY_THINGS)],
    [6, (rng) => "Zero" + pick(rng, ZERO_THINGS)],
    [3, (rng) => "Eternal" + pick(rng, COLORS)],
    [3, (rng) => pick(rng, COLORS) + "Keep"],
  ];
  const TOTAL_WEIGHT = PATTERNS.reduce((sum, [w]) => sum + w, 0);

  function makeName(rng) {
    for (let tries = 0; tries < 20; tries++) {
      let roll = rng() * TOTAL_WEIGHT;
      for (const [weight, gen] of PATTERNS) {
        roll -= weight;
        if (roll < 0) {
          const name = gen(rng);
          if (!REAL_NAMES.has(name.toLowerCase().replace(/[^a-z0-9]/g, ""))) return name;
          break;
        }
      }
    }
    return "SMBarrassment";
  }

  // ---------- Public API ----------

  // name: the person's name (string) or null for a random vuln.
  function generate(name) {
    const clean = (name || "").trim().replace(/\s+/g, " ");
    const seed = clean
      ? hashString(clean.toLowerCase())
      : crypto.getRandomValues(new Uint32Array(1))[0];
    const rng = mulberry32(seed);

    const vulnName = makeName(rng);
    const year = pick(rng, [2026, 2027]);
    const number = 100000 + Math.floor(rng() * 900000);
    const slug = vulnName.toLowerCase().replace(/[^a-z0-9]/g, "");

    return {
      name: vulnName,
      cve: `CVE-${year}-${number}`,
      cvss: pick(rng, CVSS),
      logo: pick(rng, LOGOS),
      description: `Allows an unauthenticated ${pick(rng, ACTORS)} to ${pick(rng, IMPACTS)} via ${pick(rng, VECTORS)}.`,
      vendor: pick(rng, VENDOR_RESPONSES),
      website: slug + pick(rng, TLDS),
      credit: clean || "Anonymous Researcher",
    };
  }

  globalThis.CVEGen = { generate };
})();
