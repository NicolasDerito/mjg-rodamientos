/* CATÁLOGO POR CATEGORÍAS (mjgk-) — buscador en vivo, vanilla y defensivo.
   Filtra por categoría, familia o designación. Sin resultados -> estado vacío
   con CTA a WhatsApp (el href se rearma con el texto buscado).
   Funciona con defer; si algún elemento no existe, no hace nada. */
(function () {
  try {
    var sec = document.querySelector('.mjgk');
    if (!sec) return;
    var input = sec.querySelector('#mjgk-q');
    var clear = sec.querySelector('#mjgk-clear');
    var count = sec.querySelector('#mjgk-scount');
    var empty = sec.querySelector('#mjgk-empty');
    var emptyQ = sec.querySelector('#mjgk-empty-q');
    var emptyCta = sec.querySelector('#mjgk-empty-cta');
    if (!input) return;

    var cats = Array.prototype.slice.call(sec.querySelectorAll('.mjgk-cat'));
    if (!cats.length) return;

    var norm = function (s) {
      s = String(s == null ? '' : s).toLowerCase();
      try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
      return s.replace(/\s+/g, ' ').trim();
    };
    var enc = function (s) { try { return encodeURIComponent(s); } catch (e) { return ''; } };
    var WA = 'https://wa.me/5491136849435?text=';
    var EMPTY_MSG = 'Hola MJG Rodamientos, busqué una pieza en el catálogo y no la encontré. ¿Me ayudan a identificarla? Medida o código: ';

    var data = cats.map(function (cat) {
      var sum = cat.querySelector('.mjgk-sum');
      var fams = Array.prototype.slice.call(cat.querySelectorAll('.mjgk-fam'));
      return {
        el: cat,
        key: norm(sum ? sum.textContent : cat.textContent),
        fams: fams.map(function (f) { return { el: f, key: norm(f.textContent) }; })
      };
    });

    var aplicar = function () {
      var raw = input.value || '';
      var q = norm(raw);

      if (!q) {
        data.forEach(function (d) {
          d.el.classList.remove('mjgk-hide');
          d.el.open = false;
          d.fams.forEach(function (f) { f.el.classList.remove('mjgk-hide'); });
        });
        if (empty) empty.hidden = true;
        if (clear) clear.hidden = true;
        if (count) count.textContent = '';
        return;
      }

      var shownCats = 0, shownFams = 0;
      data.forEach(function (d) {
        var catHit = d.key.indexOf(q) !== -1;
        var hitFams = 0;
        d.fams.forEach(function (f) {
          var hit = catHit || f.key.indexOf(q) !== -1;
          f.el.classList.toggle('mjgk-hide', !hit);
          if (hit) hitFams++;
        });
        var visible = catHit || hitFams > 0;
        d.el.classList.toggle('mjgk-hide', !visible);
        if (visible) {
          shownCats++;
          shownFams += hitFams;
          d.el.open = true;
        } else {
          d.el.open = false;
        }
      });

      if (clear) clear.hidden = false;
      if (count) {
        count.textContent = shownCats
          ? shownCats + (shownCats === 1 ? ' categoría' : ' categorías') + ' \u00b7 ' +
            shownFams + (shownFams === 1 ? ' familia' : ' familias')
          : '';
      }
      if (empty) empty.hidden = shownCats > 0;
      if (emptyQ) emptyQ.textContent = raw.trim();
      if (emptyCta) emptyCta.href = WA + enc(EMPTY_MSG + raw.trim());
    };

    input.addEventListener('input', aplicar);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && input.value) { input.value = ''; aplicar(); }
    });
    if (clear) clear.addEventListener('click', function () { input.value = ''; aplicar(); input.focus(); });

    aplicar();
  } catch (err) { /* nunca romper la página por esto */ }
})();
