(() => {
  "use strict";

  const VULNS = window.VULNS || [];
  const N = VULNS.length;
  const TAU = Math.PI * 2;
  const SEG = TAU / N;
  const POINTER = -Math.PI / 2; // 12 o'clock, in canvas angle terms

  // Slice colors cycle through these; text color is paired for contrast.
  const PALETTE = [
    { fill: "#c9252c", text: "#ffffff" },
    { fill: "#1b1d2a", text: "#ecedf3" },
    { fill: "#f2a541", text: "#1a1205" },
    { fill: "#262a3d", text: "#ecedf3" },
  ];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const spinBtn = document.getElementById("spin");
  const muteBtn = document.getElementById("mute");
  const result = document.getElementById("result");
  const live = document.getElementById("live");

  let size = 0;
  let rotation = 0;
  let spinning = false;
  let lastIndex = -1;

  const norm = (a) => ((a % TAU) + TAU) % TAU;

  // Which slice is under the pointer for a given wheel rotation.
  // Slice i covers canvas angles [rotation + i*SEG, rotation + (i+1)*SEG).
  const indexAtPointer = (rot) => Math.floor(norm(POINTER - rot) / SEG) % N;

  // ---------- Drawing ----------

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    size = rect.width;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    const r = size / 2;
    const rim = Math.max(6, r * 0.035);
    const inner = r - rim;
    const fontSize = Math.max(9, Math.min(16, r * 0.072));

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(r, r);

    // Outer rim
    ctx.beginPath();
    ctx.arc(0, 0, r - 1, 0, TAU);
    ctx.fillStyle = "#2b2f44";
    ctx.fill();

    for (let i = 0; i < N; i++) {
      const start = rotation + i * SEG;
      const colors = PALETTE[i % PALETTE.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, inner, start, start + SEG);
      ctx.closePath();
      ctx.fillStyle = colors.fill;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.rotate(start + SEG / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = colors.text;
      ctx.font = `700 ${fontSize}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
      ctx.fillText(VULNS[i].label, inner - 10, 0, inner * 0.68);
      ctx.restore();
    }

    // Rim studs
    for (let i = 0; i < N; i++) {
      const a = rotation + i * SEG;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * (r - rim / 2 - 0.5), Math.sin(a) * (r - rim / 2 - 0.5), rim * 0.28, 0, TAU);
      ctx.fillStyle = "#f2a541";
      ctx.fill();
    }

    // Hub
    const hub = r * 0.15;
    ctx.beginPath();
    ctx.arc(0, 0, hub, 0, TAU);
    ctx.fillStyle = "#0b0c10";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#e5383b";
    ctx.stroke();
    ctx.fillStyle = "#ecedf3";
    ctx.font = `800 ${Math.max(10, hub * 0.42)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CVE", 0, 1);

    ctx.restore();
  }

  // ---------- Sound (tiny synthesized tick, no audio files) ----------

  let audio = null;
  let muted = false;
  try { muted = localStorage.getItem("wom-muted") === "1"; } catch (_) {}

  function renderMute() {
    muteBtn.textContent = muted ? "🔇 Sound off" : "🔊 Sound on";
    muteBtn.setAttribute("aria-pressed", String(muted));
  }

  function ensureAudio() {
    if (muted) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
    } catch (_) { audio = null; }
  }

  function tick() {
    if (muted || !audio) return;
    const t = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "square";
    osc.frequency.value = 1500;
    gain.gain.setValueAtTime(0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  // ---------- Spinning ----------

  function randomIndex() {
    // Crypto RNG, because it's a security site and we have standards.
    const buf = new Uint32Array(1);
    let i;
    do {
      crypto.getRandomValues(buf);
      i = buf[0] % N;
    } while (N > 1 && i === lastIndex);
    return i;
  }

  function spin() {
    if (spinning || N === 0) return;
    spinning = true;
    spinBtn.disabled = true;
    hideResult();
    ensureAudio();

    const target = randomIndex();
    // Land somewhere inside the slice, not dead center, so it feels less rigged.
    const jitter = (Math.random() - 0.5) * SEG * 0.7;
    const finalAngle = norm(POINTER - (target + 0.5) * SEG + jitter);
    const turns = reduceMotion ? 1 : 5 + Math.floor(Math.random() * 3);
    const delta = norm(finalAngle - norm(rotation)) + turns * TAU;

    const from = rotation;
    const duration = reduceMotion ? 1200 : 5000 + Math.random() * 1500;
    const t0 = performance.now();
    let lastSlice = indexAtPointer(rotation);

    function frame(now) {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out quart
      rotation = from + delta * eased;
      draw();

      const slice = indexAtPointer(rotation);
      if (slice !== lastSlice) {
        tick();
        lastSlice = slice;
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        rotation = norm(rotation);
        spinning = false;
        spinBtn.disabled = false;
        lastIndex = indexAtPointer(rotation);
        showResult(VULNS[lastIndex]);
      }
    }
    requestAnimationFrame(frame);
  }

  // ---------- Result card ----------

  const KIND_LABEL = { real: "REAL", forecast: "FORECAST", scheduled: "SCHEDULED" };

  function showResult(v) {
    const card = result.querySelector(".card");
    card.className = `card kind-${v.kind}`;

    const kind = document.getElementById("r-kind");
    kind.textContent = KIND_LABEL[v.kind] || v.kind.toUpperCase();
    kind.className = `chip kind-${v.kind}`;

    const sev = document.getElementById("r-sev");
    sev.textContent = v.severity;
    sev.className = `chip sev-${v.severity}`;

    document.getElementById("r-title").textContent = v.title;
    document.getElementById("r-id").textContent = v.id;
    document.getElementById("r-blurb").textContent = v.blurb;
    document.getElementById("r-status").textContent = v.status;

    result.hidden = false;
    live.textContent = `${v.title}, ${v.id}. ${v.blurb} Patch status: ${v.status}`;
  }

  function hideResult() {
    result.hidden = true;
  }

  // ---------- Input ----------

  // Tap anywhere spins, except the mute button and links.
  document.addEventListener("click", (e) => {
    if (e.target.closest("#mute, a")) return;
    spin();
  });

  document.addEventListener("keydown", (e) => {
    if (e.target !== document.body) return; // buttons handle their own Enter/Space
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      spin();
    }
  });

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    try { localStorage.setItem("wom-muted", muted ? "1" : "0"); } catch (_) {}
    renderMute();
  });

  renderMute();
  window.addEventListener("resize", resize);
  resize();
})();
