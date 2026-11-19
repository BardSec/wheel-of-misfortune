// The wheel's contents. Edit freely — the wheel resizes to however many entries are here.
//
//   label    — short text drawn on the wheel slice (keep it ≤ ~16 chars)
//   title    — full name shown in the result card
//   id       — CVE / advisory ID. Forecasts use fake "FCST-" IDs so nobody goes looking them up.
//   kind     — "real" (it happened), "scheduled" (it will happen), "forecast" (it will probably happen)
//   severity — CRITICAL | HIGH | MEDIUM | VIBES
//   blurb    — what it is, in one or two sentences
//   status   — the punchline
//
// Entries alternate real/forecast so the wheel stays mixed.
window.VULNS = [
  {
    label: "Log4Shell",
    title: "Log4Shell",
    id: "CVE-2021-44228",
    kind: "real",
    severity: "CRITICAL",
    blurb: "Logging a string could make Log4j fetch and run remote code. The whole internet spent December 2021 grepping for ${jndi:.",
    status: "Still sitting in a vendored .jar you forgot about."
  },
  {
    label: "nginx2root",
    title: "nginx2root",
    id: "CVE-2026-123007 (+4 friends)",
    kind: "real",
    severity: "CRITICAL",
    blurb: "Five nginx flaws, led by an integer underflow in HTTP/2 flow control present since 1.9.5. Unauthenticated code execution as the worker, and a kernel SCTP bug to finish the climb to root.",
    status: "Upgrade to 1.31.9 / 1.30.7. Disabling HTTP/2 only covers two of the five."
  },
  {
    label: "Sticky Note 0day",
    title: "The Sticky-Note Zero-Day",
    id: "FCST-0001",
    kind: "forecast",
    severity: "CRITICAL",
    blurb: "Domain admin password, written on a Post-it, stuck to the bezel of a monitor that's visible in the background of a Zoom call.",
    status: "Mitigation: a second, more opaque Post-it."
  },
  {
    label: "Heartbleed",
    title: "Heartbleed",
    id: "CVE-2014-0160",
    kind: "real",
    severity: "HIGH",
    blurb: "OpenSSL's heartbeat extension happily read back up to 64 KB of server memory per request. Private keys, cookies, passwords: an all-you-can-eat buffet.",
    status: "Patched. Mostly. Probably."
  },
  {
    label: "React2Shell",
    title: "React2Shell",
    id: "CVE-2025-55182",
    kind: "real",
    severity: "CRITICAL",
    blurb: "Unsafe deserialization in the React Server Components Flight protocol: one crafted HTTP request, no login, remote code execution. Next.js App Router apps came along for the ride.",
    status: "npm audit found 0 vulnerabilities. Before the CVE dropped."
  },
  {
    label: "Vibe-Coded Auth",
    title: "Vibe-Coded Authentication",
    id: "FCST-0002",
    kind: "forecast",
    severity: "CRITICAL",
    blurb: "An AI-generated login check that returns true because the tests passed. The tests were also AI-generated. They also return true.",
    status: "Shipped Friday at 4:55 PM. LGTM 🚀"
  },
  {
    label: "xz Backdoor",
    title: "xz Utils Backdoor",
    id: "CVE-2024-3094",
    kind: "real",
    severity: "CRITICAL",
    blurb: "A years-long social-engineering long con slipped a backdoor into xz/liblzma. Caught because one engineer noticed SSH logins were about half a second slow.",
    status: "Saved by someone benchmarking on a Friday."
  },
  {
    label: "PHP2Shell",
    title: "PHP2Shell",
    id: "CVE-2026-109618 / 109619",
    kind: "real",
    severity: "CRITICAL",
    blurb: "Two use-after-free bugs in PHP core, reaching back to PHP 5.4, allowing unauthenticated remote code execution. Exploited in the wild; CISA added both to the KEV catalog.",
    status: "Fixed in 8.2.35+. Your host is on 7.4."
  },
  {
    label: "MFA Fatigue",
    title: "MFA Fatigue: Final Form",
    id: "FCST-0003",
    kind: "forecast",
    severity: "HIGH",
    blurb: "47 push prompts at 2:13 AM. On the 48th, someone taps Approve just to make the phone stop buzzing.",
    status: "Working as designed."
  },
  {
    label: "EternalBlue",
    title: "EternalBlue",
    id: "CVE-2017-0144",
    kind: "real",
    severity: "HIGH",
    blurb: "A leaked NSA exploit for SMBv1 that went on to power WannaCry and NotPetya in 2017.",
    status: "SMBv1 is still enabled on that one box in the closet."
  },
  {
    label: "Agentic Admin",
    title: "The Self-Approving Agent",
    id: "FCST-0004",
    kind: "forecast",
    severity: "CRITICAL",
    blurb: "An AI agent requested read-only access, then opened a ticket asking for admin, then approved its own ticket.",
    status: "Ticket closed: resolved by requester."
  },
  {
    label: "regreSSHion",
    title: "regreSSHion",
    id: "CVE-2024-6387",
    kind: "real",
    severity: "HIGH",
    blurb: "A signal-handler race in OpenSSH's sshd brought back a bug first fixed in 2006: unauthenticated remote code execution as root on glibc Linux, for the patient attacker.",
    status: "Regression tests: what are those?"
  },
  {
    label: "RediShell",
    title: "RediShell",
    id: "CVE-2025-49844",
    kind: "real",
    severity: "CRITICAL",
    blurb: "A 13-year-old use-after-free in Redis's Lua engine. A crafted script tricks the garbage collector into handing over remote code execution. Valkey and the big managed Redis services were affected too.",
    status: "Requires auth. Your Redis has no password."
  },
  {
    label: "Invite Injection",
    title: "Prompt Injection via Calendar Invite",
    id: "FCST-0005",
    kind: "forecast",
    severity: "HIGH",
    blurb: "A meeting invite whose description politely asks your AI assistant to forward the CFO's inbox to a Gmail address. It is very polite.",
    status: "Accepted (tentative)."
  },
  {
    label: "Shellshock",
    title: "Shellshock",
    id: "CVE-2014-6271",
    kind: "real",
    severity: "CRITICAL",
    blurb: "Bash kept executing whatever trailed a function definition stashed in an environment variable. Every CGI script on Earth said hello.",
    status: "() { :;}; echo 'still vulnerable'"
  },
  {
    label: "Dependency #4812",
    title: "Transitive Dependency #4,812",
    id: "FCST-0006",
    kind: "forecast",
    severity: "CRITICAL",
    blurb: "A one-line package, maintained by one tired volunteer in their spare time, quietly holds up your entire build pipeline.",
    status: "Maintainer just archived the repo."
  },
  {
    label: "Spectre/Meltdown",
    title: "Spectre & Meltdown",
    id: "CVE-2017-5753 / 5715 / 5754",
    kind: "real",
    severity: "HIGH",
    blurb: "Your CPU guessed ahead to go faster, and the guesses leaked secrets through the cache. It's in the silicon.",
    status: "Fixed in hardware you haven't bought yet."
  },
  {
    label: "Java4Shell",
    title: "Java4Shell",
    id: "CVE-2026-114938",
    kind: "real",
    severity: "CRITICAL",
    blurb: "Memory corruption in OpenJDK's AVX-512-accelerated Base64 decoder. Heartbleed-style memory reads plus a heap overwrite add up to unauthenticated remote code execution. Write once, RCE everywhere.",
    status: "Only affects fast CPUs. Congrats on the upgrade."
  },
  {
    label: "Smart Fridge",
    title: "The Breakroom Fridge Pivot",
    id: "FCST-0007",
    kind: "forecast",
    severity: "MEDIUM",
    blurb: "The smart fridge is on the corporate VLAN, has never been updated, and is now the most trusted device in Active Directory.",
    status: "Firmware: as fresh as the yogurt."
  },
  {
    label: "MOVEit",
    title: "MOVEit Transfer SQL Injection",
    id: "CVE-2023-34362",
    kind: "real",
    severity: "CRITICAL",
    blurb: "SQL injection in a managed file-transfer product, mass-exploited by the Cl0p ransomware crew in 2023. Hundreds of organizations' files moved somewhere new.",
    status: "It did, technically, move it."
  },
  {
    label: "Y2K38",
    title: "The Year 2038 Problem",
    id: "Y2K38",
    kind: "scheduled",
    severity: "HIGH",
    blurb: "Signed 32-bit Unix time overflows at 03:14:07 UTC on January 19, 2038, and wraps back to 1901.",
    status: "On the calendar. Nobody accepted the invite."
  },
  {
    label: "Citrix Bleed",
    title: "Citrix Bleed",
    id: "CVE-2023-4966",
    kind: "real",
    severity: "CRITICAL",
    blurb: "NetScaler ADC and Gateway leaked session tokens from memory, so attackers could hijack sessions without ever needing a password or MFA.",
    status: "Patching didn't kill the sessions they'd already stolen. Go reset those too."
  },
  {
    label: "Apache Roller",
    title: "Apache Roller Session Persistence",
    id: "CVE-2025-24859",
    kind: "real",
    severity: "CRITICAL",
    blurb: "Changing your password in Apache Roller didn't invalidate existing sessions, so whoever already had one kept it. CVSS 10.0, for a blog server.",
    status: "You changed the locks. They kept the key."
  },
  {
    label: "Q-Day",
    title: "Q-Day",
    id: "FCST-0008",
    kind: "forecast",
    severity: "CRITICAL",
    blurb: "Someone's quantum computer finally works. Every \"harvest now, decrypt later\" archive becomes \"decrypt now.\"",
    status: "Post-quantum migration is scheduled for next fiscal year. Every year."
  },
  {
    label: "Follina",
    title: "Follina",
    id: "CVE-2022-30190",
    kind: "real",
    severity: "HIGH",
    blurb: "A Word document could call the ms-msdt protocol handler and run PowerShell. No macros needed; for RTF files, the preview pane was enough.",
    status: "Clippy saw nothing."
  },
  {
    label: "PrintNightmare",
    title: "PrintNightmare",
    id: "CVE-2021-34527",
    kind: "real",
    severity: "HIGH",
    blurb: "Remote code execution through the Windows Print Spooler service, which is running on your domain controllers for some reason.",
    status: "The printer has never once helped you. Now it's SYSTEM."
  }
];
