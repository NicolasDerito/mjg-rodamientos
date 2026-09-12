/* ============================================================
   COTIZADOR MJG — mjgq-   (JS vanilla, defensivo)
   Arma el mensaje y el link wa.me. Si falta un elemento,
   no rompe: cada referencia se usa con guarda.
   Prefill opcional para demo/captura (no afecta al sitio):
     ?mjgqStep=3&mjgqPieza=Rodamiento&mjgqMedida=6204+2RS&mjgqCant=4&mjgqZona=Lan%C3%BAs
   ============================================================ */
(function () {
  "use strict";

  var WA_NUMBER = "5491136849435";            /* único número de MJG Rodamientos */
  var HELP_KIND = "No sé, necesito ayuda";    /* valor del chip "no sé" */
  var GENERIC_MSG = "Hola MJG Rodamientos \u{1F44B} Quiero cotizar una pieza. " +
    "Todav\u00EDa no tengo la medida ni el c\u00F3digo, \u00BFme ayudan a identificarla? " +
    "Puedo mandar una foto.";

  var root = document.querySelector(".mjgq");
  if (!root) { return; }

  var q = function (sel) { return root.querySelector(sel); };
  var qa = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };

  var steps = qa(".mjgq-step");
  var total = steps.length || 3;
  var current = 1;

  var dots = qa(".mjgq-dot");
  var railFill = q(".mjgq-rail-fill");
  var countEl = q(".mjgq-count");
  var sendLink = q(".mjgq-btn-wa");
  var preview = q(".mjgq-preview-b");
  var helpBox = q(".mjgq-help");
  var m2Label = q(".mjgq-m2-label");
  var inMeasure = q("#mjgq-medida");
  var inQty = q("#mjgq-cant");
  var inZone = q("#mjgq-zona");
  var radios = qa(".mjgq-radio");
  var chips = qa(".mjgq-chip");

  var state = { kind: "", measure: "", qty: "", zona: "" };

  /* ---------- mensaje ---------- */
  function buildMessage() {
    var kind = state.kind;
    var measure = state.measure.replace(/\s+/g, " ").trim();
    var qty = state.qty.replace(/\s+/g, " ").trim();
    var zona = state.zona.replace(/\s+/g, " ").trim();

    if (!kind && !measure && !qty && !zona) { return GENERIC_MSG; }

    var lines = ["Hola MJG Rodamientos \u{1F44B} Quiero cotizar:"];
    lines.push("\u2022 Pieza: " + (kind || "a definir"));
    lines.push("\u2022 Medida/c\u00F3digo: " + (measure || "no la tengo, puedo mandar una foto"));
    if (qty) { lines.push("\u2022 Cantidad: " + qty); }
    if (zona) { lines.push("\u2022 Zona: " + zona); }
    lines.push("\u00BFMe pasan precio y disponibilidad?");
    return lines.join("\n");
  }

  function waUrl() {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(buildMessage());
  }

  /* ---------- sincronizar link + vista previa ---------- */
  function sync() {
    var text = buildMessage();
    if (sendLink) {
      sendLink.setAttribute("href", waUrl());
      sendLink.setAttribute("target", "_blank");
      sendLink.setAttribute("rel", "noopener");
    }
    if (preview) { preview.textContent = text; }
  }

  /* ---------- ayuda del paso 2 según la pieza elegida ---------- */
  function applyKind() {
    var isHelp = state.kind === HELP_KIND;
    if (helpBox) {
      if (isHelp) { helpBox.removeAttribute("hidden"); } else { helpBox.setAttribute("hidden", ""); }
    }
    if (m2Label) { m2Label.textContent = isHelp ? "Contanos qué es la pieza" : "Medida o código"; }
    if (inMeasure) {
      inMeasure.setAttribute("placeholder", isHelp ? "Ej.: es del eje de una bomba / no lo sé" : "Ej.: 6204 2RS");
    }
  }

  /* ---------- navegación de pasos ---------- */
  function goTo(n) {
    n = Math.max(1, Math.min(total, n));
    current = n;

    steps.forEach(function (s, i) {
      var active = (i + 1) === n;
      s.classList.toggle("is-active", active);
      if (active) { s.removeAttribute("hidden"); } else { s.setAttribute("hidden", ""); }
    });

    dots.forEach(function (d, i) {
      var idx = i + 1;
      d.classList.toggle("is-on", idx === n);
      d.classList.toggle("is-done", idx < n);
    });

    if (countEl) { countEl.textContent = "Paso " + n + " de " + total; }
    if (railFill) { railFill.style.width = ((n / total) * 100).toFixed(2) + "%"; }

    sync();

    var step = steps[n - 1];
    if (step && typeof step.focus === "function") {
      try { step.focus({ preventScroll: true }); } catch (e) { step.focus(); }
    }
  }

  /* ---------- eventos ---------- */
  radios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      state.kind = radio.value;
      chips.forEach(function (c) { c.classList.remove("is-sel"); });
      var label = radio.parentNode;
      if (label && label.classList) { label.classList.add("is-sel"); }
      applyKind();
      sync();
    });
  });

  if (inMeasure) {
    inMeasure.addEventListener("input", function () { state.measure = inMeasure.value; sync(); });
  }
  if (inQty) {
    inQty.addEventListener("input", function () { state.qty = inQty.value; sync(); });
  }
  if (inZone) {
    inZone.addEventListener("input", function () { state.zona = inZone.value; sync(); });
  }

  qa(".mjgq-next").forEach(function (b) {
    b.addEventListener("click", function () { goTo(current + 1); });
  });
  qa(".mjgq-back").forEach(function (b) {
    b.addEventListener("click", function () { goTo(current - 1); });
  });

  /* Enter en los campos: avanza (o deja el foco en el botón de WhatsApp) */
  [inMeasure, inQty, inZone].forEach(function (input) {
    if (!input) { return; }
    input.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter") { return; }
      ev.preventDefault();
      if (current < total) { goTo(current + 1); }
      else if (sendLink && typeof sendLink.focus === "function") { sendLink.focus(); }
    });
  });

  /* ---------- prefill opcional (demo / captura) ---------- */
  try {
    var params = new URLSearchParams(window.location.search);
    var pStep = parseInt(params.get("mjgqStep"), 10);

    var pKind = params.get("mjgqPieza");
    if (pKind) {
      radios.forEach(function (r) {
        if (r.value === pKind) {
          r.checked = true;
          state.kind = r.value;
          if (r.parentNode && r.parentNode.classList) { r.parentNode.classList.add("is-sel"); }
        }
      });
      applyKind();
    }

    var pMeasure = params.get("mjgqMedida");
    if (pMeasure && inMeasure) { inMeasure.value = pMeasure; state.measure = pMeasure; }

    var pQty = params.get("mjgqCant");
    if (pQty && inQty) { inQty.value = pQty; state.qty = pQty; }

    var pZona = params.get("mjgqZona");
    if (pZona && inZone) { inZone.value = pZona; state.zona = pZona; }

    if (pStep && pStep >= 1 && pStep <= total) { goTo(pStep); return; }
  } catch (e) { /* sin prefill: seguimos en el paso 1 */ }

  applyKind();
  goTo(1);
})();
