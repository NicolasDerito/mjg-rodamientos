/* MJG Rodamientos · interacciones (sin dependencias) */
(function () {
  "use strict";
  var WA = "https://wa.me/5491136849435";
  function wa(msg) { return WA + "?text=" + encodeURIComponent(msg); }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* header */
  var hdr = document.getElementById("hdr");
  function onScroll() { if (hdr) hdr.classList.toggle("on", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* menú mobile */
  var burger = document.getElementById("burger");
  var mnav = document.getElementById("mnav");
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var abrir = mnav.hasAttribute("hidden");
      if (abrir) mnav.removeAttribute("hidden"); else mnav.setAttribute("hidden", "");
      burger.setAttribute("aria-expanded", abrir ? "true" : "false");
    });
    mnav.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") {
        mnav.setAttribute("hidden", "");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* aparición */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(rv, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(rv, function (el) { el.classList.add("in"); });
  }

  /* buscador */
  var DATA = [
    ["Rodamientos", "Rígidos de bolillas serie 6000", "6000"],
    ["Rodamientos", "Rígidos de bolillas serie 6200", "6204 2RS"],
    ["Rodamientos", "Rígidos de bolillas serie 6300", "6305 ZZ"],
    ["Rodamientos", "Rodillos cónicos serie 30000", "30206"],
    ["Rodamientos", "Rodillos cónicos serie 32000", "32010 X"],
    ["Rodamientos", "Autoalineantes y a rótula", "1207 K"],
    ["Rodamientos", "De agujas y rodillos", "HK 2020"],
    ["Rodamientos", "Axiales y de empuje", "51104"],
    ["Rodamientos", "Alta temperatura e inoxidable", "6205 2RS HT"],
    ["Rodamientos", "Micro y miniaturas", "608"],
    ["Soportes y unidades", "Unidades autoalineantes de pie", "UCP 205"],
    ["Soportes y unidades", "Unidades de brida cuadrada", "UCF 205"],
    ["Soportes y unidades", "Unidades de brida ovalada", "UCFL 205"],
    ["Soportes y unidades", "Soportes y cajas partidas", "SN 510"],
    ["Soportes y unidades", "Rótulas y cabezas de rótula", "GE 20 ES"],
    ["Soportes y unidades", "Bujes y casquillos", "PAP 2020"],
    ["Transmisión de potencia", "Correas trapeciales A / B / C", "A-38"],
    ["Transmisión de potencia", "Correas dentadas", "HTD 5M"],
    ["Transmisión de potencia", "Correas poly-V", "PJ 6 canales"],
    ["Transmisión de potencia", "Cadenas de rodillos", "08B-1"],
    ["Transmisión de potencia", "Piñones para cadena", "16B Z18"],
    ["Transmisión de potencia", "Poleas y acoplamientos", "SPA 100"],
    ["Retenes y sellos", "Retenes de simple labio NBR", "25x47x7"],
    ["Retenes y sellos", "Retenes de doble labio NBR", ""],
    ["Retenes y sellos", "Retenes de Vitón (alta temperatura)", "FKM"],
    ["Retenes y sellos", "Anillos O y juntas", "NBR 70"],
    ["Retenes y sellos", "Sellos mecánicos", ""],
    ["Mangueras industriales", "Mangueras para aire", ""],
    ["Mangueras industriales", "Mangueras hidráulicas", ""],
    ["Mangueras industriales", "Conexiones y fittings", ""],
    ["Mangueras industriales", "Abrazaderas y accesorios", ""],
    ["Lubricación y mantenimiento", "Grasas y lubricantes", ""],
    ["Lubricación y mantenimiento", "Aceites industriales", ""],
    ["Lubricación y mantenimiento", "Extractores y desmontaje", "Extractor de 2 garras"],
    ["Lubricación y mantenimiento", "Calentadores por inducción", "Placa 3,6 kVA"],
    ["Lubricación y mantenimiento", "Tuercas y llaves de precisión", "KM 10"],
    ["Lubricación y mantenimiento", "Pinzas para retenes y seguros", "Pinza recta"],
    ["Lubricación y mantenimiento", "Instrumentos de medición", "Comparador 0,01 mm"],
    ["Lubricación y mantenimiento", "Prensas y montaje hidráulico", "Bomba manual 700 bar"],
    ["Lubricación y mantenimiento", "Kits de armado y mantenimiento", "Kit de montaje"]
  ];
  var MARCAS = ["isb", "skf", "fag", "ina", "timken", "ntn", "nsk", "koyo", "gates", "optibelt"];

  function norm(s) {
    return (s || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  var q = document.getElementById("q");
  var res = document.getElementById("res");
  var chips = document.getElementById("chips");
  var btn = document.getElementById("buscarBtn");
  var ultima = "";

  function pintar(texto) {
    if (!res) return;
    var t = norm(texto);
    ultima = texto;
    if (t.length < 2) {
      res.innerHTML = '<li class="res-empty">Escribí un <b>código</b> (6205), una <b>marca</b> (SKF) o una <b>palabra</b> (correa). También podés tocar los ejemplos de arriba.</li>';
      return;
    }
    var hits = [];
    for (var i = 0; i < DATA.length; i++) {
      var d = DATA[i];
      if (norm(d[0] + " " + d[1] + " " + d[2]).indexOf(t) > -1) hits.push(d);
    }
    for (var m = 0; m < MARCAS.length; m++) {
      if (MARCAS[m].indexOf(t) > -1 || t.indexOf(MARCAS[m]) > -1) hits.push(["Marcas", MARCAS[m].toUpperCase() + " · línea disponible a consulta", ""]);
    }
    if (!hits.length) {
      res.innerHTML = '<li class="res-empty">No figura con ese texto en el índice. Igual lo buscamos: <a href="' +
        wa("Hola MJG Rodamientos, busque en el catalogo y no encontre: " + texto + ". Me ayudan a identificarlo?") +
        '" target="_blank" rel="noopener" style="color:var(--grn);font-weight:600">consultar por WhatsApp</a>.</li>';
      return;
    }
    var html = "";
    for (var k = 0; k < hits.length && k < 14; k++) {
      var it = hits[k];
      html += '<li><a href="' + wa("Hola MJG Rodamientos, quiero consultar por: " + it[1] + (it[2] ? " (" + it[2] + ")" : "") + ". ") +
        '" target="_blank" rel="noopener"><span>' + it[1] + '</span><span class="r-cat">' + (it[2] ? it[0] + " · " + it[2] : it[0]) + '</span></a></li>';
    }
    res.innerHTML = html;
  }

  if (q) {
    q.addEventListener("input", function () { pintar(q.value); });
    pintar("");
  }
  if (btn && q) btn.addEventListener("click", function () { pintar(q.value); q.focus(); });
  if (q) q.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); pintar(q.value); } });
  if (chips) {
    chips.addEventListener("click", function (e) {
      if (e.target && e.target.className === "chip") { if (q) { q.value = e.target.textContent; pintar(q.value); q.focus(); } }
    });
  }

  /* formulario corto -> WhatsApp */
  var form = document.getElementById("formConsulta");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = (document.getElementById("fNombre") || {}).value || "";
      var c = (document.getElementById("fContacto") || {}).value || "";
      var t = (document.getElementById("fTexto") || {}).value || "";
      var msg = "Hola MJG Rodamientos, quiero solicitar una cotizacion.";
      if (n.trim()) msg += " Soy " + n.trim() + ".";
      if (t.trim()) msg += " Necesito: " + t.trim() + ".";
      if (c.trim()) msg += " Mi contacto: " + c.trim() + ".";
      window.open(wa(msg), "_blank", "noopener");
    });
  }
})();
